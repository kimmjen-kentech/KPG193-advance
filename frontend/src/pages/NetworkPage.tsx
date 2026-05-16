import { useState, useMemo } from 'react';
import { DeckGL } from 'deck.gl';
import { ScatterplotLayer, LineLayer, PathLayer } from 'deck.gl';
import type { PickingInfo } from 'deck.gl';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronRight, CornerDownRight } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import {
  networkBusesSQL,
  networkBranchesSQL,
  networkDcLinesSQL,
  type NetworkBus,
  type NetworkBranch,
  type NetworkDcLine,
} from '../lib/queries';
import { toDisplay } from '../utils/decimal';
import { useTheme } from '../hooks/useTheme';

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
  if (kv >= 700) return 3;
  if (kv >= 300) return 1.6;
  return 0.8;
};

export const NetworkPage = () => {
  const { theme } = useTheme();
  const buses = useQuery<NetworkBus>(networkBusesSQL);
  const branches = useQuery<NetworkBranch>(networkBranchesSQL);
  const dcLines = useQuery<NetworkDcLine>(networkDcLinesSQL);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);

  const selectedBus = useMemo(
    () => buses.data?.find((b) => b.id === selectedId) ?? null,
    [buses.data, selectedId],
  );

  const relatedBranches = useMemo(() => {
    if (!selectedId || !branches.data) return [];
    return branches.data.filter((b) => b.from_id === selectedId || b.to_id === selectedId);
  }, [branches.data, selectedId]);

  const layers = useMemo(() => {
    const out: unknown[] = [];

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
          getFillColor: (d: NetworkBus) => voltageColor(d.kv),
          getLineColor: [10, 10, 10, 200],
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          stroked: true,
          pickable: true,
          onClick: (info: PickingInfo) =>
            setSelectedId((info.object as NetworkBus | null)?.id ?? null),
          onHover: (info: PickingInfo) => setHoverInfo(info),
        }),
      );

      const selected = buses.data.find((b) => b.id === selectedId);
      if (selected) {
        out.push(
          new ScatterplotLayer({
            id: 'selected-outer',
            data: [selected],
            getPosition: (d: NetworkBus) => [d.lng, d.lat],
            getRadius: 18000,
            getFillColor: [249, 115, 22, 40],
            getLineColor: [249, 115, 22, 255],
            getLineWidth: 2.5,
            lineWidthUnits: 'pixels',
            stroked: true,
            pickable: false,
          }),
          new ScatterplotLayer({
            id: 'selected-inner',
            data: [selected],
            getPosition: (d: NetworkBus) => [d.lng, d.lat],
            getRadius: (d: NetworkBus) => voltageRadius(d.kv) * 1.4,
            getFillColor: [249, 115, 22, 255],
            getLineColor: [255, 255, 255, 255],
            getLineWidth: 2,
            lineWidthUnits: 'pixels',
            stroked: true,
            pickable: false,
          }),
        );
      }
    }

    return out;
  }, [buses.data, branches.data, dcLines.data, selectedId]);

  const isLoading = buses.loading || branches.loading || dcLines.loading;
  const error = buses.error || branches.error || dcLines.error;
  const hoveredBus = hoverInfo?.object as NetworkBus | undefined;

  return (
    <div className="-mx-6 -my-8 h-[calc(100vh-65px)] sm:-mx-8">
      <div className="flex h-full border-t border-border">
        <div className="relative flex-1 bg-bg-subtle">
          <DeckGL
            initialViewState={INITIAL_VIEW}
            controller={true}
            layers={layers as never[]}
          >
            <Map mapStyle={theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT} />
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
            </div>
          </div>

          {hoveredBus && hoverInfo && (
            <div
              className="pointer-events-none absolute z-10 border border-border bg-bg-elev px-3 py-2 font-mono text-[10px]"
              style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
            >
              <div className="font-bold text-fg">#{String(hoveredBus.id).padStart(3, '0')}</div>
              <div className="text-fg-muted">
                {hoveredBus.name_en} · {Math.round(hoveredBus.kv)} kV
              </div>
            </div>
          )}
        </div>

        <aside className="hidden w-[360px] flex-col border-l border-border bg-bg lg:flex">
          <div className="border-b border-border bg-bg-subtle p-5">
            <span className="bg-fg px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-bg">
              Node_Inspector
            </span>
            <h2 className="mt-3 font-serif text-2xl italic uppercase leading-none tracking-tight text-fg">
              Terminal
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              Select node for deep scan
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedBus ? (
              <BusDetail
                bus={selectedBus}
                branches={relatedBranches}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <BusList buses={buses.data ?? []} onSelect={setSelectedId} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const BusDetail = ({
  bus,
  branches,
  onClose,
}: {
  bus: NetworkBus;
  branches: NetworkBranch[];
  onClose: () => void;
}) => (
  <div className="space-y-6 p-5">
    <div className="flex items-start justify-between">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
          Node_Identifier
        </div>
        <h3 className="mt-1 font-mono text-3xl font-bold tracking-tight text-fg tabular-nums">
          #{String(bus.id).padStart(3, '0')}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="border border-border p-1.5 text-fg transition-colors hover:bg-fg hover:text-bg"
      >
        <ChevronRight size={14} />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-px border border-border bg-border">
      <Cell label="Designation" colSpan={2}>
        <span className="font-serif text-lg italic">
          {bus.name_en} / {bus.name_kr}
        </span>
      </Cell>
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
      <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg">
        Branches ({branches.length})
      </div>
      <div className="border-t border-border">
        {branches.map((br, i) => {
          const other = br.from_id === bus.id ? br.to_id : br.from_id;
          return (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border/50 py-2.5"
            >
              <div className="flex items-center gap-3">
                <CornerDownRight size={12} className="text-fg-subtle" />
                <span className="font-mono text-[11px] text-fg">
                  → #{String(other).padStart(3, '0')}
                </span>
                <span className="font-mono text-[10px] text-fg-subtle">
                  {Math.round(br.kv)} kV
                </span>
              </div>
              <span className="bg-bg-subtle px-2 py-0.5 font-mono text-[10px] text-fg-muted">
                {toDisplay(br.rate_mva, { grouping: true })} MVA
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
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

const BusList = ({
  buses,
  onSelect,
}: {
  buses: NetworkBus[];
  onSelect: (id: number) => void;
}) => (
  <div>
    <div className="sticky top-0 z-10 grid grid-cols-[40px_1fr_60px] border-b border-border bg-bg-subtle px-5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
      <span>ID</span>
      <span>Name</span>
      <span className="text-right">kV</span>
    </div>
    {buses.map((bus) => (
      <button
        key={bus.id}
        onClick={() => onSelect(bus.id)}
        className="grid w-full grid-cols-[40px_1fr_60px] items-center border-b border-border/30 px-5 py-2 text-left transition-colors hover:bg-fg hover:text-bg"
      >
        <span className="font-mono text-[10px] text-fg-subtle">
          {String(bus.id).padStart(3, '0')}
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-tight">
          {bus.name_en}
        </span>
        <span className="text-right font-mono text-xs tabular-nums text-fg-muted">
          {Math.round(bus.kv)}
        </span>
      </button>
    ))}
  </div>
);
