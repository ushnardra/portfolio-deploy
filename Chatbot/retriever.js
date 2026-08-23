/**
 * Browser-side semantic retrieval.
 *
 * Loads the prebuilt index (public/chatbot-index.json) and the same MiniLM
 * model that produced it, embeds the visitor's question, and ranks chunks by
 * cosine similarity. Vectors are L2-normalised at build time, so cosine is a
 * plain dot product.
 *
 * The model (~25 MB quantised) is fetched from the HF CDN on first use and
 * cached by the browser. Everything here runs client-side; only the final
 * question + retrieved context crosses the network, to our own function.
 */

const INDEX_URL = '/chatbot-index.json';
const MODEL = 'Xenova/all-MiniLM-L6-v2';

export const TOP_K = 4;
// Two-part gate, tuned against Chatbot/eval.mjs — keep both in sync with it.
// MIN_SIMILARITY rejects the query outright when even the best chunk is weak
// (off-topic questions). RELATIVE_CUT then drops trailing hits far behind the
// best one, so a good match doesn't drag three loosely-related chunks into the
// context with it. A flat floor alone can't do both: short but valid questions
// ("whats your email") score about as low as off-topic ones.
export const MIN_SIMILARITY = 0.17;
export const RELATIVE_CUT = 0.6;

let indexPromise = null;
let embedPromise = null;

function loadIndex() {
  indexPromise ??= fetch(INDEX_URL).then((r) => {
    if (!r.ok) throw new Error(`chatbot-index.json missing (${r.status})`);
    return r.json();
  });
  return indexPromise;
}

function loadEmbedder() {
  embedPromise ??= import('@xenova/transformers').then(async (mod) => {
    mod.env.allowLocalModels = false; // fetch from CDN, not from our origin
    return mod.pipeline('feature-extraction', MODEL, { quantized: true });
  });
  return embedPromise;
}

/* Whether the embedder has finished loading. The UI reads this to distinguish
   "downloading a 25 MB model" from "waiting on the language model" — the two
   feel identical behind a generic spinner, and the first one is the slow one on
   a cold visit. */
let ready = false;

export const isReady = () => ready;

/**
 * Warm the model + index before the visitor sends anything.
 *
 * Crucially this runs one throwaway inference. Fetching the weights is only
 * half the cold cost: ONNX Runtime compiles the graph and allocates its WASM
 * arena on the FIRST call, which measured ~21s here — dwarfing both the
 * download and the ~5s language-model call. Without this line the widget looks
 * loaded and then stalls on the first question anyway.
 *
 * `ready` therefore means "a real query will be fast now", not "files present".
 */
export function preload() {
  loadIndex();
  loadEmbedder()
    .then((embed) => embed('warmup', { pooling: 'mean', normalize: true }))
    .then(() => {
      ready = true;
    })
    .catch(() => {});
}

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

/**
 * @returns {Promise<Array<{section:string, sub:string, text:string, score:number}>>}
 *          Chunks above MIN_SIMILARITY, best first. Empty if nothing matches.
 */
export async function retrieve(question, k = TOP_K) {
  const [index, embed] = await Promise.all([loadIndex(), loadEmbedder()]);
  ready = true; // covers a question asked before preload() resolved

  const out = await embed(question, { pooling: 'mean', normalize: true });
  const q = Array.from(out.data);

  const ranked = index.chunks
    .map((c) => ({ ...c, score: dot(q, c.vector) }))
    .sort((a, b) => b.score - a.score);

  if (!ranked.length || ranked[0].score < MIN_SIMILARITY) return [];

  const floor = Math.max(MIN_SIMILARITY, ranked[0].score * RELATIVE_CUT);
  return ranked
    .slice(0, k)
    .filter((c) => c.score >= floor)
    .map(({ vector, ...rest }) => rest); // drop the vector before sending
}

/** Join retrieved chunks into the CONTEXT block the model reads. */
export function buildContext(hits) {
  return hits.map((h) => h.text).join('\n\n---\n\n');
}
