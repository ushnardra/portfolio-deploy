/**
 * The design-language registry.
 *
 * Each entry is metadata only — the actual visual definition lives in one
 * `.lab-<id>` block in lab.css. Adding a ninth style means one entry here plus
 * one CSS block; the markup in DesignLab.jsx never changes.
 *
 * `css` is the abridged source shown in the "View CSS" disclosure. It is the
 * genuinely load-bearing declarations for that style, not the full block —
 * showing the real values is the point, showing 60 lines of custom properties
 * is not.
 *
 * Each style's backdrop is `.lab-<id>-ground` by convention (defined in
 * lab.css), so it isn't repeated here.
 */
export const LAB_STYLES = [
  {
    id: 'glass',
    name: 'Glassmorphism',
    year: '2020',
    bestFor: 'Overlays and floating panels on a busy or colourful backdrop',
    blurb:
      'Translucency plus a real background blur, with a 1px light border and an inner top highlight to fake the lit edge of a pane.',
    css: `background: rgb(255 255 255 / 0.08);
backdrop-filter: blur(18px) saturate(170%);
border: 1px solid rgb(255 255 255 / 0.18);
border-radius: 18px;
box-shadow:
  0 8px 32px rgb(0 0 0 / 0.32),
  inset 0 1px 0 rgb(255 255 255 / 0.25);`,
    gotcha:
      'Needs something behind it or it just looks grey. backdrop-filter is also the most expensive property here — it forces a new compositing layer, so avoid animating it.',
  },
  {
    id: 'neu',
    name: 'Neumorphism',
    year: '2019',
    bestFor: 'Physical-feeling controls — audio, IoT, smart-home dashboards',
    blurb:
      'Two opposing shadows on a mid-tone ground make elements look extruded from, or pressed into, the surface. Press the button — it inverts.',
    css: `background: #e4e9f2;
border-radius: 22px;
box-shadow:
  9px 9px 20px #c2c8d4,
  -9px -9px 20px #ffffff;

/* pressed: invert both shadows inward */
box-shadow:
  inset 4px 4px 9px #c2c8d4,
  inset -4px -4px 9px #ffffff;`,
    a11yNote:
      'Genuinely hard to make accessible: the style depends on very low contrast, so borders and text often fail WCAG AA, and nothing signals "this is pressable". Use it for decorative controls with a visible label, never as the only affordance.',
  },
  {
    id: 'clay',
    name: 'Claymorphism',
    year: '2021',
    bestFor: 'Playful products — edtech, kids apps, consumer mobile',
    blurb:
      'Oversized radii and a thick coloured drop shadow, with dual inset highlights so the surface reads as soft moulded plastic.',
    css: `background: #f3ecff;
border-radius: 32px;
box-shadow:
  0 18px 34px -10px rgb(109 40 217 / 0.30),
  inset -7px -7px 16px rgb(255 255 255 / 0.85),
  inset  7px  7px 16px rgb(109 40 217 / 0.14);

/* buttons get a hard "base" that compresses on press */
box-shadow: 0 9px 0 0 #6d28d9;`,
    gotcha:
      'The chunky base shadow has to shrink by exactly the distance the button travels, or it looks like it detaches on press.',
  },
  {
    id: 'brutal',
    name: 'Neubrutalism',
    year: '2022',
    bestFor: 'Developer tools and bold startup brands that want to be loud',
    blurb:
      'Flat saturated fills, hard 3px black borders and a solid offset shadow with no blur. The whole element shifts into its own shadow on press.',
    css: `background: #ffe94d;
border: 3px solid #0a0a0a;
border-radius: 6px;
box-shadow: 8px 8px 0 0 #0a0a0a;

/* press: move into the shadow */
transform: translate(4px, 4px);
box-shadow: 1px 1px 0 0 #0a0a0a;`,
    gotcha:
      'Set the shadow to exactly 0 blur. A 1px blur reads as a mistake rather than a style.',
  },
  {
    id: 'skeu',
    name: 'Skeuomorphism',
    year: '2007',
    bestFor: 'Audio plugins, retro-themed products, deliberate nostalgia',
    blurb:
      'Vertical gradients, a bright inset top bevel, a dark bottom edge and a gloss sweep over the upper half — the pre-2013 iOS vocabulary.',
    css: `background: linear-gradient(#5b95e8, #2f6fd0 52%, #2861bd);
border: 1px solid #1f4d99;
border-radius: 8px;
box-shadow:
  inset 0 1px 0 rgb(255 255 255 / 0.50),
  inset 0 -1px 0 rgb(0 0 0 / 0.20),
  0 2px 4px rgb(20 26 38 / 0.40);
text-shadow: 0 1px 0 rgb(255 255 255 / 0.55);

/* the gloss is a ::before covering the top 46% */`,
    gotcha:
      'The gloss pseudo-element sits above the content unless you give the children a higher z-index — easy to miss, and it swallows clicks.',
  },
  {
    id: 'aurora',
    name: 'Aurora mesh',
    year: '2023',
    bestFor: 'AI products and launch pages that need to feel alive',
    blurb:
      'Heavily blurred colour blobs drifting behind a dark translucent panel, producing gradient mesh without an image or a canvas.',
    css: `/* three blobs, blurred into a mesh */
background:
  radial-gradient(circle at 28% 32%, #8b5cf6 0%, transparent 42%),
  radial-gradient(circle at 72% 24%, #ec4899 0%, transparent 42%),
  radial-gradient(circle at 52% 80%, #22d3ee 0%, transparent 42%);
filter: blur(38px);
animation: auroraDrift 16s ease-in-out infinite alternate;

/* panel on top */
background: rgb(9 12 24 / 0.72);
backdrop-filter: blur(14px);`,
    gotcha:
      'Animate transform on the blob layer, never the gradient stops or the blur radius — those repaint every frame and will drop you to single-digit FPS.',
  },
  {
    id: 'bento',
    name: 'Bento / Swiss',
    year: '2023',
    bestFor: 'Dashboards, documentation, anything data-dense',
    blurb:
      'No shadows at all. Hierarchy comes from a strict grid, hairline dividers, monospace labels and generous whitespace.',
    css: `background: #ffffff;
border: 1px solid #e3e5ea;
border-radius: 10px;
box-shadow: none;

/* hierarchy from type and space, not depth */
label {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}`,
    gotcha:
      'The hardest one to do well — with no shadows or colour to hide behind, every alignment and spacing error is visible.',
  },
  {
    id: 'cyber',
    name: 'Cyber / terminal',
    year: '2021',
    bestFor: 'Security, infrastructure, web3 and developer-facing tooling',
    blurb:
      'Monospace throughout, near-black ground, phosphor-green glow, and CRT scanlines from a single repeating-linear-gradient.',
    css: `background: #03110c;
border: 1px solid rgb(0 255 156 / 0.32);
border-radius: 2px;
box-shadow:
  0 0 24px rgb(0 255 156 / 0.16),
  inset 0 0 40px rgb(0 255 156 / 0.05);

/* scanlines, as one pseudo-element */
background: repeating-linear-gradient(
  rgb(0 255 156 / 0.055) 0 1px,
  transparent 1px 3px
);`,
    a11yNote:
      'Saturated green on near-black clears AA for large text but is fatiguing to read at body size. Keep paragraphs short and never rely on the glow alone to indicate focus.',
  },
];
