import { useMemo } from 'react';
import { Gauge } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import {
  annualRenewablesSQL,
  applicationsThermalCFSQL,
  type AnnualRenewablesRow,
  type ApplicationsThermalCFRow,
} from '../../lib/queries';
import { SectionHeader } from '../ui/SectionHeader';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode } from '../../utils/decimal';
import { FUEL_COLORS_HEX, FUEL_LABELS } from '../../lib/constants';

const FUEL_ORDER = ['nuclear', 'coal', 'lng', 'hydro', 'wind', 'solar'] as const;

export const CapacityFactorSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.cf;
  const annual = useQuery<AnnualRenewablesRow>(annualRenewablesSQL);
  const thermal = useQuery<ApplicationsThermalCFRow>(applicationsThermalCFSQL);

  const cfByFuel = useMemo(() => {
    const map: Record<string, number> = {};
    // Thermal (commitment-based upper bound)
    if (thermal.data) {
      for (const r of thermal.data) {
        map[r.fuel] = r.theoretical_mwh > 0 ? r.energy_mwh / r.theoretical_mwh : 0;
      }
    }
    // Renewables: 365 일평균 CF의 평균
    if (annual.data && annual.data.length > 0) {
      const n = annual.data.length;
      let solar = 0, wind = 0, hydro = 0;
      for (const r of annual.data) {
        solar += r.solar;
        wind += r.wind;
        hydro += r.hydro;
      }
      map.solar = solar / n;
      map.wind = wind / n;
      map.hydro = hydro / n;
    }
    return map;
  }, [thermal.data, annual.data]);

  const ranking = useMemo(() => {
    const items = FUEL_ORDER.map((f) => ({ fuel: f, cf: cfByFuel[f] ?? null })).filter(
      (x): x is { fuel: typeof FUEL_ORDER[number]; cf: number } => x.cf !== null,
    );
    if (items.length === 0) return null;
    const sorted = [...items].sort((a, b) => b.cf - a.cf);
    return { highest: sorted[0], lowest: sorted[sorted.length - 1] };
  }, [cfByFuel]);

  const loading = thermal.loading || annual.loading;

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.capacityFactor} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.highest}
          </div>
          {ranking ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {FUEL_LABELS[ranking.highest.fuel]} ·{' '}
              {formatByMode(String(ranking.highest.cf * 100), mode === 'exact' ? '1' : mode)}%
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.lowest}
          </div>
          {ranking ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {FUEL_LABELS[ranking.lowest.fuel]} ·{' '}
              {formatByMode(String(ranking.lowest.cf * 100), mode === 'exact' ? '1' : mode)}%
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      {/* Horizontal bars */}
      <div className="border border-border bg-bg-elev p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Gauge size={14} className="text-fg-subtle" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {t.applications.sections.capacityFactor}
          </span>
        </div>
        {loading && <Skeleton className="h-32 w-full" />}
        {!loading && (
          <div className="space-y-3">
            {FUEL_ORDER.map((fuel) => {
              const cf = cfByFuel[fuel];
              if (cf === undefined) return null;
              const widthPct = (cf * 100).toFixed(2);
              return (
                <div
                  key={fuel}
                  className="grid grid-cols-[80px_1fr_60px] items-center gap-3"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
                    {FUEL_LABELS[fuel]}
                  </span>
                  <div className="h-2 w-full bg-bg-subtle">
                    <div
                      className="h-full"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: FUEL_COLORS_HEX[fuel],
                      }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-fg">
                    {formatByMode(String(cf * 100), '1')}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
        {a.caption}
      </p>
      <p className="font-mono text-[10px] leading-relaxed text-fg-muted">
        † {a.upperBoundNote}
      </p>
    </section>
  );
};
