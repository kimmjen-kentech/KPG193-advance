import { useMemo, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { SectionHeader } from '../ui/SectionHeader';
import { LineSeriesChart } from '../charts/LineSeriesChart';

interface Scenario {
  tripMw: number;
  color: string;
  rocofHzPerS: number;
  nadirHz: number;
  steadyOffset: number; // Hz droop from 60
}

// Physics-motivated parameters. Linear ROCOF + first-order governor recovery.
const SCENARIOS: Scenario[] = [
  { tripMw: 50, color: '#22c55e', rocofHzPerS: 0.04, nadirHz: 59.92, steadyOffset: -0.005 },
  { tripMw: 270, color: '#3b82f6', rocofHzPerS: 0.18, nadirHz: 59.64, steadyOffset: -0.02 },
  { tripMw: 500, color: '#ef4444', rocofHzPerS: 0.32, nadirHz: 59.36, steadyOffset: -0.038 },
];

const TRIP_TIME = 20;
const SIM_LEN = 60;
const STEP = 0.1;
const TAU = 3.5; // governor recovery time constant (s)

// 트립량(MW)으로부터 ROCOF·Nadir·Steady-state offset 산출
// 기준점(50/270/500 MW)에 대한 선형 보간 — KPG-193 17,600 MW 기반
const paramsFromTripMw = (tripMw: number): Omit<Scenario, 'color'> => {
  // ROCOF ≈ trip / (2·H·S_base), H≈4s, S_base=17,600 MW
  // 0.04 Hz/s per 50 MW (linear)
  const rocof = parseFloat((tripMw * 0.00064).toFixed(4));
  // Governor steady-state droop: -0.02 Hz per 270 MW
  const steady = parseFloat((-tripMw * 0.0000741).toFixed(4));
  // Nadir: linear approx 60 - 0.075% * tripMw, bounded
  const nadirRaw = 60 - tripMw * 0.00072;
  const nadirHz = parseFloat(Math.max(58.0, nadirRaw).toFixed(4));
  return { tripMw, rocofHzPerS: rocof, nadirHz, steadyOffset: steady };
};

const buildSeries = (s: Pick<Scenario, 'tripMw' | 'rocofHzPerS' | 'nadirHz' | 'steadyOffset'>) => {
  const pts: { x: number; y: number }[] = [];
  for (let t = 0; t <= SIM_LEN; t += STEP) {
    let f: number;
    if (t < TRIP_TIME) {
      f = 60.0;
    } else {
      const dt = t - TRIP_TIME;
      // Phase 1: linear drop (ROCOF) up to nadir
      const dropDuration = (60 - s.nadirHz) / s.rocofHzPerS;
      if (dt <= dropDuration) {
        f = 60.0 - s.rocofHzPerS * dt;
      } else {
        // Phase 2: governor first-order recovery to (60 + steadyOffset)
        const target = 60 + s.steadyOffset;
        const initial = s.nadirHz;
        f = initial + (target - initial) * (1 - Math.exp(-(dt - dropDuration) / TAU));
      }
    }
    pts.push({ x: t, y: parseFloat(f.toFixed(4)) });
  }
  return pts;
};

export const ScenarioSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const s = t.simulation.scenarios;
  const [liveTripMw, setLiveTripMw] = useState(270);

  const series = useMemo(
    () =>
      SCENARIOS.map((sc) => ({
        name: `${sc.tripMw} MW`,
        color: sc.color,
        points: buildSeries(sc),
      })),
    [],
  );

  const liveParams = useMemo(() => paramsFromTripMw(liveTripMw), [liveTripMw]);
  const liveSeries = useMemo(
    () => [
      {
        name: `${liveTripMw} MW`,
        color: 'var(--accent)',
        fill: true,
        points: buildSeries(liveParams),
      },
    ],
    [liveParams, liveTripMw],
  );

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.simulation.sections.scenarios} />
      <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-fg-muted">
        {s.intro}
      </p>

      <div className="border border-border bg-bg-elev p-4 sm:p-6">
        <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
          {s.title}
        </div>
        <div className="h-56 sm:h-64">
          <LineSeriesChart
            series={series}
            yMin={59.2}
            yMax={60.1}
            xTicks={[0, 10, 20, 30, 40, 50, 60]}
            xLabel={(x) => `${x}s`}
            yLabel={(y) => y.toFixed(2)}
            vLine={{ x: TRIP_TIME, label: 'Trip' }}
            showLegend
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
          {s.caption}
        </p>
      </div>

      {/* Scenario KPI table */}
      <div className="overflow-hidden border border-border">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr] bg-bg-subtle">
          <div className="border-b border-border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {s.tripLabel}
          </div>
          <div className="border-b border-l border-border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {s.mwLabel}
          </div>
          <div className="border-b border-l border-border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {s.nadirLabel}
          </div>
          <div className="border-b border-l border-border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            {s.rocofLabel}
          </div>
        </div>
        {SCENARIOS.map((sc, i) => (
          <div
            key={sc.tripMw}
            className={[
              'grid grid-cols-[80px_1fr_1fr_1fr] bg-bg-elev',
              i < SCENARIOS.length - 1 ? 'border-b border-border' : '',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 px-4 py-3 font-mono text-[11px] text-fg">
              <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: sc.color }} />
              {String.fromCharCode(65 + i)}
            </div>
            <div className="border-l border-border px-4 py-3 font-mono text-[11px] tabular-nums text-fg">
              {sc.tripMw}
            </div>
            <div className="border-l border-border px-4 py-3 font-mono text-[11px] tabular-nums text-fg">
              {sc.nadirHz.toFixed(2)} Hz
            </div>
            <div className="border-l border-border px-4 py-3 font-mono text-[11px] tabular-nums text-fg">
              -{sc.rocofHzPerS.toFixed(2)} Hz/s
            </div>
          </div>
        ))}
      </div>

      {/* Interactive trip slider — live recomputation */}
      <div className="border border-accent bg-bg-elev p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-accent-fg">
              Interactive
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              Trip = {liveTripMw} MW
            </span>
          </div>
          <div className="flex gap-3 font-mono text-[10px] tabular-nums text-fg-muted">
            <span>Nadir <span className="text-fg">{liveParams.nadirHz.toFixed(2)} Hz</span></span>
            <span>ROCOF <span className="text-fg">-{liveParams.rocofHzPerS.toFixed(3)} Hz/s</span></span>
          </div>
        </div>
        <input
          type="range"
          min={10}
          max={1000}
          step={10}
          value={liveTripMw}
          onChange={(e) => setLiveTripMw(parseInt(e.target.value))}
          className="mb-4 w-full accent-[var(--accent)]"
          aria-label="Trip size in MW"
        />
        <div className="h-48 sm:h-56">
          <LineSeriesChart
            series={liveSeries}
            yMin={Math.min(58.5, liveParams.nadirHz - 0.1)}
            yMax={60.1}
            xTicks={[0, 10, 20, 30, 40, 50, 60]}
            xLabel={(x) => `${x}s`}
            yLabel={(y) => y.toFixed(2)}
            vLine={{ x: TRIP_TIME, label: 'Trip' }}
          />
        </div>
      </div>
    </section>
  );
};
