import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon?: LucideIcon;
  className?: string;
}

export const KpiCard = ({ label, value, unit, icon: Icon, className }: KpiCardProps) => (
  <div
    className={cn(
      'flex min-w-[180px] flex-col gap-2 border border-border bg-bg-elev p-4',
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
        {label}
      </span>
      {Icon ? <Icon size={14} strokeWidth={1.6} className="text-fg-subtle" /> : null}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-mono text-2xl font-bold tracking-tight tabular-nums text-fg">
        {value}
      </span>
      {unit ? <span className="font-mono text-xs text-fg-muted">{unit}</span> : null}
    </div>
  </div>
);
