import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Serve the chatbot's /api/chat endpoint during `npm run dev`.
 *
 * In production that path is a Netlify Function. Vite's dev server knows
 * nothing about those, so without this the widget's fetch 404s and every
 * message comes back as "Something went wrong on my end". This mounts the very
 * same handler as dev middleware, so there is one implementation to keep
 * correct rather than a mock that can drift from it.
 */
function chatApiPlugin() {
  return {
    name: 'chat-api-dev',
    apply: 'serve',
    configureServer(server) {
      // Load Chatbot/.env into process.env for the handler to read. Vite's own
      // loadEnv only exposes VITE_-prefixed vars to the client, which is the
      // opposite of what a secret key needs.
      try {
        for (const line of readFileSync('./Chatbot/.env', 'utf8').split('\n')) {
          const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
          if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '').trim();
        }
      } catch {
        server.config.logger.warn(
          '\n[chat] Chatbot/.env not found — the chatbot will return an error.\n' +
            '        Copy Chatbot/.env.example to Chatbot/.env and add your key.\n'
        );
      }

      server.middlewares.use('/api/chat', async (req, res) => {
        const chunks = [];
        for await (const c of req) chunks.push(c);

        // Adapt Node's req/res to the Web Request/Response the handler expects.
        const request = new Request('http://localhost/api/chat', {
          method: req.method,
          headers: req.headers,
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
        });

        try {
          const { default: handler } = await server.ssrLoadModule(
            '/netlify/functions/chat.mjs'
          );
          const result = await handler(request);
          res.statusCode = result.status;
          result.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(await result.text());
        } catch (err) {
          server.config.logger.error(`[chat] ${err.stack || err}`);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Dev chat handler failed. See terminal.' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), chatApiPlugin()],
  build: {
    // No manualChunks here, deliberately.
    //
    // An earlier version forced everything matching /three|@react-three/ into a
    // named chunk. That backfired: React is a shared dependency of
    // @react-three/fiber, so Rollup hoisted React into that chunk too, which
    // made the entry statically depend on it — Vite then emitted a
    // <link rel="modulepreload"> and every visitor downloaded 302 kB of
    // three.js on first paint, which is precisely what the lazy import exists
    // to avoid.
    //
    // Rollup already gives each dynamic import its own chunk, so three.js is
    // isolated correctly with no configuration at all.
    chunkSizeWarningLimit: 1200,
  },
  // Root-absolute asset URLs.
  //
  // This was './' so the build could also be dropped in a sub-path. That is no
  // longer safe: the chatbot fetches '/chatbot-index.json' and '/api/chat' as
  // root-absolute paths, and the SPA redirect serves index.html for every
  // route — so on a deep link like /work/thing, relative asset URLs would
  // resolve against /work/ and 404. Netlify serves from the domain root, so
  // '/' is both correct and consistent with those fetches.
  base: '/',
});
