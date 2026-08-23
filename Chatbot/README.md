# Portfolio RAG chatbot

A retrieval-augmented chatbot that answers visitor questions about Ushnardra
and his work, grounded strictly in `knowledge-base.md`.

## How it works

```
knowledge-base.md
      │  locally — npm run embeddings, then COMMIT the result
      ▼
build-embeddings.mjs ──► public/chatbot-index.json   (26 chunks, 384-dim, 86 KB)
      │
      │  runtime, in the visitor's browser
      ▼
retriever.js  ── embeds the question, cosine-ranks the chunks
      │
      │  POST { question, context, history }
      ▼
netlify/functions/chat.mjs  ── holds the API key, calls OpenRouter
      │
      ▼
components/Chatbot.jsx  ── the widget
```

### Why no Chroma / no Python

The original plan was ChromaDB + sentence-transformers. Both were dropped
deliberately:

- **Chroma** is a database for millions of vectors. This knowledge base is 26.
  A cosine loop over 26 pre-normalised vectors is microseconds of plain
  JavaScript — a vector DB here would be infrastructure with nothing to do.
- **Python + PyTorch** (~2 GB) cannot run on Netlify's build or function
  runtime, and would have forced a separate always-on paid container next to a
  static site.

`@xenova/transformers` runs the *same* model (`all-MiniLM-L6-v2`) as ONNX in
Node and in the browser, so the retrieval quality is unchanged and the whole
thing deploys as static files plus one function.

## Setup

```bash
npm install
cp Chatbot/.env.example Chatbot/.env   # then put your real key in .env
npm run build                          # embeds the KB, then builds the site
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server. Serves `/api/chat` too (see `vite.config.js`). |
| `npm run embeddings` | Rebuild `public/chatbot-index.json`. Run after editing the KB. |
| `npm run eval` | Retrieval regression suite. |
| `npm run build` | Embeddings + site. Use locally. |
| `npm run build:site` | Site only. **What Netlify runs.** |

For local dev with the function running, use the Netlify CLI (plain `npm run
dev` serves the site but `/api/chat` will 404):

```bash
npm i -g netlify-cli
netlify dev
```

### Netlify deploy

Set these under **Site configuration → Environment variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | From https://openrouter.ai/keys |
| `CHAT_MODEL` | no | Preferred model. Others are still tried if it fails. |

`netlify.toml` already wires the build command, the publish directory and the
functions directory. Nothing else to configure.

## Updating what the bot knows

Edit `knowledge-base.md`, then:

```bash
npm run embeddings   # rebuild the index
npm run eval         # confirm retrieval still works
```

Then **commit `public/chatbot-index.json`** — it is a build artifact that is
deliberately checked in.

Netlify runs `npm run build:site` (Vite only), NOT `npm run build`. Regenerating
embeddings in CI would download ~25 MB of ONNX model from the Hugging Face CDN
on every deploy, making the whole site deploy fail whenever that CDN is slow or
throttled — over a file that usually has not changed. So the index is built
locally and committed.

If you edit the knowledge base and forget `npm run embeddings`, the deploy
succeeds and PIKI silently keeps answering from the old index.

## The eval

`eval.mjs` runs 29 realistic visitor questions plus 5 off-topic ones through the
exact same search the browser performs, and asserts the right section comes
back. Retrieval is the half of RAG that fails silently: the wrong chunk produces
a fluent, confident, wrong answer, and nothing in the UI reveals it. Current
baseline is **29/29 grounded, 4/5 refused** — a drop below that exits non-zero.

Three fixes came directly out of running it:

1. **The FAQ was one 1654-char chunk.** Individual answers were diluted to the
   point that "im not in india is that a problem" retrieved the Credentials
   section. Each Q&A pair is now its own chunk.
2. **§1 Identity is a markdown table.** `| Location | Kolkata |` embeds as pipes
   and padding, not language, so "where are you located?" missed it completely.
   Tables are flattened to `Location: Kolkata` before embedding.
3. **Visitors ask in the second person.** "Where are *you* based" against
   third-person prose about Ushnardra scored below the relevance floor.
   `QUERY_ALIASES` in `build-embeddings.mjs` prepends the likely question
   phrasings to what gets embedded.

Note that (2) and (3) change only the text that is **embedded**. What reaches
the LLM is always the original markdown.

### Known ceiling

"write me a poem about cats" grazes the Emotion-AI chunk at ~0.20, the same
score band as genuine short questions like "what is your name". No threshold
separates them, so retrieval stays permissive and the system prompt does the
refusing. One weak chunk reaching the model is cheap; stonewalling a real
visitor is not.

## Grounding and safety

- **Two-part relevance gate** — an absolute floor (`MIN_SIMILARITY = 0.17`)
  rejects off-topic questions outright; a relative cut (`0.6 × top score`) drops
  trailing chunks so one good match doesn't drag three weak ones into context.
- **Zero retrieved chunks short-circuits** in the function before any model call
  — no tokens spent on a question the KB cannot answer.
- **§12 of the knowledge base is excluded from the index.** It contains the
  bot's own authoring rules; retrieving it would let a visitor pull the
  instructions back out as though they were an answer.
- **Model fallback chain.** Free OpenRouter models rate-limit without warning
  (two of four were 429ing during development) and reasoning models sometimes
  return empty content. The function tries several in order, so one bad model
  is not an outage.
- **History roles are whitelisted** to `user`/`assistant`, so a crafted request
  cannot inject a system turn.
- Verified against the live API: correct URLs, refuses to quote prices, refuses
  off-topic questions, and resists "ignore your instructions" prompt injection.

## Performance

The retriever and its ONNX model are lazy-imported when the panel is first
opened, so the landing page is unaffected:

| Chunk | Size (gzip) | When it loads |
| --- | --- | --- |
| `index.js` | 89 KB | first paint (unchanged by the chatbot) |
| `Chatbot.js` | 2.6 KB | idle, after the page settles |
| `transformers.js` | 200 KB | only when a visitor opens the chat |
| MiniLM weights | ~25 MB | only when a visitor opens the chat, then cached |

## Files

| File | Role |
| --- | --- |
| `knowledge-base.md` | The single source of truth. Edit this. |
| `build-embeddings.mjs` | Chunks + embeds it into `public/chatbot-index.json`. |
| `retriever.js` | Browser-side cosine search. |
| `eval.mjs` | Retrieval regression suite. |
| `../netlify/functions/chat.mjs` | Server side; holds the key, calls OpenRouter. |
| `../components/Chatbot.jsx` | The widget. |
