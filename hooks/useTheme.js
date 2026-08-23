import { useCallback, useEffect, useState } from 'react';

const KEY = 'fluidwebsoft-theme';

/**
 * Three-state theme: 'light', 'dark', or 'system'.
 *
 * 'system' deliberately stores nothing and removes the attribute, letting the
 * `prefers-color-scheme` block in index.css take over. The initial value is
 * applied by a tiny inline script in index.html so there is no flash of the
 * wrong theme before React hydrates.
 */
const read = () => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      root.removeAttribute('data-theme');
      try {
        localStorage.removeItem(KEY);
      } catch { /* private mode */ }
    } else {
      root.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(KEY, theme);
      } catch { /* private mode */ }
    }
  }, [theme]);

  /** Cycles light → dark → system, so the OS option stays reachable. */
  const cycleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'));
  }, []);

  return { theme, setTheme, cycleTheme };
};
