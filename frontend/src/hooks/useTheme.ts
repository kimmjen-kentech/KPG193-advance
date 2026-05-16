import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'kpg193:theme';

// Singleton + Observer pattern: one module-scoped store, subscribers notified on change.
type Listener = () => void;
const listeners = new Set<Listener>();

const readInitial = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

let current: Theme = readInitial();

const applyToDom = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
};
applyToDom(current);

const setTheme = (next: Theme) => {
  if (next === current) {
    applyToDom(current);
    return;
  }
  current = next;
  applyToDom(current);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // ignore storage errors
  }
  listeners.forEach((l) => l());
};

const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

const getSnapshot = () => current;

// Re-sync from localStorage on every hook mount so tests / external writes are picked up.
const resync = () => {
  const next = readInitial();
  if (next !== current) {
    current = next;
    applyToDom(current);
    listeners.forEach((l) => l());
  } else {
    applyToDom(current);
  }
};

export const useTheme = () => {
  resync();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    theme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    setTheme,
  };
};
