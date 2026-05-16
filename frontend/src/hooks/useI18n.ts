import { useSyncExternalStore } from 'react';
import { translations, type Locale, type Translation } from '../i18n/translations';

export const LOCALE_STORAGE_KEY = 'kpg193:locale';

type Listener = () => void;
const listeners = new Set<Listener>();

const readInitial = (): Locale => {
  if (typeof window === 'undefined') return 'ko';
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'ko' || stored === 'en') return stored;
  const lang = window.navigator.language ?? '';
  return lang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
};

let current: Locale = readInitial();

const applyToDom = (locale: Locale) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
};
applyToDom(current);

const setLocale = (next: Locale) => {
  if (next === current) return;
  current = next;
  applyToDom(current);
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
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

export const useI18n = (): { t: Translation; locale: Locale; setLocale: (l: Locale) => void; toggle: () => void } => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    t: translations[locale],
    locale,
    setLocale,
    toggle: () => setLocale(locale === 'ko' ? 'en' : 'ko'),
  };
};
