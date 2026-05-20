import { Cable, ChevronRight, CornerDownRight } from 'lucide-react';
import type { NetworkBus, NetworkBranch } from '../../lib/queries';
import { toDisplay } from '../../utils/decimal';
import { branchKey, busLabel } from './networkUtils';
import { Cell } from './BusDetail';

const BusBtn = ({
  label,
  bus,
  id,
  onClick,
}: {
  label: string;
  bus: NetworkBus | undefined;
  id: number;
  onClick: (id: number) => void;
}) => (
  <button
    onClick={() => onClick(id)}
    className="group flex w-full items-center justify-between border border-border bg-bg-elev p-3 text-left transition-colors hover:bg-bg-subtle"
  >
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </div>
      <div className="font-mono text-sm font-bold tracking-tight tabular-nums text-fg">
        {bus ? busLabel(id, bus.name_kr) : `#${String(id).padStart(3, '0')}`}
      </div>
      {bus && (
        <div className="font-mono text-[10px] text-fg-muted">
          {bus.name_en} · {Math.round(bus.kv)} kV
        </div>
      )}
    </div>
    <ChevronRight size={14} className="text-fg-subtle group-hover:text-fg" />
  </button>
);

export const BranchDetail = ({
  branch,
  connected,
  busMap,
  onClose,
  onSelectBranch,
  onSelectBus,
}: {
  branch: NetworkBranch;
  connected: NetworkBranch[];
  busMap: Map<number, NetworkBus>;
  onClose: () => void;
  onSelectBranch: (b: NetworkBranch) => void;
  onSelectBus: (id: number) => void;
}) => {
  const from = busMap.get(branch.from_id);
  const to = busMap.get(branch.to_id);
  return (
    <div className="space-y-6 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            Branch_Identifier
          </div>
          <h3 className="mt-1 flex items-center gap-2 font-mono text-base font-bold text-fg">
            <Cable size={14} />
            <span className="tabular-nums">{Math.round(branch.kv)} kV</span>
          </h3>
        </div>
        <button
          onClick={onClose}
          className="border border-border p-1.5 text-fg transition-colors hover:bg-fg hover:text-bg"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        <BusBtn label="From" bus={from} id={branch.from_id} onClick={onSelectBus} />
        <BusBtn label="To" bus={to} id={branch.to_id} onClick={onSelectBus} />
      </div>

      <div className="grid grid-cols-2 gap-px border border-border bg-border">
        <Cell label="Voltage">
          <span className="font-mono text-base tabular-nums">{Math.round(branch.kv)} kV</span>
        </Cell>
        <Cell label="Rating">
          <span className="font-mono text-xs tabular-nums">
            {toDisplay(branch.rate_mva, { grouping: true })} MVA
          </span>
        </Cell>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            Connected Branches
          </span>
          <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[9px] text-fg-muted">
            {connected.length}
          </span>
        </div>
        <div className="border-t border-border">
          {connected.map((br) => {
            const f = busMap.get(br.from_id);
            const t = busMap.get(br.to_id);
            return (
              <button
                key={branchKey(br)}
                onClick={() => onSelectBranch(br)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-2 border-b border-border/40 py-2.5 text-left transition-colors hover:bg-bg-subtle"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CornerDownRight size={12} className="text-fg-subtle shrink-0" />
                  <span className="font-mono text-[11px] text-fg truncate">
                    {f ? busLabel(br.from_id, f.name_kr) : `#${br.from_id}`}
                    {' → '}
                    {t ? busLabel(br.to_id, t.name_kr) : `#${br.to_id}`}
                  </span>
                </div>
                <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[10px] text-fg-muted whitespace-nowrap">
                  {Math.round(br.kv)}kV
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
