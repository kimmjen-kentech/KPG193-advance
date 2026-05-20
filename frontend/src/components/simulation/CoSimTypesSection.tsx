import { useI18n } from '../../hooks/useI18n';
import { SectionHeader } from '../ui/SectionHeader';

interface TypeCardProps {
  name: string;
  partition: string;
  interfaceText: string;
  validationCase: string;
  partitionLabel: string;
  interfaceLabel: string;
  caseLabel: string;
  highlight?: string;
  variant?: 'plain' | 'accent';
}

const TypeCard = ({
  name,
  partition,
  interfaceText,
  validationCase,
  partitionLabel,
  interfaceLabel,
  caseLabel,
  highlight,
  variant = 'plain',
}: TypeCardProps) => (
  <div
    className={[
      'flex flex-col border bg-bg-elev',
      variant === 'accent' ? 'border-accent' : 'border-border',
    ].join(' ')}
  >
    <div
      className={[
        'flex items-center justify-between border-b px-5 py-3',
        variant === 'accent' ? 'border-accent bg-accent-bg' : 'border-border bg-bg-subtle',
      ].join(' ')}
    >
      <span
        className={[
          'font-mono text-[12px] font-bold uppercase tracking-[0.2em]',
          variant === 'accent' ? 'text-accent' : 'text-fg',
        ].join(' ')}
      >
        {name}
      </span>
      {highlight && (
        <span className="bg-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-accent-fg">
          {highlight}
        </span>
      )}
    </div>
    <dl className="divide-y divide-border">
      <div className="px-5 py-3">
        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
          {partitionLabel}
        </dt>
        <dd className="mt-1 font-mono text-[11px] leading-snug text-fg">{partition}</dd>
      </div>
      <div className="px-5 py-3">
        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
          {interfaceLabel}
        </dt>
        <dd className="mt-1 font-mono text-[11px] leading-snug text-fg-muted">{interfaceText}</dd>
      </div>
      <div className="px-5 py-3">
        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
          {caseLabel}
        </dt>
        <dd className="mt-1 font-mono text-[11px] leading-snug text-fg-muted">{validationCase}</dd>
      </div>
    </dl>
  </div>
);

export const CoSimTypesSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const c = t.simulation.coSimTypes;

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.simulation.sections.coSimTypes} />
      <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-fg-muted">
        {c.intro}
      </p>
      <div className="border border-dashed border-accent/40 bg-accent-bg/30 px-4 py-3 font-mono text-[10px] text-fg-muted">
        {c.itm}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <TypeCard
          name={c.emtEmt.name}
          partition={c.emtEmt.partition}
          interfaceText={c.emtEmt.interface}
          validationCase={c.emtEmt.case}
          partitionLabel={c.partitionLabel}
          interfaceLabel={c.interfaceLabel}
          caseLabel={c.caseLabel}
        />
        <TypeCard
          name={c.rmsRms.name}
          partition={c.rmsRms.partition}
          interfaceText={c.rmsRms.interface}
          validationCase={c.rmsRms.case}
          partitionLabel={c.partitionLabel}
          interfaceLabel={c.interfaceLabel}
          caseLabel={c.caseLabel}
        />
        <TypeCard
          name={c.rmsEmt.name}
          partition={c.rmsEmt.partition}
          interfaceText={c.rmsEmt.interface}
          validationCase={c.rmsEmt.case}
          partitionLabel={c.partitionLabel}
          interfaceLabel={c.interfaceLabel}
          caseLabel={c.caseLabel}
          highlight={c.rmsEmt.thisWork}
          variant="accent"
        />
      </div>
    </section>
  );
};
