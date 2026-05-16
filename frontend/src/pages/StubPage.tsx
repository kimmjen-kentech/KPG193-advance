import type { LucideIcon } from 'lucide-react';

interface StubPageProps {
  title: string;
  tagline: string;
  icon: LucideIcon;
}

export const StubPage = ({ title, tagline, icon: Icon }: StubPageProps) => (
  <div className="space-y-16">
    <header className="space-y-3 border-b border-border pb-8">
      <h1 className="font-serif text-5xl italic leading-tight tracking-tight text-fg">{title}</h1>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">{tagline}</p>
    </header>
    <div className="flex flex-col items-center justify-center gap-4 border border-border bg-bg-elev py-24 text-center">
      <Icon size={48} strokeWidth={1} className="text-fg-subtle" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fg-subtle">
        Coming Soon
      </p>
    </div>
  </div>
);
