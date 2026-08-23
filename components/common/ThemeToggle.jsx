import React from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const LABEL = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'Follow system theme',
};

const ThemeToggle = ({ className = '' }) => {
  const { theme, cycleTheme } = useTheme();

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : MonitorSmartphone;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      // The label states the *current* mode; the title explains the affordance.
      aria-label={`${LABEL[theme]}. Activate to change theme.`}
      title={`${LABEL[theme]} — click to change`}
      className={`grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:bg-surface-3 hover:text-ink-1 ${className}`}
    >
      <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
