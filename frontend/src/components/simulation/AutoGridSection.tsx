import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { SectionHeader } from '../ui/SectionHeader';

const PipelineBox = ({
  label,
  desc,
  variant = 'plain',
}: {
  label: string;
  desc: string;
  variant?: 'plain' | 'accent';
}) => (
  <div
    className={[
      'flex-1 border p-4 text-center',
      variant === 'accent'
        ? 'border-accent bg-bg-elev'
        : 'border-border bg-bg',
    ].join(' ')}
  >
    <div
      className={[
        'font-mono text-[10px] font-bold uppercase tracking-[0.2em]',
        variant === 'accent' ? 'text-accent' : 'text-fg-subtle',
      ].join(' ')}
    >
      {label}
    </div>
    <div className="mt-2 font-mono text-[11px] leading-snug text-fg">{desc}</div>
  </div>
);

export const AutoGridSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const a = t.simulation.autoGrid;

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.simulation.sections.autoGrid} />
      <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-fg-muted">
        {a.desc}
      </p>

      {/* Pipeline */}
      <div className="border border-border bg-bg-elev p-5 sm:p-6">
        <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
          {a.title}
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PipelineBox label={a.inputLabel} desc={a.inputDesc} />
          <ArrowRight
            size={18}
            className="hidden self-center text-fg-subtle sm:block"
            aria-hidden
          />
          <PipelineBox label={a.processLabel} desc={a.processDesc} variant="accent" />
          <ArrowRight
            size={18}
            className="hidden self-center text-fg-subtle sm:block"
            aria-hidden
          />
          <PipelineBox label={a.outputLabel} desc={a.outputDesc} />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.humanError}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg">0%</div>
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.vpError}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg">&lt; 0.1%</div>
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.timeSaved}
          </div>
          <div className="mt-1 font-mono text-base font-bold tabular-nums text-fg">
            {a.timeSavedValue}
          </div>
        </div>
      </div>
    </section>
  );
};
