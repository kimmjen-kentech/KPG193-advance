import { SectionHeader } from '../components/ui/SectionHeader';
import { LineSeriesChart } from '../components/charts/LineSeriesChart';
import { useI18n } from '../hooks/useI18n';
import { ModelingSection } from '../components/simulation/ModelingSection';
import { AutoGridSection } from '../components/simulation/AutoGridSection';
import { CoSimTypesSection } from '../components/simulation/CoSimTypesSection';
import { ScenarioSection } from '../components/simulation/ScenarioSection';
import { PlaybackControls } from '../components/simulation/PlaybackControls';
import { usePlayback } from '../hooks/usePlayback';

// Frequency response — 270 MW trip (1.5% of 17,600 MW), t=20s
// ROCOF 0.18 Hz/s → nadir 59.64 Hz at t=22s → governor recovery to 59.98 Hz
// Based on KPG-193 SPEEDGOAT simulation (docs/cosimulation-research.md §8)
const FREQ_POINTS = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let t = 0; t <= 60; t += 0.1) {
    let f: number;
    if (t < 20) {
      f = 60.0;
    } else {
      const dt = t - 20;
      if (dt <= 2) {
        // Linear drop at ROCOF 0.18 Hz/s
        f = 60.0 - 0.18 * dt;
      } else {
        // Governor response: τ=3.5 s, steady-state droop Δf=-0.02 Hz
        f = 59.64 + 0.34 * (1 - Math.exp(-(dt - 2) / 3.5));
      }
    }
    pts.push({ x: t, y: parseFloat(f.toFixed(4)) });
  }
  return pts;
})();

// Voltage response — 3 representative buses, EMT(solid) vs RMS(dashed)
// Bus A: near trip (large dip), Bus B: mid, Bus C: far (small dip)
// RMS-EMT co-simulation comparison (§8, Multi-core Co-simulation)
type VoltagePts = { x: number; y: number }[];
const mkVoltageBus = (
  nadirEmt: number,
  nadirRms: number,
  tauS: number,
): { emt: VoltagePts; rms: VoltagePts } => {
  const emt: VoltagePts = [];
  const rms: VoltagePts = [];
  for (let t = 0; t <= 60; t += 0.2) {
    if (t < 20) {
      emt.push({ x: t, y: 1.0 });
      rms.push({ x: t, y: 1.0 });
    } else {
      const dt = t - 20;
      const emtV = nadirEmt + (1.0 - nadirEmt) * 0.97 * (1 - Math.exp(-dt / tauS));
      const rmsV = nadirRms + (1.0 - nadirRms) * 0.95 * (1 - Math.exp(-dt / (tauS * 1.3)));
      emt.push({ x: t, y: parseFloat(emtV.toFixed(4)) });
      rms.push({ x: t, y: parseFloat(rmsV.toFixed(4)) });
    }
  }
  return { emt, rms };
};

const BUS_A = mkVoltageBus(0.910, 0.920, 2.0); // near trip
const BUS_B = mkVoltageBus(0.960, 0.964, 2.5); // mid-distance
const BUS_C = mkVoltageBus(0.985, 0.987, 3.0); // far from trip

const KPI_DATA = [
  { key: 'freqDrop', value: '59.64 Hz', unit: '' },
  { key: 'recovery', value: '< 10 s', unit: '' },
  { key: 'voltageError', value: '4.75×10⁻⁵', unit: 'pu' },
  { key: 'phaseError', value: '0.012', unit: 'deg' },
  { key: 'activePowerError', value: '3.12×10⁻⁵', unit: 'MW' },
  { key: 'reactivePowerError', value: '7.72×10⁻⁵', unit: 'MVar' },
] as const;

const CompareCard = ({
  title,
  desc,
  timestep,
  scale,
  tool,
  accent,
}: {
  title: string;
  desc: string;
  timestep: string;
  scale: string;
  tool: string;
  accent: string;
}) => (
  <div className="flex flex-col border border-border bg-bg-elev">
    <div className="border-b border-border p-5">
      <div
        className="mb-3 inline-block px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-bg"
        style={{ backgroundColor: accent }}
      >
        {title}
      </div>
      <p className="font-serif text-sm italic leading-relaxed text-fg-muted">{desc}</p>
    </div>
    <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
      {[
        { label: 'Time-step', value: timestep },
        { label: 'Scale', value: scale },
        { label: 'Tool', value: tool },
      ].map((row) => (
        <div key={row.label} className="bg-bg-elev p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">{row.label}</div>
          <div className="mt-1 font-mono text-xs font-bold text-fg">{row.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const ArchDiagram = ({
  caption,
  rmsLabel,
  emtDesc,
  ibrZone,
}: {
  caption: string;
  rmsLabel: string;
  emtDesc: string;
  ibrZone: string;
}) => (
  <div className="border border-border bg-bg-elev p-6">
    <svg viewBox="0 0 640 240" className="w-full" aria-label="Co-simulation architecture">
      {/* Core 1 RMS */}
      <rect x="20" y="60" width="240" height="120" rx="2" fill="none" stroke="var(--border)" strokeWidth="1" />
      <rect x="20" y="60" width="240" height="28" fill="var(--fg)" opacity="0.08" />
      <text x="140" y="79" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="var(--fg)" fontWeight="bold">
        CORE 1 — RMS
      </text>
      <text x="140" y="100" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        2,000 μs time-step
      </text>
      <text x="140" y="116" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        {rmsLabel}
      </text>
      <text x="140" y="132" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        PSS/E-type phasor solver
      </text>
      <text x="140" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)">
        193 buses (bulk)
      </text>

      {/* ITM interface */}
      <rect x="290" y="95" width="60" height="50" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 2" />
      <text x="320" y="116" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)">ITM</text>
      <text x="320" y="129" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">Interface</text>

      {/* Arrows between cores */}
      <line x1="260" y1="110" x2="290" y2="110" stroke="var(--accent)" strokeWidth="1" markerEnd="url(#arr)" />
      <line x1="350" y1="130" x2="380" y2="130" stroke="var(--accent)" strokeWidth="1" markerEnd="url(#arr)" />
      <text x="262" y="105" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">V phasor</text>
      <text x="352" y="125" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">I waveform</text>

      {/* Core 2 EMT */}
      <rect x="380" y="60" width="240" height="120" rx="2" fill="none" stroke="var(--border)" strokeWidth="1" />
      <rect x="380" y="60" width="240" height="28" fill="var(--fg)" opacity="0.08" />
      <text x="500" y="79" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="var(--fg)" fontWeight="bold">
        CORE 2 — EMT
      </text>
      <text x="500" y="100" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        50 μs time-step
      </text>
      <text x="500" y="116" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        {emtDesc}
      </text>
      <text x="500" y="132" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        Instantaneous waveform
      </text>
      <text x="500" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)">
        {ibrZone}
      </text>

      {/* SPEEDGOAT label */}
      <text x="320" y="210" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg-subtle)">
        SPEEDGOAT Performance Real-Time Simulator
      </text>
      <line x1="40" y1="195" x2="600" y2="195" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 2" />

      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
        </marker>
      </defs>
    </svg>
    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">{caption}</p>
  </div>
);

export const SimulationPage = () => {
  const { t } = useI18n();
  const s = t.simulation;
  // 두 시계열 차트(freq + voltage)에 공통 적용되는 playback (0-60s)
  const playback = usePlayback({ min: 0, max: 60, step: 0.5, intervalMs: 60 });

  return (
    <div className="space-y-20">
      {/* Hero */}
      <header className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {s.label}
        </span>
        <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
          {s.title}
        </h1>
        <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
          {s.tagline}
        </p>
      </header>

      {/* Section 01: EMT vs RMS */}
      <section className="space-y-6">
        <SectionHeader number="01" title={s.sections.comparison} />
        <div className="grid gap-4 lg:grid-cols-2">
          <CompareCard
            title={s.emt.title}
            desc={s.emt.desc}
            timestep={s.emt.timestep}
            scale={s.emt.scale}
            tool={s.emt.tool}
            accent="var(--accent)"
          />
          <CompareCard
            title={s.rms.title}
            desc={s.rms.desc}
            timestep={s.rms.timestep}
            scale={s.rms.scale}
            tool={s.rms.tool}
            accent="var(--fg)"
          />
        </div>
      </section>

      {/* Section 02: Modeling (Generator + IBR) */}
      <ModelingSection number="02" />

      {/* Section 03: AutoGrid pipeline */}
      <AutoGridSection number="03" />

      {/* Section 04: Co-simulation 3 types */}
      <CoSimTypesSection number="04" />

      {/* Section 05: Scenario comparison (trip size sensitivity) */}
      <ScenarioSection number="05" />

      {/* Playback controls — applies to Freq (06) + Voltage (07) charts together */}
      <PlaybackControls
        playing={playback.playing}
        time={playback.time}
        min={0}
        max={60}
        unit="s"
        onToggle={playback.toggle}
        onReset={playback.reset}
        onSeek={playback.seek}
      />

      {/* Section 06: Frequency Response (baseline scenario) */}
      <section className="space-y-6">
        <SectionHeader number="06" title={s.sections.freqResponse} />
        <div className="border border-border bg-bg-elev p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {s.freqChartTitle}
            </span>
            <span className="border border-border bg-bg px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-subtle">
              {s.eventLabel}
            </span>
          </div>
          <div className="h-48 sm:h-60">
            <LineSeriesChart
              series={[
                {
                  name: 'Frequency',
                  color: 'var(--accent)',
                  points: FREQ_POINTS,
                  fill: true,
                },
                {
                  name: 'Nominal 60 Hz',
                  color: 'var(--fg-subtle)',
                  points: [{ x: 0, y: 60 }, { x: 60, y: 60 }],
                },
              ]}
              yMin={59.5}
              yMax={60.1}
              xTicks={[0, 10, 20, 30, 40, 50, 60]}
              xLabel={(x) => `${x}s`}
              yLabel={(y) => `${y.toFixed(2)}`}
              vLine={{ x: 20, label: 'Generator trip' }}
              cursorX={playback.time > 0 ? playback.time : undefined}
              showLegend
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
            {s.freqChartCaption}
          </p>
        </div>
      </section>

      {/* Section 07: Voltage Response */}
      <section className="space-y-6">
        <SectionHeader number="07" title={s.sections.voltageResponse} />
        <div className="border border-border bg-bg-elev p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {s.voltageChartTitle}
            </span>
            <span className="border border-border bg-bg px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-fg-subtle">
              {s.eventLabel}
            </span>
          </div>
          <div className="h-48 sm:h-60">
            <LineSeriesChart
              series={[
                { name: 'Bus A — EMT', color: '#3b82f6', points: BUS_A.emt },
                { name: 'Bus A — RMS', color: '#3b82f6', strokeDasharray: '6 3', points: BUS_A.rms },
                { name: 'Bus B — EMT', color: '#22c55e', points: BUS_B.emt },
                { name: 'Bus B — RMS', color: '#22c55e', strokeDasharray: '6 3', points: BUS_B.rms },
                { name: 'Bus C — EMT', color: '#f97316', points: BUS_C.emt },
                { name: 'Bus C — RMS', color: '#f97316', strokeDasharray: '6 3', points: BUS_C.rms },
              ]}
              yMin={0.88}
              yMax={1.01}
              xTicks={[0, 10, 20, 30, 40, 50, 60]}
              xLabel={(x) => `${x}s`}
              yLabel={(y) => y.toFixed(2)}
              vLine={{ x: 20 }}
              cursorX={playback.time > 0 ? playback.time : undefined}
              showLegend
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
            {s.voltageChartCaption}
          </p>
        </div>
      </section>

      {/* Section 08: Architecture */}
      <section className="space-y-6">
        <SectionHeader number="08" title={s.sections.architecture} />
        <div className="space-y-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            {s.archTitle}
          </p>
          <ArchDiagram
            caption={s.archCaption}
            rmsLabel={s.archRmsLabel}
            emtDesc={s.archEmtDesc}
            ibrZone={s.archIbrZone}
          />
        </div>
      </section>

      {/* Section 09: Results */}
      <section className="space-y-6">
        <SectionHeader number="09" title={s.sections.results} />
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {KPI_DATA.map(({ key, value, unit }) => (
            <div key={key} className="bg-bg-elev p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
                {s.kpi[key as keyof typeof s.kpi]}
              </div>
              <div className="mt-1 font-mono text-sm font-bold tabular-nums text-fg">
                {value}
              </div>
              {unit && (
                <div className="font-mono text-[9px] text-fg-subtle">{unit}</div>
              )}
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
          {s.resultsCaption}
        </p>
      </section>
    </div>
  );
};
