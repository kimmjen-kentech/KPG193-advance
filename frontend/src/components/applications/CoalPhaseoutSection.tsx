import { useMemo, useState } from 'react';
import { Flame } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { generationMixSQL, type GenerationMixRow } from '../../lib/queries';
import { coalPhaseoutImpact } from '../../lib/applications-compute';
import { SectionHeader } from '../ui/SectionHeader';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode } from '../../utils/decimal';
import { FUEL_COLORS_HEX } from '../../lib/constants';
import { EMISSION_FACTORS_TCO2_PER_MWH, COAL_ASSUMED_CF } from './constants';

export const CoalPhaseoutSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.phaseout;
  const mix = useQuery<GenerationMixRow>(generationMixSQL);

  const [phaseoutPct, setPhaseoutPct] = useState(50);

  const coalMw = useMemo(() => {
    if (!mix.data) return null;
    return mix.data.find((r) => r.fuel === 'coal')?.mw ?? '0';
  }, [mix.data]);

  const totalFirmMw = useMemo(() => {
    if (!mix.data) return null;
    const firm = mix.data
      .filter((r) => r.fuel === 'coal' || r.fuel === 'lng' || r.fuel === 'nuclear')
      .reduce((s, r) => s + parseFloat(r.mw), 0);
    return firm;
  }, [mix.data]);

  const impact = useMemo(() => {
    if (!coalMw) return null;
    return coalPhaseoutImpact({
      coalCapacityMw: coalMw,
      phaseoutPct,
      emissionFactor: EMISSION_FACTORS_TCO2_PER_MWH.coal,
      assumedCf: COAL_ASSUMED_CF,
    });
  }, [coalMw, phaseoutPct]);

  const remainingFirmAfter = useMemo(() => {
    if (totalFirmMw === null || !impact) return null;
    return (totalFirmMw - parseFloat(impact.removedCoalMw)).toFixed(2);
  }, [totalFirmMw, impact]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.coalPhaseout} />

      {/* Slider */}
      <div className="border border-accent bg-bg-elev p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Flame size={14} style={{ color: FUEL_COLORS_HEX.coal }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {a.sliderLabel}
            </span>
            <span className="bg-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-accent-fg">
              {a.estimationBadge}
            </span>
          </div>
          <span className="font-mono text-base font-bold tabular-nums text-fg">
            {phaseoutPct}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={phaseoutPct}
          onChange={(e) => setPhaseoutPct(parseInt(e.target.value))}
          className="w-full accent-[var(--accent)]"
          aria-label="Coal phaseout percentage"
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.remainingFirm}
          </div>
          {remainingFirmAfter !== null ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(remainingFirmAfter, mode === 'exact' ? '1' : mode, { grouping: true })} MW
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.co2Avoided}
          </div>
          {impact ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(impact.co2AvoidedMt, mode === 'exact' ? '2' : mode)} Mt
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
        {a.caption}
      </p>
      <p className="font-mono text-[10px] leading-relaxed text-fg-muted">
        † {a.sourceFootnote}
      </p>
    </section>
  );
};
