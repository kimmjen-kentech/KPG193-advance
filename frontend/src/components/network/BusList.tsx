import type { NetworkBus } from '../../lib/queries';

export const BusList = ({
  buses,
  onSelect,
}: {
  buses: NetworkBus[];
  onSelect: (id: number) => void;
}) => (
  <div>
    <div className="sticky top-0 z-10 grid grid-cols-[44px_1fr_60px] border-b border-border bg-bg-subtle px-5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
      <span>ID</span>
      <span>Name</span>
      <span className="text-right">kV</span>
    </div>
    {buses.map((bus) => (
      <button
        key={bus.id}
        onClick={() => onSelect(bus.id)}
        className="grid w-full grid-cols-[44px_1fr_60px] items-center border-b border-border/30 px-5 py-2 text-left transition-colors hover:bg-fg hover:text-bg"
      >
        <span className="font-mono text-[10px] text-fg-subtle">
          #{String(bus.id).padStart(3, '0')}
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-tight">
          {bus.name_kr}
        </span>
        <span className="text-right font-mono text-xs tabular-nums text-fg-muted">
          {Math.round(bus.kv)}
        </span>
      </button>
    ))}
  </div>
);
