# Fluidwebsoft

Portfolio and services site for Ushnardra Ghosh — software engineering and AI
integration, Kolkata. React 19 + Vite 7 + Tailwind v4, with **PIKI**, a
retrieval-augmented chat assistant that answers questions about the work.

**Live:** https://fluidwebsoft.netlify.app

## Stack

- React 19, Vite 7, Tailwind v4
- Three.js / `@react-three/fiber` for the WebGL Lab section
- `@xenova/transformers` (ONNX MiniLM) for in-browser semantic search
- One Netlify Function for the chat completion call

## Local development

```bash
npm install
cp Chatbot/.env.example Chatbot/.env    # add your OpenRouter key
npm run dev
```

`npm run dev` also serves `/api/chat`, so the chatbot works locally without the
Netlify CLI — see the dev plugin in `vite.config.js`.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server, including the `/api/chat` endpoint |
| `npm run embeddings` | Rebuild `public/chatbot-index.json` from the knowledge base |
| `npm run eval` | Chatbot retrieval regression suite (baseline 29/29) |
| `npm run build` | Embeddings + site. Use this locally. |
| `npm run build:site` | Site only — **this is what Netlify runs** |

## The chatbot

PIKI retrieves from `Chatbot/knowledge-base.md`, which is the single source of
truth for everything it will say. Retrieval runs in the visitor's browser
against a prebuilt embedding index; only the question and the retrieved context
reach the server, which holds the API key.

To change what PIKI knows:

```bash
# edit Chatbot/knowledge-base.md
npm run embeddings   # regenerate the index
npm run eval         # confirm retrieval still works
git add -A && git commit -m "Update knowledge base" && git push
```

`public/chatbot-index.json` is a **committed build artifact**. Netlify does not
regenerate it — doing so would download ~25 MB of model from a third-party CDN
on every deploy. Forget `npm run embeddings` and the deploy succeeds while PIKI
quietly keeps answering from the old index.

Full details: [`Chatbot/README.md`](Chatbot/README.md).

## Deployment

Netlify, from `netlify.toml`. One environment variable is required and is not
in the repo:

| Variable | Required | Notes |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | https://openrouter.ai/keys |
| `CHAT_MODEL` | no | Preferred model; the function falls back if it fails |

The canonical host is hardcoded in `index.html`, `public/sitemap.xml` and
`public/robots.txt`. Changing domains means updating all three.

## License

MIT — see [LICENSE](LICENSE).
