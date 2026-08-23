# WEBIFY — Redesign & Growth Plan

---

## STATUS — what shipped

Lighthouse (mobile emulation, throttled, software GL): **Accessibility 100 ·
Best Practices 100 · SEO 100**, CLS **0**, FCP **1.6–1.8 s**, LCP **2.3–2.7 s**
— all stable across runs. The **Performance score measured 78–95** across six
runs; the only metric moving is Total Blocking Time (90 ms → 660 ms), which
tracks how loaded the machine is at the time rather than anything in the page.
The best reading (95 / TBT 90 ms) was taken with nothing else running. Re-measure
on the deployed site for a figure worth quoting.

No console errors after exercising every design-language swatch, every FAQ row
and the theme toggle. All 11 section anchors resolve.

### Positioning: independent developer, presented as a business
The photo is gone, and so is every "studio", "agency", "team", "in-house" and
"under one roof" — this is solo work, and claiming otherwise is something a
client discovers on the first call. The voice is first-person singular
throughout ("I build", "you work with me directly"); the only remaining "we/our"
is inside client testimonial quotes, where it correctly refers to the client.

What makes it read professional is structure, not scale: services, a scroll-driven
process, scope tiers, proof, FAQ, and a real contact flow. A named individual who
owns the entire build is a stronger pitch at this size than a vague collective.

`components/AboutAgency.jsx` was renamed to `components/About.jsx` to match.
Nav label "Studio" → "About"; footer column "Studio" → "Site".

### Progress updates: weekly, not daily
Changed everywhere it was claimed — hero stat, the "six commitments" card, the
Build stage of the Process sequence and its deliverable chip, the FAQ answer on
working across time zones, and the meta description. The live preview URL is now
framed as the always-available thing, with a written update weekly.

### Scroll motion — now a site-wide system, not one demo
The original parallax worked but was invisible in practice: 40 px of travel,
buried at Lab §07.1. Motion is now load-bearing across the page:
- **Hero exit** — copy drifts up and dissolves, the grid drifts the opposite
  way, the card deck rotates and recedes on a perspective. Visible immediately.
- **Process (§02)** — the site's centrepiece: a pinned, scroll-driven sequence
  where four stages advance under scroll and a browser panel changes with them
  (brief → wireframes → code → shipped). Only the stage index is React state,
  so a full scroll costs at most four re-renders.
- **Lab §07.1** — layer travel tripled (120/300/560/820 px) plus scale and
  counter-rotation, so depth actually reads. The pinned horizontal track is
  vertically centred and completes exactly as it unsticks.
- **About** — staggered counter-scroll drift on the stats tiles.

All of it is driven by one rAF-batched listener writing a single CSS custom
property, and every piece has a non-animated `prefers-reduced-motion` path.

**Done**
- Phase 0 foundation: Tailwind v4 as a real dependency (browser-compiled CDN
  build removed), `aistudiocdn` import map removed, Font Awesome replaced with
  lucide + 3 hand-authored brand SVGs, Vite 7, 0 npm vulnerabilities, favicon,
  OG image (rendered to PNG), OG/Twitter/canonical meta, `ProfessionalService` +
  `Person` + `FAQPage` JSON-LD, robots.txt, sitemap.xml.
- Phase 1 visual system: token-driven light/dark/system theming, self-hosted
  variable fonts (Bricolage Grotesque / Inter / JetBrains Mono), fluid `clamp()`
  type scale, 8 accent hues cut to 2, editorial section numerals, cursor
  spotlight + magnetic CTA motifs, Header rebuilt on IntersectionObserver,
  canvas background rewritten (DPR-aware, particle-capped, idle-started,
  disabled on touch, reduced-motion aware).
- Phase 2 Lab: parallax (4 layers + pinned horizontal track + live HUD),
  3D in two tiers (CSS-3D always-on; real three.js code-split behind a button),
  and the 8-language Design Systems Lab with live controls, "View CSS", honest
  a11y caveats, and per-style enquiry links.
- Phase 3/4 partial: named founder block, delivery process, six commitments,
  pricing restructured around discovery-call → written proposal → milestones,
  Proof section, 10-question FAQ, hardened contact form (honeypot + throttle +
  live-region status).
- Phase 5: images 7.3 MB → 304 kB as WebP, lazy + async decoding.

**Bugs found and fixed along the way**
- Reveal CSS used direct-child selectors, leaving *every* section heading stuck
  at `opacity: 0`.
- A `manualChunks` rule for three.js hoisted React into that chunk, so the entry
  statically depended on it and 302 kB of three.js was `modulepreload`ed on every
  visit — the exact opposite of the intent.
- `React.lazy` alone didn't defer the Lab (the import fires on render), so it
  loaded during first paint; now gated on an IntersectionObserver.
- Hero rotator was sized by string `.length` rather than rendered width, clipping
  the longest phrase.
- Portfolio project links were hover-only overlays — unreachable on touch.
- `pin` scroll progress used `containerHeight − viewportHeight`, but a sticky
  child stays stuck for `containerHeight − childHeight`. Progress hit 1 while the
  panel was still pinned, leaving a dead stretch where scrolling changed nothing.
- Dimming inactive Process stages with `opacity: 0.38` dropped their text to
  3.29:1 contrast and cost the perfect accessibility score. Fixed by dimming with
  muted *colours* (`ink-3`, ~6.8:1) instead of opacity.

### Proof section: certificates removed
Course and event certificates read as a CV, not a business — a buyer hiring a
service evaluates delivered work and measurable results, not qualifications.
They were replaced in the same column by this page's own audited Lighthouse
figures (Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0) with an
invitation to re-run them on PageSpeed Insights. Same category of evidence,
stronger, and checkable in thirty seconds.

`public/images/opt/cert-frontend.webp`, `cert-ibm.webp` and `founder.webp` are
now unreferenced and can be deleted.

**One contradiction left on purpose** — `components/Testimonials.jsx:43` still
reads *"They gave **daily** updates … a reliable **team** to work with."* That now
contradicts the weekly cadence and the solo framing everywhere else on the page.
Left untouched because testimonials were explicitly off-limits; it needs a one-line
edit (or removal) from you.

**Still open — needs you**
1. **Replace `https://webify.example.com`** with your real domain in
   `index.html` (canonical, OG, Twitter, JSON-LD), `public/robots.txt` and
   `public/sitemap.xml`. Until then link previews point nowhere.
2. ~~Swap the founder photo~~ — resolved: the photo was removed entirely and the
   section now reads as a studio. `public/images/opt/founder.webp` is no longer
   referenced anywhere and can be deleted.
3. The original full-size PNGs in `public/images/` are now unused but were left
   in place because they are untracked by git (deleting them would be
   unrecoverable). Safe to remove once you've confirmed the WebP versions look
   right.
4. **Five orphaned components** are dead code — nothing imports them, and they
   still contain Font Awesome `<i>` tags that will render as nothing now that
   the webfont is gone: `ProfileSummary.jsx`, `Projects.jsx`, `SoftSkills.jsx`,
   `TechnicalSkills.jsx`, `Freelance.jsx`. They don't affect the live site
   (they're excluded from the bundle), but they should be deleted or migrated.
   `TechnicalSkills.jsx` is the one worth reviving — an honest capability matrix
   is a good trust signal, and it already has proficiency levels.

**Deliberately not built** (from Part 4, available on request): case-study detail
views, a Cal.com booking link, the lead-magnet capture, and a Lighthouse-score
badge. Testimonials were left exactly as-is at your instruction.

---

Goal: make the site read **professional, modern, and unique**, add three
capability-demo sections (parallax → 3D UI → morphism lab), and fix the things
that currently stop a paying client from taking it seriously.

---

## PART 1 — Audit: what's wrong right now

### 1a. Technical debt (blocks everything else)

| # | Issue | Where | Why it matters |
|---|---|---|---|
| T1 | **Tailwind loaded from CDN** (`cdn.tailwindcss.com`) with config in an inline `<script>` | `index.html:10-95` | ~400 KB of JS that compiles CSS *in the browser*. Causes flash-of-unstyled-content, blocks render, and Tailwind's own docs say never ship it. Also blocks custom plugins/`@layer`, which the morphism lab needs. |
| T2 | **Import map to `aistudiocdn.com`** for React, while React is *also* in `package.json` and Vite is bundling it | `index.html:100-108` | Two competing module resolvers. Leftover AI-Studio scaffold. Risk of double-React (hook errors) and a wasted network round trip. |
| T3 | **Font Awesome full CSS+webfonts from CDN** for ~30 icons | `index.html:99` | ~900 KB transferred to draw 30 glyphs. Largest single perf cost on the page. |
| T4 | `vite.config.js` aliases `@` → `./src` but **there is no `src/` directory** | `vite.config.js:9` | Dead config; misleads any future contributor (or you in 3 months). |
| T5 | `metadata.json` + `package.json` still say **"Animated Developer Portfolio"** | both | Stale identity. `metadata.json` is an AI-Studio artifact — likely deletable. |
| T6 | `<link rel="icon" href="/favicon.svg">` but **no favicon exists** in `public/` | `index.html:5` | Guaranteed 404 on every load; browser tab shows a blank page icon. Looks unfinished. |
| T7 | **Header scroll handler is unthrottled** and reads `offsetTop` for 7 sections on every scroll event | `components/Header.jsx:19-38` | Forced synchronous layout on every scroll tick = jank on mid-range phones. Should be one `IntersectionObserver`. |
| T8 | **Canvas background**: 200 stars, `mousemove` pushes 2 particles *per event* with no throttle or cap, `save()/restore()` per particle, no DPR scaling, no reduced-motion guard, no pause on hidden tab, runs full-strength on mobile | `components/common/AnimatedBackground.jsx` | Unbounded particle growth on fast mouse movement, blurry on retina, drains battery, ignores accessibility preference. |
| T9 | **No OG / Twitter / canonical tags, no JSON-LD structured data** | `index.html` | Link previews in WhatsApp/LinkedIn show nothing — fatal when your main channel *is* WhatsApp. No `ProfessionalService` schema = no rich results. |
| T10 | No `robots.txt`, no `sitemap.xml` | — | Basic SEO hygiene missing. |
| T11 | Contact form posts to `formsubmit.co` with the target email **in the client bundle**; no honeypot, no rate limit | `components/Contact.jsx:20` | Scrapeable email → spam. Easy hardening available. |
| T12 | 6 built components are **orphaned** — files exist, nothing imports them | `Certificates.jsx` (deleted), `TechnicalSkills.jsx`, `ProfileSummary.jsx`, `SoftSkills.jsx`, `Projects.jsx`, `Freelance.jsx` | You deleted your **real credentials** (IBM cert, frontend cert) — the strongest trust signal you own. |
| T13 | Images are unoptimised PNG, no `width`/`height`, no `loading="lazy"` | `public/images/*` | Layout shift (CLS) + slow LCP. |

### 1b. Design problems — why it currently looks *templated*, not crafted

This is the honest part. The build quality is fine; the **visual language is the
single most generic dark-portfolio look of 2024-25**, which is exactly why it
doesn't read premium:

1. **Every single heading is a cyan→purple→pink gradient** (`Section.jsx:11`,
   `Hero.jsx:50`, stat numbers, ...). When everything is the accent, nothing is.
   Gradient text is the #1 tell of an AI-generated template.
2. **Eight accent hues in play** — cyan, pink, purple, amber, emerald, sky, rose,
   violet, slate. A premium brand uses *one* accent plus a neutral ramp.
3. **Card soup.** Almost every block is the same
   `rounded-2xl bg-primary/60 backdrop-blur-sm border-white/5` box in a
   symmetric grid. Nine sections, one layout idea.
4. **`rounded-full` on every CTA** + `hover:scale-105` on everything —
   the default Tailwind-tutorial hover. No signature interaction.
5. **One typeface doing all the work** (Inter). No display face = no voice.
6. **No light mode.** Dark-only reads as "hobby project" to enterprise buyers,
   and a theme toggle is itself a craft demo.

### 1c. Credibility problems — the ones that actually cost you money

> **Read this section carefully. It's the highest-leverage part of the plan.**

1. **The testimonials appear to be fabricated.** `Testimonials.jsx` contains five
   named individuals with named employers and hard numeric claims — *"Sales went
   up 200%"*, *"landed 4 new clients"*, *"delivered ahead of schedule"* — while
   `Hero.jsx:4` says **"5+ Clients Served."**
   - A prospect who Googles "InsightFlow" or "GreenTraders Academy" and finds
     nothing loses **all** trust, not just trust in the testimonial.
   - Invented endorsements attributed to named people are a real legal exposure
     (in India, the CCPA's 2022 guidelines on misleading advertisements and
     endorsements; equivalents exist in every market you'd sell into).
   - The *"80% Return Clients"* pill (`Testimonials.jsx:162`) alongside "5+
     clients" is also arithmetically odd — a sharp buyer notices.
   - **This is fixable without losing the section** — see Phase 3 for four honest
     patterns that convert *better* than fake quotes.
2. **No human anywhere.** The site says "we" throughout but never names a person,
   shows a face, or links a LinkedIn. Clients hire *people*. A solo operator with
   a real name, photo, and verifiable credentials outsells a faceless "agency"
   every time at this deal size.
3. **Identity is split.** Repo is `PORTFOLIO PERSONAL`, README and
   `metadata.json` say "developer portfolio", the site says "premium agency."
   Pick one and commit.
4. **All three pricing tiers say "Custom."** Three columns that give a buyer zero
   numbers do less than one honest "projects start at ₹X". You get fewer,
   worse-qualified leads and waste calls on people with no budget.
5. **No process, no FAQ, no case studies.** The buyer's real questions — *what
   happens after I message you? how long? what if I don't like it? who owns the
   code?* — are all unanswered.
6. **You advertise Three.js and 3D websites** (`Services.jsx:18-24`) **but the
   site contains no 3D at all.** The requested demo sections fix this directly.
7. **Your genuinely rare asset is buried.** The Explainable-AI galaxy
   classification project (Grad-CAM, TensorFlow, 85% accuracy) is research-grade
   work that almost no freelance web dev has. It's currently card #5 of 5.

---

## PART 2 — Design direction (the "unique" part)

The strategy: move from **"glowing dark template"** to **"engineered editorial."**
Restraint everywhere, with a few deliberate high-impact moments.

### Typography — cheapest uniqueness available
- **Display:** a face with actual character for headings and the hero.
  Candidates: `Bricolage Grotesque` (modern, slightly odd, very 2025),
  `Instrument Serif` (editorial, premium, unexpected in dev portfolios), or
  `Satoshi`/`Geist` (clean Swiss).
- **Body:** Inter (keep) — but tighten: `-0.02em` tracking on headings,
  `1.6` line-height on body, max `68ch` measure.
- **Mono:** `JetBrains Mono` or keep Fira Code — used for labels, section
  numerals, and tech tags. This is your "engineer" voice.
- Fluid type scale with `clamp()` instead of five breakpoint variants.

### Color — cut from 8 accents to 2
- **Neutral ramp:** 10 steps of a *slightly blue-black*, defined as CSS custom
  properties so light mode is a token swap, not a rewrite.
- **Primary accent:** one — cyan/teal (keeps your existing recognition).
- **Signal accent:** one warm (amber) reserved **only** for primary CTAs, so the
  "buy" action is never visually competing with decoration.
- Gradients allowed **once per viewport**, max.

### Layout — kill the card soup
- Asymmetric editorial grid: 12-col with intentional 5/7 and 4/8 splits.
- **Oversized mono section numerals** (`01`, `02`, `03`) in the left margin, with
  a hairline rule — instantly reads "designed" instead of "generated."
- Real vertical rhythm scale (`8/12/16/24/32/48/64/96/128`) as spacing tokens.
- Generous negative space; fewer, larger, more confident blocks.

### Signature interactions (pick a few, do them well)
- **Cursor spotlight** — a radial gradient that follows the pointer across card
  surfaces. ~15 lines, feels expensive, becomes your motif.
- **Magnetic CTA** — primary button subtly pulls toward the cursor.
- **Scroll-reveal with real stagger** — replace the current
  opacity+translate-10 with a masked line-by-line reveal on headings.
- **View Transitions API** for the theme toggle (progressively enhanced).
- **Light / dark / system toggle** — persisted, no flash on load.
- Everything above gated behind `prefers-reduced-motion: reduce`.

---

## PART 3 — The three demo sections you asked for

Framing is critical. A bare "here are UI styles" block reads like a CodePen dump.
Framed as a **capability lab** it becomes a sales tool: *"your site can look like
any of these — pick one."* All three go in one new nav entry: **Lab**.

### Section A — Parallax: *"Depth & Motion"*
- 4-layer scroll parallax: background grid → blurred orbs → device mockups →
  foreground type, each at a different rate.
- One **pinned horizontal-scroll band** (scroll down, content moves sideways) —
  the effect people actually remember.
- Fixed-image reveal panel (background locked, content scrolls over).
- **Implementation:** CSS `animation-timeline: view()` where supported, with a
  single rAF-throttled scroll listener as fallback. `transform: translate3d`
  only — never animate `top`/`margin`. No library needed.
- A small live readout showing scroll progress % + layer offsets, to make it
  legible that this is *engineered*, not a stock plugin.

### Section B — 3D UI: *"Dimension"*
Two tiers, so it's impressive **and** fast:

- **Tier 1 — CSS 3D (always loaded, ~2 KB):**
  `perspective` + `preserve-3d` + pointer-tracked tilt.
  - Mouse-tracked tilting card with real depth layers and a moving specular
    highlight
  - A rotating cube whose 6 faces are your tech logos
  - A 3D-flip stat panel and an exploded-layer UI mock
- **Tier 2 — real WebGL (lazy, behind an intersection observer + "Load 3D demo"
  button):** `three` + `@react-three/fiber` + `@react-three/drei`.
  - A floating distorted-material object with mouse parallax and a
    contact-shadow floor, plus live controls (color, distort, speed, wireframe)
  - Costs ~600 KB gz — which is exactly why it's lazy-loaded, and *saying so on
    the page* ("deferred until visible — 0 KB on first paint") is itself the
    senior-engineer signal.
- **Why both:** you sell Three.js. Shipping zero WebGL is a credibility gap.
  Shipping WebGL that tanks your Lighthouse score is worse. This gets both.

### Section C — Morphism Lab: *"Design Systems Lab"*
**The mechanic that makes this land:** one style switcher, and the **same six
components** re-skin live — a card, a primary button, a toggle, a slider, an
input, and a stat tile. Identical content, N skins. A visitor understands in two
seconds that you control the visual language.

Styles to ship (8, with 2 more trivially addable):

| Style | Technique | "Best for" tag |
|---|---|---|
| **Glassmorphism** | `backdrop-filter: blur` + 1px light border + inner highlight | SaaS overlays, dark hero UI |
| **Neumorphism** | dual soft light/dark shadow, low contrast, light + dark variants | Music/IoT/smart-home controls |
| **Claymorphism** | thick radii, pastel fills, dual inset + drop shadow | Playful apps, kids/edtech |
| **Neubrutalism** | hard 2-3px black border, offset solid shadow, saturated flats | Bold startups, dev tools |
| **Skeuomorphism** | bevel + gloss gradient + inner shadow + noise texture | Nostalgia, audio plugins |
| **Aurora / Gradient mesh** | animated conic/radial blobs behind blur | AI products, launch pages |
| **Bento / Swiss** | strict grid, hairlines, mono labels, zero shadow | Dashboards, docs, data |
| **Cyber / Terminal** | scanlines, CRT glow, mono, clipped corners | Web3, security, infra |

Each style card includes:
- **Working** interactive controls (button press states, toggle, slider) so
  hovering/clicking *feels* different per style — not a static screenshot
- A one-line "best for" so it reads as design judgement, not decoration
- A **"View CSS"** disclosure showing the actual shadow/border/filter values —
  this is the detail that converts "nice" into "I want to hire this person"
- An **honest a11y note** on Neumorphism (inherently low contrast, weak
  affordance). Flagging the tradeoff reads as *more* expert than hiding it.
- A **"Build my site in this style"** CTA on each card → prefilled WhatsApp
  message naming the style. Turns the demo into a lead source.

**Architecture (important — avoids 2,000 lines of copy-paste):** a
`components/lab/styles/` registry, one object per style holding CSS-custom-property
token values, plus **one** set of primitives (`LabCard`, `LabButton`, `LabToggle`,
`LabSlider`, `LabInput`, `LabStat`) that read those vars from a wrapper. Adding a
9th style = one new object.

---

## PART 4 — What to ADD for market interest (beyond the three demos)

Ordered by conversion impact per hour of work:

1. **Process / "How we work"** — 5 steps: Discovery → Proposal & fixed quote →
   Design → Build with daily updates → Launch + 30-day support. Removes buyer
   anxiety; consistently one of the top-3 conversion drivers on agency sites.
2. **Two real case studies with depth** — upgrade E-Book Emporium + the XAI
   project into modal/page detail: *problem → constraints → decisions → stack →
   result → what I'd do differently.* One honest case study beats ten thumbnails.
3. **Restore your real credentials** — IBM certificate, frontend certificate, and
   the XAI research project as a verifiable trust strip. `public/images/IBM.png`
   and `Certificate1frontend.png` are already sitting there unused.
4. **Founder section with a real name + photo + LinkedIn/GitHub.** Highest single
   trust lever available to you.
5. **FAQ + `FAQPage` JSON-LD** — answers objections *and* wins SEO rich results.
   Questions: timeline, revisions, code ownership, payment schedule, maintenance,
   what if I already have a site, do you do just design.
6. **Capability matrix** — restore `TechnicalSkills` but with honest tiers
   (expert / working / learning). Honesty here reads as senior.
7. **Booking link (Cal.com, free)** alongside WhatsApp. WhatsApp-only signals
   "informal, cheap" to the higher-budget clients you want.
8. **Lead magnet** — "Free 5-point website audit, 24h turnaround" or use the
   existing EBOOK asset. Captures email from visitors who aren't ready to buy.
9. **Self-referential performance proof** — a badge with *this* site's real
   Lighthouse score. "This page scores 98/100 — yours will too" is unbeatable
   proof for a developer, and it's free once Phase 5 lands.
10. **`/lab` as a shareable standalone route** — the morphism + 3D lab is genuinely
    postable to Reddit/X/LinkedIn. That's your top-of-funnel.

---

## PART 5 — Execution phases

### Phase 0 — Foundation (no visible change; unblocks everything)
- Tailwind → real dependency + PostCSS + `tailwind.config.js`; delete the CDN
  script and the inline config (T1)
- Remove the `aistudiocdn` import map (T2)
- Replace Font Awesome with inline SVG icons / `lucide-react` (T3)
- Fix `vite.config.js`, `package.json` name, delete/refresh `metadata.json` (T4, T5)
- Add `favicon.svg`, apple-touch-icon, `og-image.png` (T6)
- Define the full **design-token layer** as CSS custom properties + light/dark
- Add OG/Twitter/canonical meta + `ProfessionalService` JSON-LD (T9)
- Add `robots.txt` + `sitemap.xml` (T10)

### Phase 1 — Visual system rebuild
- Type system + fluid `clamp()` scale; load fonts properly (`display=swap`, preload)
- Recolor to 2 accents; strip gradient-text down to one moment per viewport
- Rewrite `common/Section.jsx`: mono numerals, hairline rules, asymmetric options
- Rebuild `Hero` — editorial, one gradient moment, magnetic CTA, honest stats
- `Header` → `IntersectionObserver`, add theme toggle + scroll-progress bar (T7)
- Rewrite `AnimatedBackground`: DPR-aware, particle cap, throttled pointer,
  pause on `visibilitychange`, mobile-reduced, reduced-motion respected (T8)
- Add the cursor-spotlight motif + staggered reveal primitives

### Phase 2 — The three demo sections
- `components/lab/Parallax.jsx` (Section A)
- `components/lab/Dimension.jsx` + lazy `ThreeScene.jsx` (Section B)
- `components/lab/DesignLab.jsx` + `lab/styles/*` registry + 6 primitives (Section C)
- Add **Lab** to nav; code-split the whole cluster with `React.lazy` + `Suspense`

### Phase 3 — Trust & content
- Process section
- Case-study detail views for 2 projects
- Restore credentials strip + capability matrix
- Founder/About with real identity
- FAQ + `FAQPage` schema
- **Testimonials decision** (see open questions) — replace the fabricated set with
  one of: real quotes you can source, anonymised-but-true client outcomes, a
  "what working with me looks like" commitments block, or GitHub/cert social proof

### Phase 4 — Conversion
- Pricing: real anchors ("from ₹X"), scope clarity, add an "unsure?" fourth path
- Booking link + WhatsApp + email, all three
- Lead-magnet capture
- Harden the contact form: honeypot, submit throttle, better success/error states,
  move the endpoint out of plain source where practical (T11)

### Phase 5 — Performance, a11y, polish
- Images → WebP/AVIF, explicit dimensions, lazy, `decoding="async"` (T13)
- Route/section-level code splitting audit; verify LCP element
- Full keyboard pass, focus rings, contrast check (the `text-dark/60` at 60%
  opacity is borderline), `aria-*` on all lab controls
- Lighthouse: target **95+** on all four, CLS **< 0.05**
- Cross-browser check on `backdrop-filter` and `animation-timeline`

---

## PART 6 — Open decisions (need your call before Phase 3)

1. **Testimonials** — replace the fabricated quotes with an honest alternative,
   or keep as-is? *Strong recommendation: replace.* It's the biggest single risk
   to being taken seriously, and the honest versions convert better.
2. **3D approach** — CSS-3D only (fast, zero deps) or CSS-3D **+** lazy real
   WebGL? *Recommendation: both, staged.*
3. **Identity** — solo freelancer under a brand ("I'm Ushna, I build as WEBIFY")
   or keep the collective "we"? *Recommendation: solo + named.* It's more
   credible at this deal size, and it's the truth.
4. **Pricing** — publish real starting numbers or keep all-Custom?
   *Recommendation: publish "from ₹X" anchors.*

---

## Success criteria

- Lighthouse ≥ 95 across Performance / A11y / Best Practices / SEO
- No CDN-compiled Tailwind, no Font Awesome, no import map
- Every claim on the page is one you can defend if a client asks for proof
- The Lab section is good enough that you'd post it publicly without hesitation
- A stranger can answer, in under 30 seconds: *what does this person build, are
  they any good, what will it cost, and how do I start?*
