import { useMemo } from 'react';
import { Sun } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import {
  applicationsRenewablePotentialSQL,
  type ApplicationsRenewablePotentialRow,
} from '../../lib/queries';
import { SectionHeader } from '../ui/SectionHeader';
import { LineSeriesChart } from '../charts/LineSeriesChart';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode } from '../../utils/decimal';
import { FUEL_COLORS_HEX } from '../../lib/constants';

const dayToDate = (day: number): string => {
  const d = new Date(2022, 0, 1);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface Props {
  number: string;
  day: number;
  onDayChange: (d: number) => void;
}

export const RenewablePotentialSection = ({ number, day, onDayChange }: Props) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.potential;
  const potential = useQuery<ApplicationsRenewablePotentialRow>(
    applicationsRenewablePotentialSQL(day),
  );

  const series = useMemo(() => {
    if (!potential.data) return [];
    return [
      {
        name: 'solar',
        color: FUEL_COLORS_HEX.solar,
        fill: true,
        points: potential.data.map((d) => ({ x: d.hour, y: d.solar_mw })),
      },
      {
        name: 'wind',
        color: FUEL_COLORS_HEX.wind,
        fill: true,
        points: potential.data.map((d) => ({ x: d.hour, y: d.wind_mw })),
      },
      {
        name: 'hydro',
        color: FUEL_COLORS_HEX.hydro,
        fill: true,
        points: potential.data.map((d) => ({ x: d.hour, y: d.hydro_mw })),
      },
    ];
  }, [potential.data]);

  const stats = useMemo(() => {
    if (!potential.data || potential.data.length === 0) return null;
    let peak = 0;
    let totalMwh = 0;
    for (const row of potential.data) {
      const t = row.solar_mw + row.wind_mw + row.hydro_mw;
      if (t > peak) peak = t;
      totalMwh += t; // hourly MW × 1h = MWh
    }
    return { peakMw: peak.toFixed(2), dailyEnergyMwh: totalMwh.toFixed(2) };
  }, [potential.data]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.renewablePotential} />

      {/* Day selector */}
      <div className="flex flex-wrap items-center gap-3 border border-border bg-bg-elev p-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {a.daySelector}
        </span>
        <input
          type="range"
          min={1}
          max={365}
          value={day}
          onChange={(e) => onDayChange(parseInt(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
          aria-label="Day selector"
        />
        <span className="font-mono text-xs tabular-nums text-fg">
          {String(day).padStart(3, '0')} · {dayToDate(day)}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.peakMw}
          </div>
          {stats ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(stats.peakMw, mode === 'exact' ? '1' : mode, { grouping: true })} MW
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.dailyEnergy}
          </div>
          {stats ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(stats.dailyEnergyMwh, mode === 'exact' ? '1' : mode, { grouping: true })} MWh
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="border border-border bg-bg-elev p-4 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <Sun size={14} className="text-fg-subtle" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {t.applications.sections.renewablePotential}
          </span>
        </div>
        <div className="h-48 sm:h-56">
          {potential.loading && <Skeleton className="h-full w-full" />}
          {potential.data && (
            <LineSeriesChart
              series={series}
              xTicks={[0, 6, 12, 18, 24]}
              xLabel={(x) => `${x}h`}
              yLabel={(y) => `${(y / 1000).toFixed(1)}k`}
              showLegend
            />
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
          {a.caption}
        </p>
      </div>
    </section>
  );
};
