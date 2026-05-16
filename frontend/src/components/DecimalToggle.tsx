import { useDecimal, type DecimalMode } from '../hooks/useDecimal';
import { cn } from '../lib/cn';

const OPTIONS: Array<{ value: DecimalMode; label: string; title: string }> = [
  { value: '0', label: '0', title: '0 decimals' },
  { value: '1', label: '.0', title: '1 decimal' },
  { value: '2', label: '.00', title: '2 decimals' },
  { value: 'exact', label: '∞', title: 'Exact (preserve precision)' },
];

export const DecimalToggle = () => {
  const { mode, setMode } = useDecimal();
  return (
    <div className="inline-flex h-8 items-center border border-border">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setMode(opt.value)}
          title={opt.title}
          className={cn(
            'h-full px-1.5 font-mono text-[10px] font-bold tracking-[0.1em] transition-colors',
            mode === opt.value ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
