import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionHeader = ({ number, title, className }: SectionHeaderProps) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div className="flex h-7 w-7 items-center justify-center bg-fg font-mono text-[10px] font-bold text-bg">
      {number}
    </div>
    <h3 className="font-serif text-3xl italic leading-none tracking-tight text-fg">{title}</h3>
  </div>
);
