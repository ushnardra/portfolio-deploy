/**
 * Retrieval eval. Runs the same cosine search the browser does, against a set
 * of realistic visitor questions, and checks the top hit is the right section.
 *
 * Retrieval is the half of RAG that silently fails — a wrong chunk produces a
 * fluent, confident, wrong answer. Run this after editing knowledge-base.md.
 *
 *   node Chatbot/build-embeddings.mjs && node Chatbot/eval.mjs
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from '@xenova/transformers';

const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, '..', 'public', 'chatbot-index.json');

// Keep these in sync with retriever.js.
const TOP_K = 4;
const MIN_SIMILARITY = 0.17;
const RELATIVE_CUT = 0.6;

// `expect` matches against "section > sub" of any chunk in the top K.
const CASES = [
  { q: 'who are you?', expect: /1\./ },
  { q: 'what is your name', expect: /1\./ },
  { q: 'where are you based', expect: /1\.|11\./ },
  // Regression: §1 is a markdown table, whose pipe rows embedded so poorly that
  // these three missed it entirely until build-embeddings.mjs started
  // flattening tables to "Field: value" before embedding.
  { q: 'where are you located?', expect: /1\.|11\./ },
  { q: 'tell me about yourself', expect: /1\./ },
  { q: 'what is your github', expect: /1\.|11\./ },
  { q: 'what services do you offer', expect: /2\./ },
  { q: 'can you build me an online store', expect: /2\.|5\.1/ },
  { q: 'do you do 3d websites', expect: /2\.|3\./ },
  { q: 'what technologies do you use', expect: /4\./ },
  { q: 'do you know react', expect: /4\./ },
  { q: 'do you work with django', expect: /4\.|5\.1/ },
  { q: 'show me your projects', expect: /5\./ },
  { q: 'have you built anything with machine learning', expect: /5\.5|5\.6|3\./ },
  { q: 'tell me about the galaxy project', expect: /5\.6/ },
  { q: 'the book selling website', expect: /5\.1/ },
  { q: 'do you have any certifications', expect: /6\./ },
  { q: 'how do you work with clients', expect: /7\./ },
  { q: 'what happens after I hire you', expect: /7\./ },
  { q: 'how much does a website cost', expect: /8\.|9\./ },
  { q: 'what are your prices', expect: /8\.|9\./ },
  { q: 'how long will it take', expect: /9\./ },
  { q: 'who owns the code when its done', expect: /9\./ },
  { q: 'do you offer support after launch', expect: /9\.|7\./ },
  { q: 'can you fix my existing website', expect: /9\./ },
  { q: 'im not in india is that a problem', expect: /9\./ },
  { q: 'how many clients have you had', expect: /10\./ },
  { q: 'how do I contact you', expect: /11\./ },
  { q: 'whats your email', expect: /11\.|1\./ },
];

// Should retrieve nothing — the bot must refuse rather than improvise.
const OFF_TOPIC = [
  'what is the capital of France',
  'write me a poem about cats',
  'what is 2 + 2',
  'how do I bake sourdough bread',
  'who won the world cup',
];

const index = JSON.parse(await readFile(INDEX, 'utf8'));
const embed = await pipeline('feature-extraction', index.model, { quantized: true });

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

async function search(q) {
  const out = await embed(q, { pooling: 'mean', normalize: true });
  const v = Array.from(out.data);
  const ranked = index.chunks
    .map((c) => ({
      label: c.section + (c.sub ? ` > ${c.sub}` : ''),
      score: dot(v, c.vector),
    }))
    .sort((a, b) => b.score - a.score);

  if (!ranked.length || ranked[0].score < MIN_SIMILARITY) return [];
  const floor = Math.max(MIN_SIMILARITY, ranked[0].score * RELATIVE_CUT);
  return ranked.slice(0, TOP_K).filter((c) => c.score >= floor);
}

let pass = 0;
console.log('\n── grounded questions ──────────────────────────────────');
for (const { q, expect } of CASES) {
  const hits = await search(q);
  const ok = hits.some((h) => expect.test(h.label));
  if (ok) pass++;
  const top = hits[0] ? `${hits[0].label} (${hits[0].score.toFixed(2)})` : 'NOTHING';
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}"\n        -> ${top}`);
}

console.log('\n── off-topic (should retrieve nothing) ─────────────────');
let refused = 0;
for (const q of OFF_TOPIC) {
  const hits = await search(q);
  const ok = hits.length === 0;
  if (ok) refused++;
  const top = hits[0] ? `${hits[0].label} (${hits[0].score.toFixed(2)})` : 'nothing';
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}"  -> ${top}`);
}

console.log(
  `\n${pass}/${CASES.length} grounded · ${refused}/${OFF_TOPIC.length} refused\n`
);

/* Known ceiling: "write me a poem about cats" grazes the Emotion-AI chunk at
 * ~0.20, the same band where genuine short questions ("what is your name") sit.
 * No single threshold separates them, so retrieval stays permissive there and
 * the system prompt does the refusing — one weak chunk reaching the model is
 * cheap, stonewalling a real visitor is not. Treat a drop BELOW these as a
 * regression. */
const BASELINE_GROUNDED = 29;
const BASELINE_REFUSED = 4;
const ok = pass >= BASELINE_GROUNDED && refused >= BASELINE_REFUSED;
if (!ok) {
  console.log(
    `REGRESSION — baseline is ${BASELINE_GROUNDED}/${CASES.length} grounded, ` +
      `${BASELINE_REFUSED}/${OFF_TOPIC.length} refused\n`
  );
}
process.exit(ok ? 0 : 1);
