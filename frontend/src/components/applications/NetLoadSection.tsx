import { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import {
  applicationsNetLoadSQL,
  type ApplicationsNetLoadRow,
} from '../../lib/queries';
import { SectionHeader } from '../ui/SectionHeader';
import { LineSeriesChart } from '../charts/LineSeriesChart';
import { Skeleton } from '../ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { useDecimal } from '../../hooks/useDecimal';
import { formatByMode } from '../../utils/decimal';

interface Props {
  number: string;
  day: number;
}

export const NetLoadSection = ({ number, day }: Props) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const a = t.applications.netLoad;
  const netLoad = useQuery<ApplicationsNetLoadRow>(applicationsNetLoadSQL(day));

  const series = useMemo(() => {
    if (!netLoad.data) return [];
    return [
      {
        name: a.demandLabel,
        color: 'var(--fg-subtle)',
        points: netLoad.data.map((d) => ({ x: d.hour, y: d.demand_mw })),
      },
      {
        name: a.netLabel,
        color: 'var(--accent)',
        fill: true,
        points: netLoad.data.map((d) => ({ x: d.hour, y: d.net_mw })),
      },
    ];
  }, [netLoad.data, a]);

  const stats = useMemo(() => {
    if (!netLoad.data || netLoad.data.length === 0) return null;
    let peakNet = -Infinity;
    let minNet = Infinity;
    for (const r of netLoad.data) {
      if (r.net_mw > peakNet) peakNet = r.net_mw;
      if (r.net_mw < minNet) minNet = r.net_mw;
    }
    return {
      peakNet: peakNet.toFixed(2),
      spread: (peakNet - minNet).toFixed(2),
    };
  }, [netLoad.data]);

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.applications.sections.netLoad} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.peakNet}
          </div>
          {stats ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(stats.peakNet, mode === 'exact' ? '1' : mode, { grouping: true })} MW
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
        <div className="bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {a.spread}
          </div>
          {stats ? (
            <div className="mt-1 font-mono text-xl font-bold tabular-nums text-fg">
              {formatByMode(stats.spread, mode === 'exact' ? '1' : mode, { grouping: true })} MW
            </div>
          ) : (
            <Skeleton className="mt-1 h-7 w-32" />
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="border border-border bg-bg-elev p-4 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <Activity size={14} className="text-fg-subtle" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {t.applications.sections.netLoad}
          </span>
        </div>
        <div className="h-48 sm:h-56">
          {netLoad.loading && <Skeleton className="h-full w-full" />}
          {netLoad.data && (
            <LineSeriesChart
              series={series}
              xTicks={[0, 6, 12, 18, 24]}
              xLabel={(x) => `${x}h`}
              yLabel={(y) => `${(y / 1000).toFixed(0)}k`}
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
