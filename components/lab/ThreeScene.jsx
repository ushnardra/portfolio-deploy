import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * The real-WebGL half of the Dimension demo.
 *
 * This module is the entire reason for the `three` manual chunk in
 * vite.config.js: it is lazy-imported, so none of three.js/fiber/drei is in the
 * initial bundle. It only downloads once the visitor asks for it.
 *
 * Everything here is generated in code — no HDRIs, GLTFs or font files. drei's
 * <Environment> is avoided on purpose because its presets fetch an HDR from a
 * CDN, which would fail behind a strict CSP or offline.
 */

const SWATCHES = ['#22d3ee', '#8b5cf6', '#f472b6', '#fbbf24', '#34d399'];

const ThreeScene = ({ frameloop = 'always' }) => {
  const reduced = usePrefersReducedMotion();
  const [color, setColor] = useState(SWATCHES[0]);
  const [distort, setDistort] = useState(0.42);
  const [speed, setSpeed] = useState(1.6);
  const [wireframe, setWireframe] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* Canvas */}
      <div className="relative h-[26rem] overflow-hidden rounded-2xl border border-line bg-surface-1/50">
        <Canvas
          // Cap the pixel ratio — an uncapped retina canvas renders 4x the
          // pixels for no visible gain on a decorative scene.
          dpr={[1, 1.75]}
          frameloop={frameloop}
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          // No `shadows` here on purpose: <ContactShadows> renders its own
          // soft ground shadow, so enabling the shadow map would add a second
          // render pass every frame for no visible difference (and trips
          // three's PCFSoftShadowMap deprecation warning).
        >
          <color attach="background" args={['#080b12']} />

          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 4]} intensity={2.1} />
          <pointLight position={[-4, -2, -3]} intensity={2.4} color={color} />

          <Float
            speed={reduced ? 0 : 1.5}
            rotationIntensity={reduced ? 0 : 0.7}
            floatIntensity={reduced ? 0 : 0.9}
          >
            <mesh position={[0, 0.15, 0]}>
              {/* A high-segment sphere: MeshDistortMaterial displaces vertices,
                  so it needs geometry dense enough to deform smoothly. */}
              <sphereGeometry args={[1.2, 64, 64]} />
              <MeshDistortMaterial
                color={color}
                distort={distort}
                speed={reduced ? 0 : speed}
                roughness={0.22}
                metalness={0.4}
                wireframe={wireframe}
              />
            </mesh>
          </Float>

          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.5}
            scale={9}
            blur={2.6}
            far={4}
            color="#000000"
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={!reduced}
            autoRotateSpeed={0.7}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>

        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] text-ink-3">
          drag to orbit
        </p>
      </div>

      {/* Controls — a live scene nobody can touch is just a video */}
      <div className="rounded-2xl border border-line p-6">
        <p className="eyebrow">Live material controls</p>

        <div className="mt-5">
          <span className="mb-2.5 block text-xs font-medium text-ink-2">Colour</span>
          <div className="flex gap-2">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Set material colour to ${c}`}
                aria-pressed={color === c}
                className={`size-8 rounded-full transition-transform hover:scale-110 ${
                  color === c ? 'ring-2 ring-ink-1 ring-offset-2 ring-offset-surface-0' : ''
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="flex items-baseline justify-between text-xs font-medium text-ink-2">
              Distortion
              <span className="font-mono tabular-nums text-ink-3">{distort.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={distort}
              onChange={(e) => setDistort(Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between text-xs font-medium text-ink-2">
              Speed
              <span className="font-mono tabular-nums text-ink-3">{speed.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={reduced}
              className="mt-2 w-full accent-brand disabled:opacity-40"
            />
            {reduced && (
              <span className="mt-1 block text-[11px] text-ink-3">
                Animation paused — your system requests reduced motion.
              </span>
            )}
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-ink-2">Wireframe</span>
            <button
              type="button"
              role="switch"
              aria-checked={wireframe}
              onClick={() => setWireframe((v) => !v)}
              className={`relative h-6 w-11 rounded-full border transition-colors ${
                wireframe ? 'border-brand bg-brand/30' : 'border-line bg-surface-3'
              }`}
            >
              <span
                className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-ink-1 transition-[left] duration-300 ${
                  wireframe ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </label>
        </div>

        <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-3">
          three.js, react-three-fiber and drei — roughly 600&nbsp;kB gzipped, code-split
          into its own chunk and fetched only when you pressed the button. That is why
          the page still loaded fast.
        </p>
      </div>
    </div>
  );
};

export default ThreeScene;
