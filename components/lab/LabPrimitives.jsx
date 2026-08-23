import React, { useId, useState } from 'react';

/**
 * The six primitives every design language in the Lab re-skins.
 *
 * They contain no per-style logic at all — every visual decision comes from the
 * custom properties the surrounding `.lab-<id>` class sets. That is the whole
 * demonstration: identical markup and identical content, eight visual systems.
 */

/**
 * `showLabel={false}` is for the narrow selector swatches, where a visible
 * label and the switch collide. The name still reaches assistive tech via
 * aria-label, so nothing is lost.
 */
export const LabToggle = ({ label, defaultOn = false, showLabel = true }) => {
  const [on, setOn] = useState(defaultOn);
  const id = useId();

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      {...(showLabel ? { 'aria-labelledby': id } : { 'aria-label': label })}
      onClick={() => setOn((v) => !v)}
      className="lab-toggle"
    />
  );

  if (!showLabel) return control;

  return (
    <div className="flex items-center justify-between gap-4">
      <span id={id} className="text-[0.8125rem]" style={{ color: 'var(--lab-text)' }}>
        {label}
      </span>
      {control}
    </div>
  );
};

export const LabSlider = ({ label, defaultValue = 64, unit = '%' }) => {
  const [value, setValue] = useState(defaultValue);
  const id = useId();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="lab-label">
          {label}
        </label>
        <span
          className="text-[0.6875rem] tabular-nums"
          style={{ color: 'var(--lab-text-dim)' }}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="lab-slider"
      />
    </div>
  );
};

export const LabInput = ({ label, placeholder }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="lab-label">
        {label}
      </label>
      <input id={id} type="text" placeholder={placeholder} className="lab-input" />
    </div>
  );
};

export const LabStat = ({ value, label }) => (
  <div className="lab-stat">
    <b>{value}</b>
    <span>{label}</span>
  </div>
);

export const LabButton = ({ children, variant = 'solid', ...rest }) => (
  <button
    type="button"
    className={`lab-btn ${variant === 'ghost' ? 'lab-btn--ghost' : ''}`}
    {...rest}
  >
    {children}
  </button>
);

/**
 * The demo body. Every style renders exactly this.
 */
export const LabDemoBody = ({ style }) => (
  <>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="lab-title">Project settings</h4>
        <p className="lab-sub">{style.bestFor}</p>
      </div>
      <span
        className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]"
        style={{
          color: 'var(--lab-text-dim)',
          border: 'var(--lab-border)',
        }}
      >
        {style.year}
      </span>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-2.5">
      <LabStat value="98" label="Perf score" />
      <LabStat value="1.2s" label="Load time" />
    </div>

    <div className="mt-6 space-y-4">
      <LabToggle label="Enable notifications" defaultOn />
      <LabToggle label="Public project" />
      <LabSlider label="Opacity" defaultValue={72} />
      <LabInput label="Project name" placeholder="acme-website" />
    </div>

    <div className="mt-6 flex flex-wrap gap-2.5">
      <LabButton>Save changes</LabButton>
      <LabButton variant="ghost">Cancel</LabButton>
    </div>
  </>
);
