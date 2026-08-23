import React from 'react';

/**
 * PIKI's face.
 *
 * A soft blob, not a robot. The earlier version had a head, a visor and an
 * antenna, which read as a machine — wrong for something meant to feel like a
 * friendly person answering questions. This is one organic rounded shape with
 * eyes and a smile, built from the site's own accent ramp so the character
 * still belongs to the page rather than sitting on top of it.
 *
 * The blink is a CSS animation on the eye group (see `piki-blink` in
 * index.css), not JS state, so an idle widget costs zero renders.
 *
 * @param {'idle'|'thinking'|'happy'} mood
 */
const PikiAvatar = ({ size = 32, mood = 'idle', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    role="img"
    aria-label="PIKI"
    className={className}
  >
    <defs>
      <linearGradient id="piki-body" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="var(--a1)" />
        <stop offset="52%" stopColor="var(--a2)" />
        <stop offset="100%" stopColor="var(--a3)" />
      </linearGradient>
      <radialGradient id="piki-sheen" cx="0.35" cy="0.28" r="0.55">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Body — a squircle with one softened corner, which is what keeps it
        friendly rather than a plain circle or a hard app icon. */}
    <path
      d="M20 3.4c9.6 0 16.6 6.4 16.6 16.2 0 6.6-2.5 11.4-7 14.1-3 1.8-6.3 2.7-9.9 2.7-9.7 0-16.3-6.6-16.3-16.5C3.4 10 10.3 3.4 20 3.4Z"
      fill="url(#piki-body)"
    />

    {/* Eyes. `thinking` narrows them into a soft concentrating squint. */}
    {mood === 'thinking' ? (
      <>
        <path
          d="M12.4 19.6q2.6-2 5.2 0"
          stroke="#08222b"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22.4 19.6q2.6-2 5.2 0"
          stroke="#08222b"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ) : (
      <g className="piki-eyes">
        <ellipse cx="15" cy="19" rx="2.5" ry="3" fill="#08222b" />
        <ellipse cx="25" cy="19" rx="2.5" ry="3" fill="#08222b" />
        {/* Catchlights — the detail that turns a dot into an eye */}
        <circle cx="15.9" cy="17.9" r="0.95" fill="#fff" fillOpacity="0.95" />
        <circle cx="25.9" cy="17.9" r="0.95" fill="#fff" fillOpacity="0.95" />
      </g>
    )}

    {/* Smile — always present, wider when happy */}
    <path
      d={mood === 'happy' ? 'M15.2 25.4q4.8 4 9.6 0' : 'M16.4 25.6q3.6 2.6 7.2 0'}
      stroke="#08222b"
      strokeWidth="1.9"
      strokeLinecap="round"
      fill="none"
    />

    {/* Cheeks — the one unmistakably cute element, kept faint so it survives
        at 22px without turning into blotches. */}
    <ellipse cx="9.6" cy="23.4" rx="2.1" ry="1.4" fill="#fff" fillOpacity="0.22" />
    <ellipse cx="30.4" cy="23.4" rx="2.1" ry="1.4" fill="#fff" fillOpacity="0.22" />

    {/* Sheen */}
    <ellipse cx="15" cy="11" rx="8.5" ry="5" fill="url(#piki-sheen)" />

    {/* Spark — a small nod to "assistant" that replaces the antenna, carrying
        the status colour. Suppressed below 28px: a four-pointed star rendered
        into ~4 device pixels is a smudge, not a detail, and the inline message
        avatars read cleaner as a plain face. */}
    {size >= 28 && (
      <path
        d="M32.2 7.4 33.1 10l2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"
        fill={mood === 'thinking' ? 'var(--sig)' : 'var(--ok)'}
        className={mood === 'thinking' ? 'piki-pulse' : ''}
      />
    )}
  </svg>
);

export default PikiAvatar;
