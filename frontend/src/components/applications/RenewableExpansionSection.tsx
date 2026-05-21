import { useMemo, useState } from 'react';
import { Wind } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import {
  overviewKpiSQL,
  annualRenewablesSQL,
  type OverviewKpi,
  type AnnualRenewablesRow,
} from '../../lib/queries';
import { expansionYield } from '../../lib/applications-compute';
import { SectionHeader } from '../ui/SectionHeader';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode, D, sum } from '../../utils/decimal';

export const RenewableExpansionSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.expansion;
  const kpi = useQuery<OverviewKpi>(overviewKpiSQL);
  const annual = useQuery<AnnualRenewablesRow>(annualRenewablesSQL);

  const [multiplier, setMultiplier] = useState(2);

  const reCapacityMw = useMemo(() => {
    const k = kpi.data?.[0];
    if (!k) return null;
    return sum([k.solar_mw, k.wind_mw, k.hydro_mw]).toFixed();
  }, [kpi.data]);

  // 일평균 CF의 단순 평균 (365일)
  const annualCfAvg = useMemo(() => {
    if (!annual.data || annual.data.length === 0) return null;
    const total = annual.data.reduce(
      (s, r) => s + (r.solar + r.wind + r.hydro) / 3,
      0,
    );
    return (total / annual.data.length).toFixed(6);
  }, [annual.data]);

  const baseline = useMemo(() => {
    if (!reCapacityMw || !annualCfAvg) return null;
    return expansionYield({ capacityMw: reCapacityMw, multiplier: 1, annualCfAvg });
  }, [reCapacityMw, annualCfAvg]);

  const projected = useMemo(() => {
    if (!reCapacityMw || !annualCfAvg) return null;
    return expansionYield({ capacityMw: reCapacityMw, multiplier, annualCfAvg });
  }, [reCapacityMw, annualCfAvg, multiplier]);

  const deltaTwh = useMemo(() => {
    if (!baseline || !projected) return null;
    return D(projected.annualEnergyTwh).minus(baseline.annualEnergyTwh).toFixed();
  }, [baseline, projected]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.renewableExpansion} />

      {/* Slider */}
      <div className="border border-accent bg-bg-elev p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Wind size={14} className="text-fg-subtle" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {a.sliderLabel}
            </span>
          </div>
          <span className="font-mono text-base font-bold tabular-nums text-fg">{multiplier}×</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={multiplier}
          onChange={(e) => setMultiplier(parseFloat(e.target.value))}
          className="w-full accent-[var(--accent)]"
          aria-label="Renewable expansion multiplier"
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.projectedShare}
          </div>
          {projected ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(projected.annualEnergyTwh, mode === 'exact' ? '2' : mode)} TWh
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.deltaTwh}
          </div>
          {deltaTwh !== null ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              +{formatByMode(deltaTwh, mode === 'exact' ? '2' : mode)} TWh
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
        {a.caption}
      </p>
    </section>
  );
};
