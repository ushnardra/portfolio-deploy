import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, ArrowUp } from 'lucide-react';
import PikiAvatar from './common/PikiAvatar';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * PIKI — the site's RAG chat assistant.
 *
 * Retrieval runs in the browser (Chatbot/retriever.js) against a prebuilt
 * embedding index; only the question and the retrieved context go to
 * /api/chat, which holds the OpenRouter key. See Chatbot/README.md.
 *
 * The character work is deliberately confined to the avatar, the greeting and
 * the motion. Everything structural — hairlines, the mono eyebrow, the accent
 * ramp, the 4px rhythm — is the same vocabulary as the rest of the page, so
 * PIKI reads as part of the site rather than a widget dropped on top of it.
 *
 * The retriever pulls in ~25 MB of ONNX model, so it is imported lazily on
 * first open — the landing page never pays for it.
 */

const GREETING =
  "Hi, I'm PIKI 👋 — Ushnardra's assistant. Ask me about his work, his projects, or how he takes on a build.";

const SUGGESTIONS = [
  { label: 'What can he build?', q: 'What services do you offer?' },
  { label: 'AI & ML work', q: 'What machine learning projects have you built?' },
  { label: 'How it works', q: 'How does your process work?' },
  { label: 'Pricing', q: 'How much does a website cost?' },
];

const FALLBACK =
  "Sorry, something went wrong on my end there! Try asking again in a moment — or reach Ushnardra directly at ushnardra9999@gmail.com or +91 9330497299 on WhatsApp.";

/**
 * Minimal inline markdown → React. Models emit `**bold**`, `*italic*` and
 * `` `code` `` no matter how the prompt is worded, and raw asterisks in a chat
 * bubble look broken. This handles exactly what actually shows up; a markdown
 * library would be ~40 KB for three patterns, on a bundle that is otherwise
 * lazy-loaded.
 *
 * Everything is rendered as text nodes by React, so there is no innerHTML and
 * nothing a model emits can inject markup.
 */
const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*)/g;

const renderInline = (text, keyPrefix) =>
  text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (/^\*\*[^*\n]+\*\*$/.test(part)) {
      return (
        <strong key={key} className="font-semibold text-[var(--t1)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^`[^`\n]+`$/.test(part)) {
      return (
        <code
          key={key}
          className="rounded bg-[var(--s3)] px-1 py-0.5 font-mono text-[0.8em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^\*[^*\n]+\*$/.test(part)) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return part;
  });

/** Block-level: turns `- item` runs into a real list, keeps other lines as-is. */
const RichText = ({ text }) => {
  const blocks = [];
  let list = null;

  for (const raw of text.split('\n')) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);

    if (bullet) {
      list ??= [];
      list.push(bullet[1]);
      continue;
    }
    if (list) {
      blocks.push({ type: 'ul', items: list });
      list = null;
    }
    if (line.trim()) blocks.push({ type: 'p', text: line });
  }
  if (list) blocks.push({ type: 'ul', items: list });

  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="my-1.5 space-y-1 first:mt-0 last:mb-0">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--a1)]" />
                <span>{renderInline(item, `${i}-${j}`)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-1.5 first:mt-0 last:mb-0">
            {renderInline(b.text, String(i))}
          </p>
        )
      )}
    </>
  );
};

let retrieverModule = null;
const loadRetriever = async () => {
  retrieverModule ??= await import('../Chatbot/retriever.js');
  return retrieverModule;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  /* True only while the first question is blocked on the embedding model still
     downloading. Worth its own label: a cold visitor otherwise stares at a
     generic "Thinking…" for far longer than the answer actually takes, with no
     sign that anything is progressing. */
  const [warming, setWarming] = useState(false);
  /* One-time nudge on the launcher. It is a dot, not a bubble that slides out
     and covers the page — the point is to be noticed, not to interrupt. */
  const [nudge, setNudge] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setNudge(true), 12000);
    return () => clearTimeout(t);
  }, [open]);

  /* Start fetching the embedding model while the visitor is still reading the
     page, not when they open the panel.

     Retrieval needs ~25 MB of ONNX weights, and previously that download only
     began on open — so the very first question waited for the whole thing and
     sat on "Thinking…" for tens of seconds. Warming during idle time moves that
     cost off the critical path; by the time anyone clicks, it is usually done.

     requestIdleCallback keeps it behind first paint and the site's own JS, so
     the landing experience is unchanged. The 2.5s fallback covers Safari, which
     still lacks rIC. */
  useEffect(() => {
    if (open) return; // the open-effect below handles the already-open case

    let cancelled = false;
    const warm = () => {
      if (cancelled) return;
      loadRetriever()
        .then((m) => m.preload())
        .catch(() => {});
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(warm, 2500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open]);

  // On open: make sure warming has started (covers a click before idle fired)
  // and put the cursor in the input.
  useEffect(() => {
    if (!open) return;
    setNudge(false);
    loadRetriever()
      .then((m) => m.preload())
      .catch(() => {});
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [messages, busy, reduceMotion]);

  // Escape closes and returns focus to the launcher, so keyboard users are not
  // stranded at the bottom of the document.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (raw) => {
      const question = raw.trim();
      if (!question || busy) return;

      setInput('');
      setBusy(true);

      // Capture history before appending, so the new question isn't duplicated
      // into the context the model receives.
      const history = messages
        .filter((m) => !m.error)
        .slice(1) // drop the canned greeting
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, { role: 'user', content: question }]);

      try {
        const mod = await loadRetriever();
        // Only claim to be "getting ready" if the model genuinely has not
        // finished — on a warm visit this never shows.
        const cold = !mod.isReady();
        if (cold) setWarming(true);

        const hits = await mod.retrieve(question);
        const buildContext = mod.buildContext;
        if (cold) setWarming(false);

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, context: buildContext(hits), history }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

        // Which sections were retrieved is debugging information, not something
        // a visitor asked for — citing "10. TRACK RECORD (SELF-REPORTED
        // FIGURES)" under a friendly answer breaks the illusion of talking to
        // someone. It stays in the console for when retrieval needs checking.
        if (import.meta.env.DEV) {
          console.debug('PIKI retrieved:', hits.map((h) => h.sub || h.section));
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } catch (err) {
        console.error('PIKI request failed', err);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: FALLBACK, error: true },
        ]);
      } finally {
        setBusy(false);
        setWarming(false); // never leave the "getting ready" label stuck
        inputRef.current?.focus();
      }
    },
    [busy, messages]
  );

  const mood = busy ? 'thinking' : 'happy';

  return (
    <>
      {/* ---------------------------------------------------------- launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="piki-panel"
        aria-label={open ? 'Close PIKI' : 'Chat with PIKI'}
        className="group fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center
                   rounded-2xl border border-[var(--line-2)] bg-[var(--s1)]
                   shadow-[var(--sh-3)] transition-[transform,border-color] duration-300
                   [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5
                   hover:border-[var(--a1)] focus-visible:outline-2
                   focus-visible:outline-offset-3 focus-visible:outline-[var(--a1)]
                   motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* Soft accent bloom behind the face — reads as glow on the dark ground */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60
                     transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--a1) 18%, transparent), transparent 70%)',
          }}
        />
        {open ? (
          <X size={20} className="relative text-[var(--t2)]" aria-hidden />
        ) : (
          <PikiAvatar size={34} mood="idle" className="relative piki-bob" />
        )}

        {!open && nudge && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2
                       border-[var(--s1)] bg-[var(--sig)]"
          />
        )}
      </button>

      {/* ------------------------------------------------------------- panel */}
      {open && (
        <div
          id="piki-panel"
          role="dialog"
          aria-label="Chat with PIKI"
          className="piki-pop fixed bottom-24 right-5 z-[60] flex
                     h-[min(35rem,calc(100dvh-8.5rem))] w-[min(24rem,calc(100vw-2.5rem))]
                     flex-col overflow-hidden rounded-3xl border border-[var(--line-2)]
                     bg-[var(--s0)]/92 shadow-[var(--sh-3)] backdrop-blur-2xl"
        >
          {/* Header */}
          <header className="relative flex items-center gap-3 border-b border-[var(--line)] px-4 py-3.5">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70"
              style={{
                background:
                  'radial-gradient(80% 100% at 12% 0%, color-mix(in oklab, var(--a1) 12%, transparent), transparent 70%)',
              }}
            />
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--s2)]">
              <PikiAvatar size={26} mood={mood} />
            </span>

            <div className="relative min-w-0 flex-1">
              <p className="font-display text-[0.95rem] font-semibold leading-tight tracking-tight text-[var(--t1)]">
                PIKI
              </p>
              <p className="flex items-center gap-1.5 text-[0.7rem] leading-tight text-[var(--t3)]">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${
                    busy ? 'bg-[var(--sig)] piki-pulse' : 'bg-[var(--ok)]'
                  }`}
                />
                {warming ? 'Getting ready…' : busy ? 'Thinking…' : "Ushnardra's assistant"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close chat"
              className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg
                         text-[var(--t3)] transition-colors hover:bg-[var(--s2)]
                         hover:text-[var(--t1)] focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-[var(--a1)]"
            >
              <X size={16} aria-hidden />
            </button>
          </header>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={i}
                  className={`piki-msg flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <span className="mt-0.5 shrink-0 self-end">
                      <PikiAvatar size={22} mood={m.error ? 'idle' : 'happy'} />
                    </span>
                  )}
                  <div
                    className={[
                      'max-w-[82%] text-[0.845rem] leading-relaxed',
                      // Asymmetric radii: the corner nearest its author stays
                      // tight, which is what makes a bubble feel anchored to a
                      // speaker rather than floating.
                      isUser
                        ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-[var(--a1)] to-[var(--a2)] px-3.5 py-2.5 font-medium text-[#04222a]'
                        : 'rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--s1)] px-3.5 py-2.5 text-[var(--t1)]',
                    ].join(' ')}
                  >
                    {isUser ? m.content : <RichText text={m.content} />}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="piki-msg flex items-end gap-2">
                <PikiAvatar size={22} mood="thinking" className="shrink-0" />
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--s1)] px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="piki-dot h-1.5 w-1.5 rounded-full bg-[var(--a1)]"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                  {warming && (
                    <span className="ml-1 text-[0.75rem] text-[var(--t3)]">
                      warming up, first answer takes a moment
                    </span>
                  )}
                  <span className="sr-only">
                    {warming ? 'PIKI is getting ready' : 'PIKI is thinking'}
                  </span>
                </div>
              </div>
            )}

            {messages.length === 1 && !busy && (
              <div className="space-y-2 pt-1">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--t3)]">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => send(s.q)}
                      className="rounded-full border border-[var(--line-2)] bg-[var(--s1)]
                                 px-3 py-1.5 text-[0.75rem] text-[var(--t2)]
                                 transition-colors hover:border-[var(--a1)]
                                 hover:text-[var(--t1)] focus-visible:outline-2
                                 focus-visible:outline-offset-2 focus-visible:outline-[var(--a1)]"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-[var(--line)] px-3 pb-3 pt-3"
          >
            <div
              className="flex items-end gap-2 rounded-2xl border border-[var(--line-2)]
                         bg-[var(--s1)] px-3 py-2 transition-colors
                         focus-within:border-[var(--a1)]"
            >
              <label htmlFor="piki-input" className="sr-only">
                Ask PIKI a question
              </label>
              <input
                id="piki-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask PIKI anything…"
                maxLength={1000}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-1 text-[0.845rem] text-[var(--t1)]
                           placeholder:text-[var(--t3)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl
                           bg-gradient-to-br from-[var(--a1)] to-[var(--a2)] text-[#04222a]
                           transition-[opacity,transform] duration-200 enabled:hover:scale-105
                           disabled:opacity-30 focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-[var(--a1)]
                           motion-reduce:enabled:hover:scale-100"
              >
                <ArrowUp size={15} strokeWidth={2.6} aria-hidden />
              </button>
            </div>
            <p className="px-1 pt-2 text-center font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-[var(--t3)]">
              Answers drawn from this site only
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
