import { useMemo, useState } from 'react';
import { Activity, Sun, Flame, CloudRain, X } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import {
  profileDemandSQL,
  profileRenewablesSQL,
  commitmentByFuelSQL,
  profileWeatherSQL,
  busListSQL,
  type ProfileDemandRow,
  type ProfileRenewablesRow,
  type CommitmentByFuelRow,
  type ProfileWeatherRow,
  type BusListRow,
} from '../lib/queries';
import { AreaChart } from '../components/charts/AreaChart';
import { LineSeriesChart } from '../components/charts/LineSeriesChart';
import { FUEL_COLORS_HEX, FUEL_LABELS } from '../lib/constants';
import { formatByMode } from '../utils/decimal';
import { Skeleton } from '../components/ui/Skeleton';
import { useI18n } from '../hooks/useI18n';
import { useDecimal } from '../hooks/useDecimal';

const dayToDate = (day: number): string => {
  const d = new Date(2022, 0, 1);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MONTH_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export const ProfilesPage = () => {
  const { t } = useI18n();
  const { mode: decimalMode } = useDecimal();
  const [day, setDay] = useState(1);
  const [busId, setBusId] = useState<number | null>(null);

  const busList = useQuery<BusListRow>(busListSQL);
  const demand = useQuery<ProfileDemandRow>(profileDemandSQL(day, busId));
  const renewables = useQuery<ProfileRenewablesRow>(profileRenewablesSQL(day, busId));
  const commitment = useQuery<CommitmentByFuelRow>(commitmentByFuelSQL(day, busId));
  const weather = useQuery<ProfileWeatherRow>(profileWeatherSQL(day, busId));

  const selectedBus = useMemo(
    () => busList.data?.find((b) => b.id === busId) ?? null,
    [busList.data, busId],
  );

  const demandPoints = useMemo(
    () => demand.data?.map((d) => ({ x: d.hour, y: d.total_mw })) ?? [],
    [demand.data],
  );

  const peak = useMemo(() => {
    if (!demand.data || demand.data.length === 0) return null;
    return demand.data.reduce((a, b) => (a.total_mw > b.total_mw ? a : b));
  }, [demand.data]);

  const renewableSeries = useMemo(() => {
    if (!renewables.data) return [];
    return [
      {
        name: 'solar',
        color: FUEL_COLORS_HEX.solar,
        fill: true,
        points: renewables.data.map((d) => ({ x: d.hour, y: d.solar })),
      },
      {
        name: 'wind',
        color: FUEL_COLORS_HEX.wind,
        fill: true,
        points: renewables.data.map((d) => ({ x: d.hour, y: d.wind })),
      },
      {
        name: 'hydro',
        color: FUEL_COLORS_HEX.hydro,
        fill: true,
        points: renewables.data.map((d) => ({ x: d.hour, y: d.hydro })),
      },
    ];
  }, [renewables.data]);

  const commitmentSeries = useMemo(() => {
    if (!commitment.data) return [];
    const fuels: Array<'coal' | 'lng' | 'nuclear'> = ['nuclear', 'coal', 'lng'];
    return fuels.map((fuel) => ({
      name: fuel,
      color: FUEL_COLORS_HEX[fuel],
      points: commitment.data!
        .filter((r) => r.fuel === fuel)
        .map((r) => ({ x: r.hour, y: r.capacity_on_mw })),
    }));
  }, [commitment.data]);

  const weatherSeries = useMemo(() => {
    if (!weather.data) return { temp: [], wind: [] };
    return {
      temp: [{ name: 'temp', color: '#f97316', points: weather.data.map((d) => ({ x: d.hour, y: d.temp_c })) }],
      wind: [{ name: 'wind', color: '#38bdf8', points: weather.data.map((d) => ({ x: d.hour, y: d.wind_speed })) }],
    };
  }, [weather.data]);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {t.profiles.label}
        </span>
        <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
          {t.profiles.title}
        </h1>
        <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
          {t.profiles.tagline}
        </p>
      </header>

      <section className="grid items-stretch gap-3 lg:grid-cols-[320px_1fr]">
        <div className="border border-border bg-bg-elev p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                {t.profiles.scope}
              </div>
              <div className="mt-1 font-mono text-base font-bold text-fg">
                {selectedBus
                  ? `#${String(selectedBus.id).padStart(3, '0')}. ${selectedBus.name_kr}`
                  : t.profiles.systemWide}
              </div>
              {selectedBus && (
                <div className="mt-0.5 font-mono text-[10px] text-fg-muted">
                  {selectedBus.name_en}
                </div>
              )}
            </div>
            {busId !== null && (
              <button
                onClick={() => setBusId(null)}
                className="border border-border p-1.5 text-fg-muted transition-colors hover:bg-fg hover:text-bg"
                title={t.profiles.clearFilter}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <label htmlFor="bus-select" className="sr-only">{t.profiles.scope}</label>
          <select
            id="bus-select"
            value={busId ?? ''}
            onChange={(e) => setBusId(e.target.value === '' ? null : parseInt(e.target.value))}
            className="mt-4 w-full border border-border bg-bg p-2 font-mono text-xs text-fg"
          >
            <option value="">{t.profiles.allBuses}</option>
            {busList.data?.map((b) => (
              <option key={b.id} value={b.id}>
                #{String(b.id).padStart(3, '0')}. {b.name_kr} / {b.name_en}
              </option>
            ))}
          </select>
        </div>

      <div className="space-y-4 border border-border bg-bg-elev p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
              {t.profiles.selectedDay}
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold tabular-nums text-fg">
                {String(day).padStart(3, '0')}
              </span>
              <span className="font-serif text-xl italic text-fg-muted">
                {dayToDate(day)} · 2022
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-1 sm:gap-1.5">
            <button
              aria-label="Go to first day"
              onClick={() => setDay(1)}
              className="hidden sm:inline-flex border border-border bg-bg px-2.5 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg"
            >
              ◀◀
            </button>
            <button
              aria-label="Go back 7 days"
              onClick={() => setDay(Math.max(1, day - 7))}
              className="border border-border bg-bg px-2 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg sm:px-2.5"
            >
              −7
            </button>
            <button
              aria-label="Go back 1 day"
              onClick={() => setDay(Math.max(1, day - 1))}
              className="border border-border bg-bg px-2 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg sm:px-2.5"
            >
              −1
            </button>
            <button
              aria-label="Go forward 1 day"
              onClick={() => setDay(Math.min(365, day + 1))}
              className="border border-border bg-bg px-2 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg sm:px-2.5"
            >
              +1
            </button>
            <button
              aria-label="Go forward 7 days"
              onClick={() => setDay(Math.min(365, day + 7))}
              className="border border-border bg-bg px-2 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg sm:px-2.5"
            >
              +7
            </button>
            <button
              aria-label="Go to last day"
              onClick={() => setDay(365)}
              className="hidden sm:inline-flex border border-border bg-bg px-2.5 py-1 font-mono text-[10px] text-fg-muted transition-colors hover:bg-fg hover:text-bg"
            >
              ▶▶
            </button>
          </div>
        </div>

        <div className="pt-3">
          <input
            type="range"
            min={1}
            max={365}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-fg-subtle">
            {MONTH_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className="cursor-pointer hover:text-fg"
              >
                {dayToDate(d).split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        </div>
      </section>

      <ChartCard
        number="01"
        title={t.profiles.systemDemand}
        icon={Activity}
        right={
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {t.profiles.peak}
            </div>
            <div className="font-mono text-sm tabular-nums text-fg">
              {peak ? (
                <>
                  {formatByMode(peak.total_exact, decimalMode, { grouping: true })} MW @ {peak.hour}:00
                </>
              ) : (
                <Skeleton className="h-4 w-32" />
              )}
            </div>
          </div>
        }
      >
        <div className="h-64 w-full">
          {demand.loading && <ChartPending />}
          {demand.error && <QueryError message={demand.error.message} />}
          {demand.data && (
            <AreaChart
              data={demandPoints}
              xLabel={(x) => `${x}h`}
              yLabel={(y) => `${(y / 1000).toFixed(0)}k`}
              highlightX={peak?.hour ?? null}
            />
          )}
        </div>
      </ChartCard>

      <ChartCard
        number="02"
        title={t.profiles.renewableCF}
        icon={Sun}
        right={
          <LegendInline
            items={[
              ['solar', FUEL_COLORS_HEX.solar],
              ['wind', FUEL_COLORS_HEX.wind],
              ['hydro', FUEL_COLORS_HEX.hydro],
            ]}
          />
        }
      >
        <div className="h-64 w-full">
          {renewables.loading && <ChartPending />}
          {renewables.error && <QueryError message={renewables.error.message} />}
          {renewables.data && (
            <LineSeriesChart
              series={renewableSeries}
              xTicks={[1, 4, 8, 12, 16, 20, 24]}
              xLabel={(x) => `${x}h`}
              yLabel={(y) => y.toFixed(2)}
              yMax={1}
            />
          )}
        </div>
      </ChartCard>

      <ChartCard
        number="03"
        title={`${t.profiles.thermalCommit}${busId === null ? t.profiles.thermalCommitSystem : ''}`}
        icon={Flame}
        right={
          <LegendInline
            items={[
              ['nuclear', FUEL_COLORS_HEX.nuclear],
              ['coal', FUEL_COLORS_HEX.coal],
              ['lng', FUEL_COLORS_HEX.lng],
            ]}
          />
        }
      >
        <div className="h-64 w-full">
          {commitment.loading && <ChartPending />}
          {commitment.error && <QueryError message={commitment.error.message} />}
          {commitment.data && commitment.data.length > 0 && (
            <LineSeriesChart
              series={commitmentSeries}
              xTicks={[1, 4, 8, 12, 16, 20, 24]}
              xLabel={(x) => `${x}h`}
              yLabel={(y) => `${(y / 1000).toFixed(1)}k`}
            />
          )}
          {commitment.data && commitment.data.length === 0 && (
            <div className="flex h-full items-center justify-center font-mono text-[11px] text-fg-subtle">
              {t.profiles.noCommitData}
            </div>
          )}
        </div>
      </ChartCard>

      <ChartCard
        number="04"
        title={t.profiles.weatherSection}
        icon={CloudRain}
        right={
          <LegendInline
            items={[
              [t.profiles.temperature, '#f97316'],
              [t.profiles.windSpeed, '#38bdf8'],
            ]}
          />
        }
      >
        <div className="space-y-4">
          <div className="h-40 w-full">
            {weather.loading && <ChartPending />}
            {weather.error && <QueryError message={weather.error.message} />}
            {weather.data && weather.data.length > 0 && (
              <LineSeriesChart
                series={weatherSeries.temp}
                xTicks={[1, 4, 8, 12, 16, 20, 24]}
                xLabel={(x) => `${x}h`}
                yLabel={(y) => `${y.toFixed(1)}°C`}
              />
            )}
            {weather.data && weather.data.length === 0 && (
              <div className="flex h-full items-center justify-center font-mono text-[11px] text-fg-subtle">
                {t.profiles.noWeatherData}
              </div>
            )}
          </div>
          <div className="h-40 w-full">
            {weather.data && weather.data.length > 0 && (
              <LineSeriesChart
                series={weatherSeries.wind}
                xTicks={[1, 4, 8, 12, 16, 20, 24]}
                xLabel={(x) => `${x}h`}
                yLabel={(y) => `${y.toFixed(1)} m/s`}
              />
            )}
          </div>
        </div>
      </ChartCard>

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
        {t.profiles.dataSource}
      </p>
    </div>
  );
};

const ChartCard = ({
  number,
  title,
  icon: Icon,
  right,
  children,
}: {
  number: string;
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="space-y-3 border border-border bg-bg-elev p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center bg-fg font-mono text-[10px] font-bold text-bg">
          {number}
        </span>
        <Icon size={14} strokeWidth={1.6} className="text-fg-subtle" />
        <h3 className="font-serif text-xl italic text-fg">{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </section>
);

const LegendInline = ({ items }: { items: [string, string][] }) => (
  <div className="flex gap-4">
    {items.map(([name, color]) => (
      <div key={name} className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-3"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          {FUEL_LABELS[name] ?? name}
        </span>
      </div>
    ))}
  </div>
);

const ChartPending = () => (
  <div className="flex h-full flex-col gap-2 py-3">
    <Skeleton className="h-full w-full" />
  </div>
);

const QueryError = ({ message }: { message: string }) => (
  <div className="flex h-full items-center justify-center font-mono text-[11px] text-[#ef4444]">
    {message}
  </div>
);
