import { ChevronRight, CornerDownRight } from 'lucide-react';
import type { NetworkBus, NetworkBranch, NetworkGenerator, NetworkBusGenMix } from '../../lib/queries';
import { toDisplay } from '../../utils/decimal';
import { FUEL_COLORS_HEX, FUEL_LABELS } from '../../lib/constants';
import { useI18n } from '../../hooks/useI18n';
import { branchKey, busLabel } from './networkUtils';

export const Cell = ({
  label,
  children,
  colSpan = 1,
}: {
  label: string;
  children: React.ReactNode;
  colSpan?: 1 | 2;
}) => (
  <div className={`bg-bg-elev p-3 ${colSpan === 2 ? 'col-span-2' : ''}`}>
    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
      {label}
    </div>
    {children}
  </div>
);

export const BusDetail = ({
  bus,
  branches,
  busMap,
  thermalGens = [],
  busGenMix = null,
  onClose,
  onSelectBranch,
  onSelectBus,
}: {
  bus: NetworkBus;
  branches: NetworkBranch[];
  busMap: Map<number, NetworkBus>;
  thermalGens?: NetworkGenerator[];
  busGenMix?: NetworkBusGenMix | null;
  onClose: () => void;
  onSelectBranch: (b: NetworkBranch) => void;
  onSelectBus: (id: number) => void;
}) => {
  const { t } = useI18n();
  const ibrFuels = busGenMix
    ? (
        [
          { key: 'solar' as const, mw: busGenMix.solar },
          { key: 'wind' as const, mw: busGenMix.wind },
          { key: 'hydro' as const, mw: busGenMix.hydro },
        ] as const
      ).filter((f) => f.mw > 0)
    : [];
  const hasGens = thermalGens.length > 0 || ibrFuels.length > 0;

  return (
    <div className="space-y-6 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            Node_Identifier
          </div>
          <h3 className="mt-1 font-mono text-2xl font-bold tracking-tight text-fg tabular-nums">
            {busLabel(bus.id, bus.name_kr)}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-tight text-fg-muted">
            {bus.name_en}
          </p>
        </div>
        <button
          onClick={onClose}
          className="border border-border p-1.5 text-fg transition-colors hover:bg-fg hover:text-bg"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-px border border-border bg-border">
        <Cell label="Voltage">
          <span className="font-mono text-base tabular-nums">{Math.round(bus.kv)} kV</span>
        </Cell>
        <Cell label="Area">
          <span className="font-mono text-base tabular-nums">{bus.area}</span>
        </Cell>
        <Cell label="Pd (active)" colSpan={2}>
          <span className="font-mono text-xs tabular-nums">
            {toDisplay(bus.pd, { grouping: true, suffix: ' MW' })}
          </span>
        </Cell>
        <Cell label="Qd (reactive)" colSpan={2}>
          <span className="font-mono text-xs tabular-nums">
            {toDisplay(bus.qd, { grouping: true, suffix: ' MVAr' })}
          </span>
        </Cell>
        <Cell label="Coordinates" colSpan={2}>
          <span className="font-mono text-[10px] uppercase tracking-tight text-fg-muted">
            LAT {bus.lat.toFixed(4)}N // LNG {bus.lng.toFixed(4)}E
          </span>
        </Cell>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
            Connected Branches
          </span>
          <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[9px] text-fg-muted">
            {branches.length}
          </span>
        </div>
        <div className="border-t border-border">
          {branches.map((br) => {
            const otherId = br.from_id === bus.id ? br.to_id : br.from_id;
            const other = busMap.get(otherId);
            return (
              <button
                key={branchKey(br)}
                onClick={() => onSelectBranch(br)}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-2 border-b border-border/40 py-2.5 text-left transition-colors hover:bg-bg-subtle"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CornerDownRight size={12} className="text-fg-subtle shrink-0" />
                  <span className="font-mono text-[11px] text-fg truncate">
                    → {other ? busLabel(otherId, other.name_kr) : `#${otherId}`}
                  </span>
                  <span
                    className="ml-auto shrink-0 cursor-pointer font-mono text-[9px] text-fg-subtle hover:text-fg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBus(otherId);
                    }}
                  >
                    ↗
                  </span>
                </div>
                <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[10px] text-fg-muted whitespace-nowrap">
                  {Math.round(br.kv)}kV · {toDisplay(br.rate_mva, { grouping: true })} MVA
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {hasGens && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              {t.network.generators}
            </span>
            <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[9px] text-fg-muted">
              {thermalGens.length + ibrFuels.length}
            </span>
          </div>
          <div className="divide-y divide-border/40 border-t border-border">
            {thermalGens.map((g, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: FUEL_COLORS_HEX[g.fuel] }}
                  />
                  <span className="font-mono text-[11px] text-fg">
                    {FUEL_LABELS[g.fuel] ?? g.fuel}
                  </span>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-fg-muted">
                  {toDisplay(g.pmax_exact, { grouping: true, suffix: ' MW' })}
                </span>
              </div>
            ))}
            {ibrFuels.map(({ key, mw }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: FUEL_COLORS_HEX[key] }}
                  />
                  <span className="font-mono text-[11px] text-fg">
                    {FUEL_LABELS[key] ?? key}
                  </span>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-fg-muted">
                  {mw.toFixed(1)} MW
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
