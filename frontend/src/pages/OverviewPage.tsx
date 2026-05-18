import { useMemo } from 'react';
import { Activity, Database, GitBranch, Info, Network, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KpiCard } from '../components/ui/KpiCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FUEL_COLORS_HEX, FUEL_LABELS } from '../lib/constants';
import { D, ratio, sum, toRounded, formatByMode } from '../utils/decimal';
import { useQuery } from '../hooks/useQuery';
import { Skeleton } from '../components/ui/Skeleton';
import { useI18n } from '../hooks/useI18n';
import { useDecimal } from '../hooks/useDecimal';
import {
  overviewKpiSQL,
  generationMixSQL,
  networkBusesSQL,
  networkBranchesSQL,
  type OverviewKpi,
  type GenerationMixRow,
  type NetworkBus,
  type NetworkBranch,
} from '../lib/queries';

const MIX_FUEL_ORDER = ['coal', 'lng', 'nuclear', 'solar', 'wind', 'hydro'] as const;

const Sparkline = () => {
  const points = Array.from({ length: 64 }, (_, i) => {
    const x = (i / 63) * 100;
    const y = 28 - (Math.sin(i / 4) * 10 + Math.sin(i / 9) * 6 + 14);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-20 w-full">
      <polyline
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.6"
        points={points.join(' ')}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const TopologyCard = () => {
  const { t } = useI18n();
  const buses = useQuery<NetworkBus>(networkBusesSQL);
  const branches = useQuery<NetworkBranch>(networkBranchesSQL);

  // 한반도 영역 → SVG viewBox (0-100, 0-100) 정규화
  const proj = useMemo(() => {
    if (!buses.data || buses.data.length === 0) return null;
    const lats = buses.data.map((b) => b.lat);
    const lngs = buses.data.map((b) => b.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 0.2;
    return (lat: number, lng: number): [number, number] => [
      ((lng - minLng) / (maxLng - minLng)) * (100 - padding * 2) + padding,
      (1 - (lat - minLat) / (maxLat - minLat)) * (100 - padding * 2) + padding,
    ];
  }, [buses.data]);

  return (
    <Link
      to="/network"
      className="group relative block aspect-square border border-border bg-bg-subtle p-4 transition-colors hover:border-fg"
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
          {t.overview.topologyTitle}
        </span>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        {proj && buses.data ? (
          <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            {branches.data?.map((br, i) => {
              const [x1, y1] = proj(br.from_lat, br.from_lng);
              const [x2, y2] = proj(br.to_lat, br.to_lng);
              const opacity = br.kv >= 700 ? 0.7 : br.kv >= 300 ? 0.35 : 0.15;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth={br.kv >= 700 ? 0.25 : 0.15}
                  opacity={opacity}
                  className="text-fg"
                />
              );
            })}
            {buses.data.map((b) => {
              const [x, y] = proj(b.lat, b.lng);
              const r = b.kv >= 700 ? 0.7 : b.kv >= 300 ? 0.45 : 0.3;
              const isAccent = b.kv >= 700;
              return (
                <circle
                  key={b.id}
                  cx={x}
                  cy={y}
                  r={r}
                  className={isAccent ? 'fill-accent' : 'fill-fg'}
                  opacity={isAccent ? 0.95 : 0.55}
                />
              );
            })}
          </svg>
        ) : (
          <Skeleton className="h-2/3 w-2/3" />
        )}
      </div>

      <div className="absolute bottom-5 left-5 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
        {t.overview.nodeDensity}
      </div>

      <div className="absolute bottom-5 right-5 z-10 text-right">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
          {t.overview.frequency}
        </div>
        <div className="font-mono text-sm font-bold text-accent tabular-nums">60.00 Hz</div>
      </div>
    </Link>
  );
};

const Hero = () => {
  const { t } = useI18n();
  return (
    <section className="grid items-center gap-12 lg:grid-cols-2">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center bg-fg text-bg">
            <Zap size={14} strokeWidth={1.6} />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {t.overview.label}
          </span>
        </div>

        <h1 className="font-serif text-5xl italic leading-[0.95] tracking-tight text-fg sm:text-6xl lg:text-7xl">
          {t.overview.title[0]}<br />{t.overview.title[1]}<br />{t.overview.title[2]}
        </h1>

        <p className="max-w-xl border-l-2 border-fg pl-5 font-serif text-lg italic leading-relaxed text-fg-muted">
          {t.overview.tagline}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/network"
            className="inline-flex items-center gap-3 bg-fg px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-90"
          >
            <Activity size={14} strokeWidth={1.6} />
            {t.overview.cta.monitor}
          </Link>
          <Link
            to="/methodology"
            className="inline-flex items-center gap-3 border border-fg px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-bg"
          >
            <Info size={14} strokeWidth={1.6} />
            {t.overview.cta.methodology}
          </Link>
        </div>
      </div>

      <TopologyCard />
    </section>
  );
};

const Pending = () => <Skeleton className="h-5 w-16" />;

const ErrorBanner = ({ message }: { message: string }) => {
  const { t } = useI18n();
  return (
    <div className="border border-border bg-bg-elev p-4 font-mono text-xs text-fg-muted">
      {t.common.dataLoadError}: {message}
    </div>
  );
};

const KpiBar = ({ kpi }: { kpi: OverviewKpi | null }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const renewableMw = kpi
    ? sum([kpi.solar_mw, kpi.wind_mw, kpi.hydro_mw])
    : null;
  const totalMw = kpi
    ? sum([kpi.solar_mw, kpi.wind_mw, kpi.hydro_mw, kpi.thermal_mw])
    : null;
  const r = renewableMw && totalMw ? ratio(renewableMw, totalMw) : null;
  const pctValue = r ? D(r).mul(100) : null;
  const renewablePct = pctValue
    ? mode === 'exact'
      ? toRounded(pctValue, 2)
      : toRounded(pctValue, Math.max(1, Number(mode)))
    : null;

  return (
    <section className="space-y-6">
      <SectionHeader number="01" title={t.overview.sections.snapshot} />
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-6 lg:overflow-visible">
        <KpiCard label={t.overview.kpi.buses} value={kpi?.bus_count ?? <Pending />} icon={Network} />
        <KpiCard label={t.overview.kpi.generators} value={kpi?.gen_count ?? <Pending />} icon={Zap} />
        <KpiCard label={t.overview.kpi.ac} value={kpi?.branch_count ?? <Pending />} icon={GitBranch} />
        <KpiCard label={t.overview.kpi.hvdc} value={kpi?.dc_count ?? <Pending />} icon={GitBranch} />
        <KpiCard label={t.overview.kpi.profile} value="8,760" unit="h" icon={Activity} />
        <KpiCard
          label={t.overview.kpi.renewable}
          value={renewablePct ?? <Pending />}
          unit={renewablePct ? '%' : undefined}
          icon={Database}
        />
      </div>
    </section>
  );
};

const GenerationMix = ({ rows }: { rows: GenerationMixRow[] | null }) => {
  const { t } = useI18n();
  const { mode } = useDecimal();
  const mixMap = rows ? Object.fromEntries(rows.map((r) => [r.fuel, r.mw])) : null;
  const totalMw = mixMap ? sum(Object.values(mixMap)) : null;

  return (
    <section className="space-y-6">
      <SectionHeader number="02" title={t.overview.sections.mix} />
      <div className="space-y-3 border border-border bg-bg-elev p-6">
        {MIX_FUEL_ORDER.map((key) => {
          const mw = mixMap?.[key];
          const r = mw && totalMw ? ratio(mw, totalMw) : null;
          const widthPct = r ? toRounded(D(r).mul(100), 2) : '0';
          const pctLabel = r ? toRounded(D(r).mul(100), 1) : null;
          return (
            <div
              key={key}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-2 sm:grid-cols-[100px_1fr_120px_60px] sm:gap-3"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
                {FUEL_LABELS[key] ?? key}
              </span>
              <div className="h-2 w-full bg-bg-subtle">
                <div
                  className="h-full transition-[width] duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: FUEL_COLORS_HEX[key],
                  }}
                />
              </div>
              <span className="text-right font-mono text-[11px] tabular-nums text-fg sm:text-xs">
                {mw ? formatByMode(mw, mode, { grouping: true, suffix: ' MW' }) : <Pending />}
              </span>
              <span className="col-span-3 -mt-1 hidden text-right font-mono text-[11px] tabular-nums text-fg-subtle sm:col-span-1 sm:mt-0 sm:inline">
                {pctLabel ? `${pctLabel}%` : <Skeleton className="h-3 w-8" />}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TemporalStrip = () => {
  const { t } = useI18n();
  return (
    <section className="space-y-6">
      <SectionHeader number="03" title={t.overview.sections.coverage} />
      <div className="border border-border bg-bg-elev p-6">
        <Sparkline />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
          {t.overview.coverageCaption}
        </p>
      </div>
    </section>
  );
};

export const OverviewPage = () => {
  const kpi = useQuery<OverviewKpi>(overviewKpiSQL);
  const mix = useQuery<GenerationMixRow>(generationMixSQL);

  return (
    <div className="space-y-20">
      <Hero />
      {kpi.error && <ErrorBanner message={kpi.error.message} />}
      <KpiBar kpi={kpi.data?.[0] ?? null} />
      <GenerationMix rows={mix.data} />
      <TemporalStrip />
    </div>
  );
};
