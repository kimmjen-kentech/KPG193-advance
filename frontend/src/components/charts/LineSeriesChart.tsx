interface Series {
  name: string;
  color: string;
  points: { x: number; y: number }[];
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
  'aria-label'?: string;
}

export const LineSeriesChart = ({
  series,
  width = 800,
  height = 240,
  xLabel,
  yLabel,
  yMax: yMaxOverride,
  yMin: yMinOverride,
  xTicks,
  'aria-label': ariaLabel,
}: LineSeriesChartProps) => {
  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length === 0) return null;

  const padding = { top: 16, right: 24, bottom: 24, left: 48 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xs = allPoints.map((d) => d.x);
  const ys = allPoints.map((d) => d.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = yMaxOverride ?? Math.max(...ys, 0.01);
  const yMin = yMinOverride ?? 0;

  const sx = (x: number) =>
    padding.left + ((x - xMin) / Math.max(xMax - xMin, 1e-9)) * innerW;
  const sy = (y: number) =>
    padding.top + innerH - ((y - yMin) / Math.max(yMax - yMin, 1e-9)) * innerH;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / yTicks,
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={ariaLabel}>
      {yTickValues.map((v, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={sy(v)}
            y2={sy(v)}
            stroke="var(--border)"
            strokeWidth="0.5"
          />
          {yLabel && (
            <text
              x={padding.left - 6}
              y={sy(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="var(--fg-subtle)"
            >
              {yLabel(v)}
            </text>
          )}
        </g>
      ))}

      {series.map((s) => {
        const path = s.points
          .map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(d.x).toFixed(2)},${sy(d.y).toFixed(2)}`)
          .join(' ');
        return (
          <path
            key={s.name}
            d={path}
            stroke={s.color}
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
        );
      })}

      {(xTicks ?? Array.from({ length: 7 }, (_, i) => xMin + ((xMax - xMin) * i) / 6)).map(
        (v, i) => (
          <text
            key={i}
            x={sx(v)}
            y={height - 8}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="var(--fg-subtle)"
          >
            {xLabel ? xLabel(v) : v}
          </text>
        ),
      )}
    </svg>
  );
};
