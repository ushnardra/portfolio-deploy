/**
 * Build-time RAG indexer.
 *
 * Reads knowledge-base.md, splits it on its heading structure, embeds each
 * chunk with all-MiniLM-L6-v2 (via @xenova/transformers — ONNX, no PyTorch),
 * and writes a single JSON file that ships with the static site.
 *
 * No vector database. The knowledge base is ~25 chunks; a cosine loop over 25
 * vectors in the browser is microseconds. Chroma solves a problem we don't have.
 *
 *   node Chatbot/build-embeddings.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from '@xenova/transformers';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(HERE, 'knowledge-base.md');
const OUT = resolve(HERE, '..', 'public', 'chatbot-index.json');

const MODEL = 'Xenova/all-MiniLM-L6-v2';
const MAX_CHARS = 1800;

// §12 is authoring guidance for the bot, not facts about Ushnardra. Its rules
// live in the system prompt instead; retrieving it would let a visitor pull the
// bot's own instructions back out as if they were an answer.
const SKIP_SECTIONS = [/^12\./];

/* ---------------------------------------------------------------- chunking */

/** Split on `## ` headings, then on `### ` headings inside them. */
function splitSections(markdown) {
  // Drop the title block and the leading blockquote note.
  const body = markdown.split('\n---\n').slice(1).join('\n---\n');
  const chunks = [];

  for (const raw of body.split(/\n(?=## )/)) {
    const part = raw.trim().replace(/^-+$|^-+/gm, '').trim();
    if (!part.startsWith('##')) continue;

    const section = part.split('\n')[0].replace(/^#+/, '').trim();
    if (SKIP_SECTIONS.some((re) => re.test(section))) continue;

    const subParts = part.split(/\n(?=### )/);

    // The FAQ is a run of bold-question / answer pairs. Packed into one chunk
    // its individual answers get diluted and short queries miss them, so each
    // Q&A becomes its own chunk — the tightest retrieval unit in the whole KB.
    if (/^9\./.test(section)) {
      for (const qa of splitFaq(part, section)) chunks.push(qa);
      continue;
    }

    if (subParts.length === 1) {
      for (const piece of cap(part)) chunks.push({ section, sub: '', text: piece });
      continue;
    }

    // Text before the first ### still belongs to the parent section.
    const intro = subParts[0].trim();
    if (intro.split('\n').length > 1) chunks.push({ section, sub: '', text: intro });

    for (const sub of subParts.slice(1)) {
      const s = sub.trim();
      const subTitle = s.split('\n')[0].replace(/^#+/, '').trim();
      // Prefix the parent heading so the sub-chunk carries its context.
      for (const piece of cap(`## ${section}\n\n${s}`)) {
        chunks.push({ section, sub: subTitle, text: piece });
      }
    }
  }
  return chunks;
}

/**
 * What gets EMBEDDED for a chunk, which is not always what gets SENT.
 *
 * Markdown tables embed badly: a row like `| Location | Kolkata |` reads as
 * pipes and padding, not as a sentence, so "where are you based?" failed to
 * match the Identity table at all. Restating each row as "Location: Kolkata"
 * puts it back in the model's distribution. The original markdown is still what
 * reaches the LLM — this rewrite only steers retrieval.
 */
/**
 * Extra phrasings prepended to a section's embedded text (never to what the
 * LLM sees). Visitors ask in the second person — "where are YOU based", "what's
 * YOUR github" — while the knowledge base is third-person prose about
 * Ushnardra, and MiniLM scores that mismatch low enough to fall under the
 * relevance floor. These are the same questions in the voice they get asked in.
 * A hand-written alias list beats lowering the floor, which would let genuine
 * off-topic questions through everywhere else.
 */
const QUERY_ALIASES = [
  {
    match: /^1\./,
    text: `Who are you? What is your name? Tell me about yourself. Who is Ushnardra
Ghosh? Where are you based, where are you located, what city and country?
What is your email address, phone number, WhatsApp? What is your GitHub,
your LinkedIn, your social profiles? Are you an agency or one person?`,
  },
  {
    match: /^11\./,
    text: `How do I contact you, reach you, get in touch, email you, call you,
message you on WhatsApp? What is your email address and phone number?`,
  },
];

function embedText(text, section = '') {
  const alias = QUERY_ALIASES.find((a) => a.match.test(section));
  const prefix = alias ? `${alias.text}\n\n` : '';
  return prefix + flattenTables(text);
}

function flattenTables(text) {
  return text
    .split('\n')
    .map((line) => {
      if (!/^\s*\|/.test(line)) return line;
      if (/^\s*\|[\s|:-]+\|\s*$/.test(line)) return ''; // separator row
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length === 2) {
        if (/^(field|value)$/i.test(cells[0])) return ''; // header row
        return `${cells[0]}: ${cells[1]}`;
      }
      return cells.join(' — ');
    })
    .filter((l) => l !== '')
    .join('\n');
}

/** One chunk per `**Question?**` + answer pair. */
function splitFaq(part, section) {
  const out = [];
  // Split before each bold line that ends in a question mark.
  for (const block of part.split(/\n\n(?=\*\*.+\?\*\*)/)) {
    const b = block.trim();
    const m = b.match(/^\*\*(.+\?)\*\*/);
    if (!m) continue; // the section heading / intro line
    out.push({ section, sub: m[1], text: `FAQ — ${b}` });
  }
  return out;
}

/** Break an over-long chunk on paragraph boundaries, repeating the heading. */
function cap(text) {
  if (text.length <= MAX_CHARS) return [text];
  const header = text.split('\n')[0];
  const out = [];
  let current = '';
  for (const para of text.split('\n\n')) {
    if (current && current.length + para.length + 2 > MAX_CHARS) {
      out.push(current.trim());
      current = `${header}\n\n${para}`;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

/* --------------------------------------------------------------- embedding */

const markdown = await readFile(SOURCE, 'utf8');
const chunks = splitSections(markdown);
console.log(`Parsed ${chunks.length} chunks from knowledge-base.md`);

console.log(`Loading ${MODEL} (first run downloads ~25 MB)...`);
const embed = await pipeline('feature-extraction', MODEL, { quantized: true });

const vectors = [];
for (const [i, chunk] of chunks.entries()) {
  // Mean pooling + L2 normalise => cosine similarity is a plain dot product.
  const out = await embed(embedText(chunk.text, chunk.section), { pooling: 'mean', normalize: true });
  vectors.push(Array.from(out.data).map((n) => Math.round(n * 1e4) / 1e4));
  const label = chunk.section + (chunk.sub ? ` > ${chunk.sub}` : '');
  console.log(`  [${String(i).padStart(2)}] ${String(chunk.text.length).padStart(4)} ch  ${label}`);
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify({
    model: MODEL,
    dim: vectors[0].length,
    builtFrom: 'knowledge-base.md',
    chunks: chunks.map((c, i) => ({ ...c, vector: vectors[i] })),
  })
);

const kb = (await readFile(OUT)).length / 1024;
console.log(`\nWrote ${OUT}  (${chunks.length} chunks, ${vectors[0].length}d, ${kb.toFixed(0)} KB)`);
