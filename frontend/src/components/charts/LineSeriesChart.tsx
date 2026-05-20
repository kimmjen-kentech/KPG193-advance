import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface Series {
  name: string;
  color: string;
  points: { x: number; y: number }[];
  fill?: boolean;
  strokeDasharray?: string;
}

interface LineSeriesChartProps {
  series: Series[];
  width?: number;
  height?: number;
  xLabel?: (x: number) => string;
  yLabel?: (y: number) => string;
  yMax?: number;
  yMin?: number;
  xTicks?: number[];
  showLegend?: boolean;
  vLine?: { x: number; label?: string };
  'aria-label'?: string;
}

/**
 * Recharts 기반 다중 시리즈 라인/영역 차트.
 * Recharts는 시리즈별 데이터가 아닌 row 기반이라 wide format으로 머지.
 */
export const LineSeriesChart = ({
  series,
  height = 240,
  xLabel,
  yLabel,
  yMax,
  yMin = 0,
  xTicks,
  showLegend = false,
  vLine,
  'aria-label': ariaLabel,
}: LineSeriesChartProps) => {
  // 시리즈를 wide format으로 머지: [{x, series1: y1, series2: y2}, ...]
  const data = useMemo(() => {
    const map = new Map<number, Record<string, number>>();
    for (const s of series) {
      for (const p of s.points) {
        const row = map.get(p.x) ?? { x: p.x };
        row[s.name] = p.y;
        map.set(p.x, row);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.x - b.x);
  }, [series]);

  if (data.length === 0) return null;

  const computedYMax =
    yMax ?? Math.max(...series.flatMap((s) => s.points.map((p) => p.y)), 0.01);

  return (
    <div className="h-full w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeWidth={0.5} vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[Math.min(...data.map((d) => d.x)), Math.max(...data.map((d) => d.x))]}
            ticks={xTicks}
            tickFormatter={xLabel}
            tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: 'var(--fg-subtle)' }}
            stroke="var(--border)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[yMin, computedYMax]}
            tickFormatter={yLabel}
            tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: 'var(--fg-subtle)' }}
            stroke="var(--border)"
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            content={
              <ChartTooltip
                xFormatter={xLabel}
                yFormatter={yLabel}
              />
            }
            cursor={{ stroke: 'var(--fg-subtle)', strokeWidth: 0.6, strokeDasharray: '3 3' }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: 'var(--fg-subtle)',
              }}
              iconType="plainline"
              iconSize={14}
            />
          )}
          {vLine && (
            <ReferenceLine
              x={vLine.x}
              stroke="var(--fg-subtle)"
              strokeDasharray="4 3"
              strokeWidth={0.8}
              label={
                vLine.label
                  ? {
                      value: vLine.label,
                      position: 'insideTopRight',
                      fill: 'var(--fg-subtle)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9,
                    }
                  : undefined
              }
            />
          )}
          {series.map((s) =>
            s.fill ? (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={1.8}
                fill={s.color}
                fillOpacity={0.12}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: s.color }}
                isAnimationActive={false}
              />
            ) : (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={1.8}
                strokeDasharray={s.strokeDasharray}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: s.color }}
                isAnimationActive={false}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
