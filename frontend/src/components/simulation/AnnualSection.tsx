import { useMemo } from 'react';
import { TrendingUp, Sun } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import {
  annualDemandSQL,
  annualRenewablesSQL,
  type AnnualDemandRow,
  type AnnualRenewablesRow,
} from '../../lib/queries';
import { SectionHeader } from '../ui/SectionHeader';
import { LineSeriesChart } from '../charts/LineSeriesChart';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { FUEL_COLORS_HEX } from '../../lib/constants';
import { formatByMode } from '../../utils/decimal';
import { useDecimal } from '../../hooks/useDecimal';

const dayToDate = (day: number): string => {
  const d = new Date(2022, 0, 1);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// 월별 day 시작점 (Jan 1, Feb 1, …)
const MONTH_TICKS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export const AnnualSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const demand = useQuery<AnnualDemandRow>(annualDemandSQL);
  const renewables = useQuery<AnnualRenewablesRow>(annualRenewablesSQL);

  const peakSeries = useMemo(
    () => [
      {
        name: t.profiles.systemDemand,
        color: 'var(--accent)',
        fill: true,
        points: (demand.data ?? []).map((d) => ({ x: d.day, y: d.peak_mw })),
      },
    ],
    [demand.data, t.profiles.systemDemand],
  );

  const renewableSeries = useMemo(() => {
    if (!renewables.data) return [];
    return [
      {
        name: 'solar',
        color: FUEL_COLORS_HEX.solar,
        points: renewables.data.map((d) => ({ x: d.day, y: d.solar })),
      },
      {
        name: 'wind',
        color: FUEL_COLORS_HEX.wind,
        points: renewables.data.map((d) => ({ x: d.day, y: d.wind })),
      },
      {
        name: 'hydro',
        color: FUEL_COLORS_HEX.hydro,
        points: renewables.data.map((d) => ({ x: d.day, y: d.hydro })),
      },
    ];
  }, [renewables.data]);

  const annualStats = useMemo(() => {
    if (!demand.data || demand.data.length === 0) return null;
    const sorted = [...demand.data].sort((a, b) => b.peak_mw - a.peak_mw);
    const peak = sorted[0];
    const low = sorted[sorted.length - 1];
    const totalEnergyGWh = demand.data.reduce((s, d) => s + d.total_mwh, 0) / 1000;
    return { peak, low, totalEnergyGWh };
  }, [demand.data]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.profiles.annualSection} />

      {/* KPI summary */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {t.profiles.annualPeakDay}
          </div>
          {annualStats ? (
            <>
              <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
                {formatByMode(String(annualStats.peak.peak_mw), mode, { grouping: true })} MW
              </div>
              <div className="mt-1 font-mono text-[10px] text-fg-muted">
                Day {String(annualStats.peak.day).padStart(3, '0')} · {dayToDate(annualStats.peak.day)}
              </div>
            </>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {t.profiles.annualMinDay}
          </div>
          {annualStats ? (
            <>
              <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
                {formatByMode(String(annualStats.low.peak_mw), mode, { grouping: true })} MW
              </div>
              <div className="mt-1 font-mono text-[10px] text-fg-muted">
                Day {String(annualStats.low.day).padStart(3, '0')} · {dayToDate(annualStats.low.day)}
              </div>
            </>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
            {t.profiles.annualTotalEnergy}
          </div>
          {annualStats ? (
            <>
              <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
                {formatByMode(String(annualStats.totalEnergyGWh), mode, { grouping: true })} GWh
              </div>
              <div className="mt-1 font-mono text-[10px] text-fg-muted">2022 · 365 days</div>
            </>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      {/* Annual demand chart */}
      <div className="border border-border bg-bg-elev p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp size={14} className="text-fg-subtle" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {t.profiles.annualDemandTitle}
            </span>
          </div>
        </div>
        <div className="h-48 sm:h-56">
          {demand.loading && <Skeleton className="h-full w-full" />}
          {demand.data && (
            <LineSeriesChart
              series={peakSeries}
              xTicks={MONTH_TICKS}
              xLabel={(x) => dayToDate(x).split(' ')[0]}
              yLabel={(y) => `${(y / 1000).toFixed(0)}k`}
            />
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
          {t.profiles.annualDemandCaption}
        </p>
      </div>

      {/* Annual renewables chart */}
      <div className="border border-border bg-bg-elev p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sun size={14} className="text-fg-subtle" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {t.profiles.annualRenewablesTitle}
            </span>
          </div>
        </div>
        <div className="h-48 sm:h-56">
          {renewables.loading && <Skeleton className="h-full w-full" />}
          {renewables.data && (
            <LineSeriesChart
              series={renewableSeries}
              xTicks={MONTH_TICKS}
              xLabel={(x) => dayToDate(x).split(' ')[0]}
              yLabel={(y) => y.toFixed(2)}
              yMax={1}
              showLegend
            />
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
          {t.profiles.annualRenewablesCaption}
        </p>
      </div>
    </section>
  );
};
