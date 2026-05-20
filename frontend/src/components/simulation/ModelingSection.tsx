import { useI18n } from '../../hooks/useI18n';
import { SectionHeader } from '../ui/SectionHeader';

const GeneratorDiagram = () => (
  <svg viewBox="0 0 400 180" className="w-full" aria-label="Synchronous generator block diagram">
    {/* Rotor */}
    <circle cx="80" cy="90" r="32" fill="none" stroke="var(--fg)" strokeWidth="1.2" />
    <text x="80" y="93" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg)" fontWeight="bold">ROTOR</text>
    <text x="80" y="105" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">ω</text>

    {/* Stator coil */}
    <rect x="150" y="70" width="60" height="40" fill="none" stroke="var(--fg)" strokeWidth="1.2" />
    <text x="180" y="86" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--fg)" fontWeight="bold">STATOR</text>
    <text x="180" y="98" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">3φ coils</text>

    {/* Output */}
    <line x1="210" y1="90" x2="270" y2="90" stroke="var(--fg)" strokeWidth="1.2" markerEnd="url(#gen-arr)" />
    <text x="280" y="86" fontFamily="monospace" fontSize="9" fill="var(--accent)">V, I</text>
    <text x="280" y="98" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">to grid</text>

    {/* Rotor to stator */}
    <line x1="112" y1="90" x2="150" y2="90" stroke="var(--fg)" strokeWidth="1.2" markerEnd="url(#gen-arr)" />

    {/* Control loops */}
    {/* AVR */}
    <rect x="20" y="20" width="44" height="22" fill="none" stroke="var(--accent)" strokeWidth="1" />
    <text x="42" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)" fontWeight="bold">AVR</text>
    <line x1="42" y1="42" x2="42" y2="58" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#gen-arr-a)" />

    {/* Governor */}
    <rect x="80" y="20" width="56" height="22" fill="none" stroke="var(--accent)" strokeWidth="1" />
    <text x="108" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)" fontWeight="bold">GOV</text>
    <line x1="108" y1="42" x2="80" y2="58" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#gen-arr-a)" />

    {/* PSS */}
    <rect x="160" y="20" width="44" height="22" fill="none" stroke="var(--accent)" strokeWidth="1" />
    <text x="182" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)" fontWeight="bold">PSS</text>
    <line x1="182" y1="42" x2="182" y2="70" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#gen-arr-a)" />

    {/* Feedback from output */}
    <line x1="240" y1="90" x2="240" y2="150" stroke="var(--fg-subtle)" strokeWidth="0.8" />
    <line x1="240" y1="150" x2="42" y2="150" stroke="var(--fg-subtle)" strokeWidth="0.8" />
    <line x1="42" y1="150" x2="42" y2="44" stroke="var(--fg-subtle)" strokeWidth="0.8" />
    <text x="140" y="162" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">V, ω feedback</text>

    <defs>
      <marker id="gen-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="var(--fg)" />
      </marker>
      <marker id="gen-arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
      </marker>
    </defs>
  </svg>
);

const IbrDiagram = () => (
  <svg viewBox="0 0 400 180" className="w-full" aria-label="IBR Grid-Following block diagram">
    {/* DC source */}
    <rect x="20" y="74" width="56" height="32" fill="none" stroke="var(--fg)" strokeWidth="1.2" />
    <text x="48" y="90" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--fg)" fontWeight="bold">PV / WT</text>
    <text x="48" y="100" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">DC source</text>

    {/* Inverter */}
    <rect x="120" y="70" width="60" height="40" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
    <text x="150" y="86" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--accent)" fontWeight="bold">INVERTER</text>
    <text x="150" y="98" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">DC → AC</text>

    {/* Filter */}
    <rect x="218" y="74" width="46" height="32" fill="none" stroke="var(--fg)" strokeWidth="1.2" />
    <text x="241" y="93" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--fg)">L-filter</text>

    {/* Grid */}
    <line x1="280" y1="90" x2="330" y2="90" stroke="var(--fg)" strokeWidth="1.2" markerEnd="url(#ibr-arr)" />
    <text x="340" y="86" fontFamily="monospace" fontSize="9" fill="var(--accent)">Grid</text>
    <text x="340" y="98" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">3φ AC</text>

    {/* Wires */}
    <line x1="76" y1="90" x2="120" y2="90" stroke="var(--fg)" strokeWidth="1.2" markerEnd="url(#ibr-arr)" />
    <line x1="180" y1="90" x2="218" y2="90" stroke="var(--fg)" strokeWidth="1.2" markerEnd="url(#ibr-arr)" />
    <line x1="264" y1="90" x2="280" y2="90" stroke="var(--fg)" strokeWidth="1.2" />

    {/* Control */}
    <rect x="98" y="20" width="104" height="22" fill="none" stroke="var(--accent)" strokeWidth="1" />
    <text x="150" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)" fontWeight="bold">GRID-FOLLOWING CTRL</text>

    <rect x="220" y="20" width="44" height="22" fill="none" stroke="var(--accent)" strokeWidth="1" />
    <text x="242" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--accent)" fontWeight="bold">PLL</text>

    {/* Ctrl to inverter */}
    <line x1="150" y1="42" x2="150" y2="68" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#ibr-arr-a)" />

    {/* PLL feedback from grid */}
    <line x1="290" y1="90" x2="290" y2="60" stroke="var(--fg-subtle)" strokeWidth="0.8" />
    <line x1="290" y1="60" x2="242" y2="60" stroke="var(--fg-subtle)" strokeWidth="0.8" />
    <line x1="242" y1="60" x2="242" y2="44" stroke="var(--fg-subtle)" strokeWidth="0.8" markerEnd="url(#ibr-arr-a)" />
    <line x1="220" y1="32" x2="202" y2="32" stroke="var(--fg-subtle)" strokeWidth="0.8" markerEnd="url(#ibr-arr-a)" />

    <text x="220" y="162" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--fg-subtle)">f, V sensing</text>

    <defs>
      <marker id="ibr-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="var(--fg)" />
      </marker>
      <marker id="ibr-arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
      </marker>
    </defs>
  </svg>
);

const ControlRow = ({ label, desc }: { label: string; desc: string }) => (
  <div className="grid grid-cols-[60px_1fr] items-baseline gap-3 border-b border-border/40 py-2 last:border-b-0">
    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
      {label}
    </span>
    <span className="font-mono text-[11px] leading-snug text-fg-muted">{desc}</span>
  </div>
);

export const ModelingSection = ({ number }: { number: string }) => {
  const { t } = useI18n();
  const m = t.simulation.modeling;

  return (
    <section className="space-y-6">
      <SectionHeader number={number} title={t.simulation.sections.modeling} />
      <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-fg-muted">
        {m.intro}
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Generator card */}
        <div className="border border-border bg-bg-elev">
          <div className="border-b border-border p-5">
            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {m.generator.title}
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
              {m.generator.desc}
            </p>
          </div>
          <div className="border-b border-border p-4">
            <GeneratorDiagram />
          </div>
          <div className="px-5 py-3">
            <ControlRow label={m.generator.avr} desc={m.generator.avrDesc} />
            <ControlRow label={m.generator.governor} desc={m.generator.governorDesc} />
            <ControlRow label={m.generator.pss} desc={m.generator.pssDesc} />
          </div>
        </div>

        {/* IBR card */}
        <div className="border border-border bg-bg-elev">
          <div className="border-b border-border p-5">
            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {m.ibr.title}
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-fg-muted">
              {m.ibr.desc}
            </p>
          </div>
          <div className="border-b border-border p-4">
            <IbrDiagram />
          </div>
          <div className="px-5 py-3">
            <ControlRow label={m.ibr.mode} desc={m.ibr.modeDesc} />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
              {m.ibr.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
