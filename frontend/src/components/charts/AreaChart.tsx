import {
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface Point {
  x: number;
  y: number;
}

interface AreaChartProps {
  data: Point[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  xLabel?: (x: number) => string;
  yLabel?: (y: number) => string;
  xTicks?: number[];
  highlightX?: number | null;
  'aria-label'?: string;
}

export const AreaChart = ({
  data,
  height = 240,
  color = 'var(--accent)',
  fillOpacity = 0.15,
  xLabel,
  yLabel,
  xTicks,
  highlightX = null,
  'aria-label': ariaLabel,
}: AreaChartProps) => {
  if (data.length === 0) return null;

  const xMin = Math.min(...data.map((d) => d.x));
  const xMax = Math.max(...data.map((d) => d.x));

  return (
    <div className="h-full w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={data} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeWidth={0.5} vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin, xMax]}
            ticks={xTicks}
            tickFormatter={xLabel}
            tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: 'var(--fg-subtle)' }}
            stroke="var(--border)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
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
          {highlightX !== null && (
            <ReferenceLine
              x={highlightX}
              stroke="var(--fg)"
              strokeDasharray="2 3"
              strokeWidth={0.6}
            />
          )}
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={1.4}
            fill={color}
            fillOpacity={fillOpacity}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: color }}
            isAnimationActive={false}
          />
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
