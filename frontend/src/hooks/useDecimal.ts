import { useSyncExternalStore } from 'react';

export type DecimalMode = '0' | '1' | '2' | '3' | 'exact';

export const DECIMAL_STORAGE_KEY = 'kpg193:decimal';

type Listener = () => void;
const listeners = new Set<Listener>();

const readInitial = (): DecimalMode => {
  if (typeof window === 'undefined') return '1';
  const stored = window.localStorage.getItem(DECIMAL_STORAGE_KEY);
  if (stored === '0' || stored === '1' || stored === '2' || stored === '3' || stored === 'exact') {
    return stored;
  }
  return '1';
};

let current: DecimalMode = readInitial();

const setMode = (next: DecimalMode) => {
  if (next === current) return;
  current = next;
  try {
    window.localStorage.setItem(DECIMAL_STORAGE_KEY, next);
  } catch {
    // ignore
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

export const useDecimal = (): {
  mode: DecimalMode;
  setMode: (m: DecimalMode) => void;
} => {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { mode, setMode };
};
