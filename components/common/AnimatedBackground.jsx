import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Ambient drifting particle field with a pointer trail.
 *
 * Rewritten from the original for five reasons, all of which were real bugs:
 *  1. Pointer spawning was unbounded — every `mousemove` pushed two particles
 *     with no cap, so a fast mouse could grow the array without limit.
 *  2. No devicePixelRatio scaling, so it rendered blurry on every retina/HiDPI
 *     display.
 *  3. Trails were faked with a hard-coded `rgba(0,0,0,0.2)` overlay, which is
 *     invisible-to-wrong once a light theme exists.
 *  4. It ignored `prefers-reduced-motion` and kept running on hidden tabs,
 *     burning battery for nothing.
 *  5. Density was fixed at 200 stars regardless of viewport, so phones paid the
 *     same cost as a desktop for a field nobody can see.
 *
 * Colours come from CSS custom properties, so the field follows the theme.
 */

const MAX_TRAIL = 90;          // hard ceiling on trail particles
const TRAIL_SPAWN_MS = 22;     // pointer spawn throttle
const AREA_PER_STAR = 15000;   // px² of viewport per star

/**
 * Skip the field entirely on touch/small screens.
 *
 * The pointer trail — the half of this that people actually notice — can never
 * fire without a fine pointer, so on a phone this is a permanent rAF loop
 * drawing drifting dots nobody looks at, competing with first render and
 * draining battery. Those viewports still get the CSS grid and gradient orbs.
 */
const shouldRender = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  window.innerWidth >= 640;

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!shouldRender()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Reduced motion: paint one static frame and stop. Still decorative, but
    // nothing moves.
    let raf = 0;
    let running = true;
    let stars = [];
    let trail = [];
    let lastSpawn = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    let starRGB = '255 255 255';
    let starAlpha = 0.55;
    let accents = ['#22d3ee', '#3b9df8', '#6366f1'];

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      starRGB = (cs.getPropertyValue('--star-rgb') || '255 255 255').trim();
      starAlpha = parseFloat(cs.getPropertyValue('--star-alpha')) || 0.55;
      const a = ['--a1', '--a2', '--a3']
        .map((v) => cs.getPropertyValue(v).trim())
        .filter(Boolean);
      if (a.length === 3) accents = a;
    };

    const resize = () => {
      // Cap DPR at 2 — beyond that we're pushing 3-4x the pixels for no
      // perceptible gain on a background field.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(150, Math.round((w * h) / AREA_PER_STAR));
      stars = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.35,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        a: Math.random(),
        da: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1),
      }));
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = s.a * starAlpha;
        ctx.fillStyle = `rgb(${starRGB})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      // Stars: drift + twinkle. fillStyle is set once for the whole batch.
      ctx.fillStyle = `rgb(${starRGB})`;
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        else if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        else if (s.y > h) s.y = 0;

        s.a += s.da;
        if (s.a > 1) { s.a = 1; s.da *= -1; }
        else if (s.a < 0.05) { s.a = 0.05; s.da *= -1; }

        ctx.globalAlpha = s.a * starAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pointer trail, iterated backwards so removal is safe.
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.r = Math.max(0, p.r - 0.045);

        if (p.life <= 0 || p.r <= 0.1) {
          trail.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = (p.life / p.maxLife) * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e) => {
      // Fine pointers only, and throttled — this is what made the original
      // grow without bound.
      if (e.pointerType === 'touch') return;
      const now = performance.now();
      if (now - lastSpawn < TRAIL_SPAWN_MS) return;
      lastSpawn = now;

      if (trail.length >= MAX_TRAIL) trail.shift();
      const maxLife = Math.random() * 40 + 35;
      trail.push({
        x: e.clientX,
        y: e.clientY,
        r: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        maxLife,
        life: maxLife,
        color: accents[(Math.random() * accents.length) | 0],
      });
    };

    // Stop entirely on a hidden tab; nothing to render, no battery to spend.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced) {
        running = true;
        if (!raf) raf = requestAnimationFrame(frame);
      }
    };

    // Re-read tokens when the theme attribute flips.
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduced) drawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    readTheme();
    resize();

    /* Hold the render loop until the main thread is idle. Starting it during
       hydration made the animation compete with first paint and showed up
       directly as blocking time — it is decoration, so it yields. */
    let startHandle;
    const start = () => {
      if (reduced) {
        drawStatic();
        return;
      }
      raf = requestAnimationFrame(frame);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    };

    if (typeof requestIdleCallback === 'function') {
      startHandle = requestIdleCallback(start, { timeout: 1500 });
    } else {
      startHandle = setTimeout(start, 400);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (typeof cancelIdleCallback === 'function' && typeof startHandle === 'number') {
        cancelIdleCallback(startHandle);
      }
      clearTimeout(startHandle);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
};

export default AnimatedBackground;
