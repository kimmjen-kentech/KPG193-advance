import { Activity, Database, GitBranch, Info, Network, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KpiCard } from '../components/ui/KpiCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FUEL_COLORS_HEX, FUEL_LABELS } from '../lib/constants';
import { D, ratio, sum, toDisplay, toRounded } from '../utils/decimal';

// TODO(data): Replace with DuckDB-WASM query when Parquet ready.
const FUEL_MIX_MW: Record<string, string> = {
  coal: '23450.5',
  lng: '38120.25',
  nuclear: '24560.0',
  solar: '21800.75',
  wind: '4280.6',
  hydro: '6520.4',
};

const FUEL_ORDER = ['coal', 'lng', 'nuclear', 'solar', 'wind', 'hydro'] as const;
const RENEWABLE = ['solar', 'wind', 'hydro'] as const;

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

const TopologyCard = () => (
  <div className="relative aspect-square border border-border bg-bg-subtle p-4">
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    />
    <div className="absolute left-5 top-5 flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
        Topology_Buffer
      </span>
    </div>

    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
      <Network size={96} strokeWidth={0.8} className="opacity-30" />
      <div className="space-y-1 text-center">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
          Node_Density_Mapped
        </div>
        <p className="font-mono text-[10px] uppercase leading-relaxed text-fg-subtle">
          193 nodes // 5 clusters // isolated peninsula
        </p>
      </div>
    </div>

    <div className="absolute bottom-5 right-5 text-right">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
        Frequency
      </div>
      <div className="font-mono text-sm font-bold text-accent tabular-nums">60.00 Hz</div>
    </div>
  </div>
);

const Hero = () => (
  <section className="grid items-center gap-12 lg:grid-cols-2">
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center bg-fg text-bg">
          <Zap size={14} strokeWidth={1.6} />
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
          Kernel_Core_Access
        </span>
      </div>

      <h1 className="font-serif text-6xl italic leading-[0.95] tracking-tight text-fg sm:text-7xl">
        Synthetic<br />Korean Grid<br />Testbed.
      </h1>

      <p className="max-w-xl border-l-2 border-fg pl-5 font-serif text-lg italic leading-relaxed text-fg-muted">
        A high-fidelity research framework for the Korean power grid, engineered to simulate deep
        decarbonization scenarios and modern grid stability.
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          to="/network"
          className="inline-flex items-center gap-3 bg-fg px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-90"
        >
          <Activity size={14} strokeWidth={1.6} />
          Initialize Monitor
        </Link>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-3 border border-fg px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-bg"
        >
          <Info size={14} strokeWidth={1.6} />
          Methodology
        </Link>
      </div>
    </div>

    <TopologyCard />
  </section>
);

const KpiBar = () => {
  const totalMw = sum(Object.values(FUEL_MIX_MW));
  const renewableMw = sum(RENEWABLE.map((k) => FUEL_MIX_MW[k]));
  const renewablePct = ratio(renewableMw, totalMw);
  const pctValue = renewablePct ? toRounded(D(renewablePct).mul(100), 1) : '0.0';

  // TODO(data): Replace mock KPI values with DuckDB-WASM query when Parquet ready.
  return (
    <section className="space-y-6">
      <SectionHeader number="01" title="System Snapshot" />
      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-6 lg:overflow-visible">
        <KpiCard label="Buses" value="193" icon={Network} />
        <KpiCard label="Generators" value="122" icon={Zap} />
        <KpiCard label="AC Branches" value="358" icon={GitBranch} />
        <KpiCard label="HVDC Links" value="1" icon={GitBranch} />
        <KpiCard label="Profile" value="8,760" unit="h" icon={Activity} />
        <KpiCard label="Renewable" value={pctValue} unit="%" icon={Database} />
      </div>
    </section>
  );
};

const GenerationMix = () => {
  const totalMw = sum(Object.values(FUEL_MIX_MW));
  return (
    <section className="space-y-6">
      <SectionHeader number="02" title="Generation Mix" />
      <div className="space-y-3 border border-border bg-bg-elev p-6">
        {FUEL_ORDER.map((key) => {
          const mw = FUEL_MIX_MW[key];
          const r = ratio(mw, totalMw);
          const widthPct = r ? toRounded(D(r).mul(100), 2) : '0';
          const pctLabel = r ? toRounded(D(r).mul(100), 1) : '0.0';
          return (
            <div key={key} className="grid grid-cols-[100px_1fr_120px_60px] items-center gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
                {FUEL_LABELS[key] ?? key}
              </span>
              <div className="h-2 w-full bg-bg-subtle">
                <div
                  className="h-full"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: FUEL_COLORS_HEX[key],
                  }}
                />
              </div>
              <span className="text-right font-mono text-xs tabular-nums text-fg">
                {toDisplay(mw, { grouping: true, suffix: ' MW' })}
              </span>
              <span className="text-right font-mono text-[11px] tabular-nums text-fg-subtle">
                {pctLabel}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TemporalStrip = () => (
  <section className="space-y-6">
    <SectionHeader number="03" title="Temporal Coverage" />
    <div className="border border-border bg-bg-elev p-6">
      <Sparkline />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        Hourly demand · 365 days · 8,760 hours
      </p>
    </div>
  </section>
);

export const OverviewPage = () => (
  <div className="space-y-20">
    <Hero />
    <KpiBar />
    <GenerationMix />
    <TemporalStrip />
  </div>
);
