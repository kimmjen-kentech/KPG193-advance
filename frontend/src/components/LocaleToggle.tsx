import { useI18n } from '../hooks/useI18n';
import { cn } from '../lib/cn';

export const LocaleToggle = () => {
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex h-8 items-center border border-border">
      {(['ko', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-label={`${l} 로 전환`}
          className={cn(
            'h-full px-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors',
            locale === l
              ? 'bg-fg text-bg'
              : 'text-fg-muted hover:text-fg',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
