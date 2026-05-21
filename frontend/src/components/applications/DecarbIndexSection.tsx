import { useMemo } from 'react';
import { Leaf } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { generationMixSQL, type GenerationMixRow } from '../../lib/queries';
import { decarbShares, type FuelMix } from '../../lib/applications-compute';
import { SectionHeader } from '../ui/SectionHeader';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode } from '../../utils/decimal';
import { FUEL_COLORS_HEX } from '../../lib/constants';

export const DecarbIndexSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.decarb;
  const mix = useQuery<GenerationMixRow>(generationMixSQL);

  const shares = useMemo(() => {
    if (!mix.data) return null;
    const map: Partial<FuelMix> = {};
    for (const row of mix.data) {
      (map as Record<string, string>)[row.fuel] = row.mw;
    }
    const full: FuelMix = {
      coal: map.coal ?? '0',
      lng: map.lng ?? '0',
      nuclear: map.nuclear ?? '0',
      solar: map.solar ?? '0',
      wind: map.wind ?? '0',
      hydro: map.hydro ?? '0',
    };
    return decarbShares(full);
  }, [mix.data]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.decarbIndex} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.renewableShareLabel}
          </div>
          {shares ? (
            <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg">
              {formatByMode(shares.renewablePct, mode === 'exact' ? '1' : mode)}%
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-24" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.cleanShareLabel}
          </div>
          {shares ? (
            <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg">
              {formatByMode(shares.cleanPct, mode === 'exact' ? '1' : mode)}%
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-24" />
          )}
        </div>
      </div>

      {/* 3-segment horizontal bar */}
      <div className="border border-border bg-bg-elev p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <Leaf size={14} className="text-fg-subtle" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {t.applications.sections.decarbIndex}
          </span>
        </div>
        {shares ? (
          <>
            <div className="flex h-6 w-full overflow-hidden border border-border">
              <div
                style={{
                  width: `${shares.renewablePct}%`,
                  backgroundColor: FUEL_COLORS_HEX.solar,
                }}
                title={`${a.renewableLabel}: ${formatByMode(shares.renewablePct, '1')}%`}
              />
              <div
                style={{
                  width: `${(parseFloat(shares.cleanPct) - parseFloat(shares.renewablePct)).toFixed(2)}%`,
                  backgroundColor: FUEL_COLORS_HEX.nuclear,
                }}
                title={`Nuclear share`}
              />
              <div
                style={{
                  width: `${shares.fossilPct}%`,
                  backgroundColor: FUEL_COLORS_HEX.coal,
                }}
                title={`${a.fossilLabel}: ${formatByMode(shares.fossilPct, '1')}%`}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-fg-muted">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-3"
                  style={{ backgroundColor: FUEL_COLORS_HEX.solar }}
                />
                {a.renewableLabel} {formatByMode(shares.renewablePct, '1')}%
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-3"
                  style={{ backgroundColor: FUEL_COLORS_HEX.nuclear }}
                />
                Nuclear {formatByMode((parseFloat(shares.cleanPct) - parseFloat(shares.renewablePct)).toFixed(4), '1')}%
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-3"
                  style={{ backgroundColor: FUEL_COLORS_HEX.coal }}
                />
                {a.fossilLabel} {formatByMode(shares.fossilPct, '1')}%
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="h-6 w-full" />
        )}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
        {a.caption}
      </p>
    </section>
  );
};
