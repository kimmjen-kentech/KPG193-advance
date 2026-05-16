import { useState, useMemo } from 'react';
import { DeckGL } from 'deck.gl';
import { ScatterplotLayer, LineLayer, PathLayer, IconLayer } from 'deck.gl';
import type { PickingInfo } from 'deck.gl';
import { Map as MapLibre } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronRight, CornerDownRight, Cable } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import {
  networkBusesSQL,
  networkBranchesSQL,
  networkDcLinesSQL,
  networkGeneratorsSQL,
  networkGenerationMixSQL,
  type NetworkBus,
  type NetworkBranch,
  type NetworkDcLine,
  type NetworkGenerator,
  type NetworkBusGenMix,
} from '../lib/queries';
import { toDisplay } from '../utils/decimal';
import { useTheme } from '../hooks/useTheme';
import { getFuelIconUrl, FUEL_ICON_SIZE, FUEL_ICON_SVG } from '../lib/fuelIcons';
import { generateAllPieIcons, type PieIcon } from '../lib/pieIcon';
import { cn } from '../lib/cn';

const INITIAL_VIEW = {
  longitude: 127.8,
  latitude: 36.2,
  zoom: 6.4,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const voltageColor = (kv: number): [number, number, number, number] => {
  if (kv >= 700) return [37, 99, 235, 230];
  if (kv >= 300) return [100, 116, 139, 200];
  return [148, 163, 184, 160];
};

const voltageRadius = (kv: number): number => {
  if (kv >= 700) return 6500;
  if (kv >= 300) return 4000;
  return 2500;
};

const voltageWidth = (kv: number): number => {
  if (kv >= 700) return 3.5;
  if (kv >= 300) return 2;
  return 1.2;
};

const SELECTED = [249, 115, 22] as const;

type Selection =
  | { kind: 'bus'; id: number }
  | { kind: 'branch'; branch: NetworkBranch }
  | null;

const branchKey = (b: NetworkBranch) => `${b.from_id}-${b.to_id}-${b.kv}-${b.rate_mva}`;

const busLabel = (id: number, name: string) => `#${String(id).padStart(3, '0')}. ${name}`;

export const NetworkPage = () => {
  const { theme } = useTheme();
  const buses = useQuery<NetworkBus>(networkBusesSQL);
  const branches = useQuery<NetworkBranch>(networkBranchesSQL);
  const dcLines = useQuery<NetworkDcLine>(networkDcLinesSQL);
  const generators = useQuery<NetworkGenerator>(networkGeneratorsSQL);
  const genMix = useQuery<NetworkBusGenMix>(networkGenerationMixSQL);
  const [genView, setGenView] = useState<'off' | 'icons' | 'pie'>('icons');

  const [selection, setSelection] = useState<Selection>(null);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);

  const busMap = useMemo(() => {
    const m = new Map<number, NetworkBus>();
    buses.data?.forEach((b) => m.set(b.id, b));
    return m;
  }, [buses.data]);

  const pieIcons: PieIcon[] = useMemo(() => {
    if (genView !== 'pie' || !genMix.data) return [];
    return generateAllPieIcons(genMix.data);
  }, [genMix.data, genView]);

  const layers = useMemo(() => {
    const out: unknown[] = [];
    const selectedBranchKey =
      selection?.kind === 'branch' ? branchKey(selection.branch) : null;
    const selectedBusId = selection?.kind === 'bus' ? selection.id : null;

    if (branches.data) {
      out.push(
        new LineLayer({
          id: 'branches',
          data: branches.data,
          getSourcePosition: (d: NetworkBranch) => [d.from_lng, d.from_lat],
          getTargetPosition: (d: NetworkBranch) => [d.to_lng, d.to_lat],
          getColor: (d: NetworkBranch) => voltageColor(d.kv),
          getWidth: (d: NetworkBranch) => voltageWidth(d.kv),
          widthUnits: 'pixels',
          widthMinPixels: 1,
          pickable: true,
          onClick: (info: PickingInfo) => {
            const b = info.object as NetworkBranch | null;
            if (b) setSelection({ kind: 'branch', branch: b });
          },
          onHover: (info: PickingInfo) => setHoverInfo(info),
        }),
      );

      if (selection?.kind === 'branch') {
        out.push(
          new LineLayer({
            id: 'selected-branch',
            data: [selection.branch],
            getSourcePosition: (d: NetworkBranch) => [d.from_lng, d.from_lat],
            getTargetPosition: (d: NetworkBranch) => [d.to_lng, d.to_lat],
            getColor: [...SELECTED, 255],
            getWidth: 4.5,
            widthUnits: 'pixels',
            pickable: false,
          }),
        );
      }
    }

    if (genView === 'icons' && generators.data) {
      const grouped = new Map<string, NetworkGenerator[]>();
      generators.data.forEach((g) => {
        const key = `${g.bus_id}-${g.fuel}`;
        const arr = grouped.get(key) ?? [];
        arr.push(g);
        grouped.set(key, arr);
      });
      const fuelOrder: Array<'nuclear' | 'coal' | 'lng'> = ['nuclear', 'coal', 'lng'];
      const aggregated = Array.from(grouped.values()).map((arr) => {
        const total = arr.reduce((s, g) => s + g.pmax_mw, 0);
        return { ...arr[0], pmax_mw: total, count: arr.length };
      });
      aggregated.sort(
        (a, b) => fuelOrder.indexOf(a.fuel) - fuelOrder.indexOf(b.fuel),
      );

      out.push(
        new IconLayer({
          id: 'generators',
          data: aggregated,
          getPosition: (d: NetworkGenerator) => [d.lng + 0.05, d.lat + 0.05],
          getIcon: (d: NetworkGenerator) => ({
            url: getFuelIconUrl(d.fuel),
            width: FUEL_ICON_SIZE,
            height: FUEL_ICON_SIZE,
            anchorX: FUEL_ICON_SIZE / 2,
            anchorY: FUEL_ICON_SIZE / 2,
          }),
          getSize: (d: NetworkGenerator) => Math.sqrt(d.pmax_mw) * 0.7 + 18,
          sizeMinPixels: 18,
          sizeMaxPixels: 56,
          sizeUnits: 'pixels',
          pickable: false,
        }),
      );
    }

    if (genView === 'pie' && pieIcons.length > 0) {
      out.push(
        new IconLayer({
          id: 'generation-pie',
          data: pieIcons,
          getPosition: (d: PieIcon) => [d.lng, d.lat],
          getIcon: (d: PieIcon) => ({
            url: d.iconUrl,
            width: d.size * 2,
            height: d.size * 2,
            anchorX: d.size,
            anchorY: d.size,
          }),
          getSize: (d: PieIcon) => d.size,
          sizeUnits: 'pixels',
          pickable: false,
        }),
      );
    }

    if (dcLines.data) {
      out.push(
        new PathLayer({
          id: 'dc-lines',
          data: dcLines.data,
          getPath: (d: NetworkDcLine) => [
            [d.from_lng, d.from_lat],
            [d.to_lng, d.to_lat],
          ],
          getColor: [250, 204, 21, 230],
          getWidth: 3,
          widthUnits: 'pixels',
          pickable: false,
        }),
      );
    }

    if (buses.data) {
      out.push(
        new ScatterplotLayer({
          id: 'buses',
          data: buses.data,
          getPosition: (d: NetworkBus) => [d.lng, d.lat],
          getRadius: (d: NetworkBus) => voltageRadius(d.kv),
          radiusMinPixels: 3,
          radiusMaxPixels: 14,
          getFillColor: (d: NetworkBus) => voltageColor(d.kv),
          getLineColor: [10, 10, 10, 200],
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          stroked: true,
          pickable: true,
          onClick: (info: PickingInfo) => {
            const b = info.object as NetworkBus | null;
            if (b) setSelection({ kind: 'bus', id: b.id });
          },
          onHover: (info: PickingInfo) => setHoverInfo(info),
        }),
      );

      if (selectedBusId !== null) {
        const bus = busMap.get(selectedBusId);
        if (bus) {
          out.push(
            new ScatterplotLayer({
              id: 'selected-bus-ring',
              data: [bus],
              getPosition: (d: NetworkBus) => [d.lng, d.lat],
              getRadius: 16000,
              radiusMinPixels: 16,
              radiusMaxPixels: 32,
              getFillColor: [...SELECTED, 40],
              getLineColor: [...SELECTED, 255],
              getLineWidth: 2.5,
              lineWidthUnits: 'pixels',
              stroked: true,
              pickable: false,
            }),
            new ScatterplotLayer({
              id: 'selected-bus-dot',
              data: [bus],
              getPosition: (d: NetworkBus) => [d.lng, d.lat],
              getRadius: (d: NetworkBus) => voltageRadius(d.kv) * 1.5,
              radiusMinPixels: 5,
              radiusMaxPixels: 18,
              getFillColor: [...SELECTED, 255],
              getLineColor: [255, 255, 255, 255],
              getLineWidth: 2,
              lineWidthUnits: 'pixels',
              stroked: true,
              pickable: false,
            }),
          );
        }
      }
    }

    return { out, selectedBranchKey };
  }, [buses.data, branches.data, dcLines.data, generators.data, pieIcons, genView, selection, busMap]);

  const isLoading = buses.loading || branches.loading || dcLines.loading;
  const error = buses.error || branches.error || dcLines.error;
  const hoveredObj = hoverInfo?.object;
  const hoveredBus =
    hoverInfo?.layer?.id === 'buses' ? (hoveredObj as NetworkBus | undefined) : undefined;
  const hoveredBranch =
    hoverInfo?.layer?.id === 'branches' ? (hoveredObj as NetworkBranch | undefined) : undefined;

  return (
    <div className="-mx-4 -my-8 h-[calc(100vh-65px)] sm:-mx-6 lg:-mx-8">
      <div className="flex h-full flex-col border-t border-border lg:flex-row">
        <div className="relative flex-1 bg-bg-subtle">
          <DeckGL
            initialViewState={INITIAL_VIEW}
            controller={true}
            layers={layers.out as never[]}
            getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
          >
            <MapLibre mapStyle={theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT} />
          </DeckGL>

          <div className="pointer-events-none absolute left-5 top-5 space-y-3">
            <div className="pointer-events-auto border border-border bg-bg-elev/90 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
                  Network_Live
                </span>
              </div>
              {isLoading && (
                <div className="mt-2 font-mono text-[10px] text-fg-muted">
                  loading parquet …
                </div>
              )}
              {error && (
                <div className="mt-2 font-mono text-[10px] text-fg-muted">
                  err: {error.message}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 border border-border bg-bg-elev/90 p-4 backdrop-blur">
            <div className="mb-3 border-b border-border pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
              Legend
            </div>
            <div className="space-y-2 font-mono text-[10px] text-fg-muted">
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#2563eb]" />
                765 kV
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#64748b]" />
                345 kV
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#94a3b8]" />
                154 kV
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="inline-block h-[2px] w-6 bg-[#facc15]" />
                HVDC
              </div>
              <div className="mt-2 border-t border-border pt-2">
                <div className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-fg">
                  Generators
                </div>
                <div className="flex gap-1">
                  {(['off', 'icons', 'pie'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGenView(mode)}
                      className={cn(
                        'flex-1 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors',
                        genView === mode
                          ? 'border-fg bg-fg text-bg'
                          : 'border-border bg-bg text-fg-muted hover:text-fg',
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              {genView === 'icons' && (
                <>
                  <FuelLegendRow fuel="nuclear" label="Nuclear" />
                  <FuelLegendRow fuel="coal" label="Coal" />
                  <FuelLegendRow fuel="lng" label="LNG" />
                </>
              )}
              {genView === 'pie' && (
                <>
                  <FuelLegendRow fuel="nuclear" label="Nuclear" />
                  <FuelLegendRow fuel="coal" label="Coal" />
                  <FuelLegendRow fuel="lng" label="LNG" />
                  <FuelLegendRow fuel="solar" label="Solar" />
                  <FuelLegendRow fuel="wind" label="Wind" />
                  <FuelLegendRow fuel="hydro" label="Hydro" />
                </>
              )}
            </div>
          </div>

          {(hoveredBus || hoveredBranch) && hoverInfo && (
            <div
              className="pointer-events-none absolute z-10 border border-border bg-bg-elev px-3 py-2 font-mono text-[10px]"
              style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
            >
              {hoveredBus && (
                <>
                  <div className="font-bold text-fg">{busLabel(hoveredBus.id, hoveredBus.name_kr)}</div>
                  <div className="text-fg-muted">
                    {hoveredBus.name_en} · {Math.round(hoveredBus.kv)} kV
                  </div>
                </>
              )}
              {hoveredBranch && (
                <>
                  <div className="font-bold text-fg">
                    {busMap.get(hoveredBranch.from_id)?.name_kr ?? `#${hoveredBranch.from_id}`}
                    {' → '}
                    {busMap.get(hoveredBranch.to_id)?.name_kr ?? `#${hoveredBranch.to_id}`}
                  </div>
                  <div className="text-fg-muted">
                    {Math.round(hoveredBranch.kv)} kV · {toDisplay(hoveredBranch.rate_mva, { grouping: true })} MVA
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="flex max-h-[40vh] w-full flex-col border-t border-border bg-bg lg:max-h-none lg:w-[380px] lg:border-l lg:border-t-0">
          <div className="border-b border-border bg-bg-subtle p-5">
            <span className="bg-fg px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-bg">
              {selection?.kind === 'branch' ? 'Branch_Inspector' : 'Node_Inspector'}
            </span>
            <h2 className="mt-3 font-serif text-2xl italic uppercase leading-none tracking-tight text-fg">
              Terminal
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {selection ? 'tap map to switch' : 'select node or branch'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selection?.kind === 'bus' &&
              busMap.get(selection.id) &&
              (() => {
                const bus = busMap.get(selection.id)!;
                const related = (branches.data ?? []).filter(
                  (b) => b.from_id === bus.id || b.to_id === bus.id,
                );
                return (
                  <BusDetail
                    bus={bus}
                    branches={related}
                    busMap={busMap}
                    onClose={() => setSelection(null)}
                    onSelectBranch={(b) => setSelection({ kind: 'branch', branch: b })}
                    onSelectBus={(id) => setSelection({ kind: 'bus', id })}
                  />
                );
              })()}

            {selection?.kind === 'branch' &&
              (() => {
                const sel = selection.branch;
                const connected = (branches.data ?? []).filter(
                  (b) =>
                    branchKey(b) !== branchKey(sel) &&
                    (b.from_id === sel.from_id ||
                      b.to_id === sel.from_id ||
                      b.from_id === sel.to_id ||
                      b.to_id === sel.to_id),
                );
                return (
                  <BranchDetail
                    branch={sel}
                    connected={connected}
                    busMap={busMap}
                    onClose={() => setSelection(null)}
                    onSelectBranch={(b) => setSelection({ kind: 'branch', branch: b })}
                    onSelectBus={(id) => setSelection({ kind: 'bus', id })}
                  />
                );
              })()}

            {!selection && <BusList buses={buses.data ?? []} onSelect={(id) => setSelection({ kind: 'bus', id })} />}
          </div>
        </aside>
      </div>
    </div>
  );
};

const BusDetail = ({
  bus,
  branches,
  busMap,
  onClose,
  onSelectBranch,
  onSelectBus,
}: {
  bus: NetworkBus;
  branches: NetworkBranch[];
  busMap: Map<number, NetworkBus>;
  onClose: () => void;
  onSelectBranch: (b: NetworkBranch) => void;
  onSelectBus: (id: number) => void;
}) => (
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
  </div>
);

const BranchDetail = ({
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

const Cell = ({
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

const FuelLegendRow = ({
  fuel,
  label,
}: {
  fuel: 'coal' | 'lng' | 'nuclear' | 'solar' | 'wind' | 'hydro';
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <span
      className="inline-block h-4 w-4 shrink-0"
      dangerouslySetInnerHTML={{ __html: FUEL_ICON_SVG[fuel] }}
    />
    {label}
  </div>
);

const BusList = ({
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
