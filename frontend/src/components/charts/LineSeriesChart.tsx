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

export const LineSeriesChart = ({
  series,
  width = 800,
  height = 240,
  xLabel,
  yLabel,
  yMax: yMaxOverride,
  yMin: yMinOverride,
  xTicks,
  showLegend = false,
  vLine,
  'aria-label': ariaLabel,
}: LineSeriesChartProps) => {
  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length === 0) return null;

  const padding = { top: 16, right: 24, bottom: 24, left: 52 };
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

  const renderedXTicks =
    xTicks ?? Array.from({ length: 7 }, (_, i) => xMin + ((xMax - xMin) * i) / 6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {/* y grid + labels */}
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

      {/* vertical reference line */}
      {vLine && (
        <g>
          <line
            x1={sx(vLine.x)}
            x2={sx(vLine.x)}
            y1={padding.top}
            y2={padding.top + innerH}
            stroke="var(--fg-subtle)"
            strokeWidth="0.8"
            strokeDasharray="4 3"
          />
          {vLine.label && (
            <text
              x={sx(vLine.x) + 4}
              y={padding.top + 10}
              fontFamily="JetBrains Mono, monospace"
              fontSize="8"
              fill="var(--fg-subtle)"
            >
              {vLine.label}
            </text>
          )}
        </g>
      )}

      {/* series: area fill + line */}
      {series.map((s) => {
        const linePath = s.points
          .map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(d.x).toFixed(2)},${sy(d.y).toFixed(2)}`)
          .join(' ');

        if (s.fill && s.points.length > 1) {
          const first = s.points[0];
          const last = s.points[s.points.length - 1];
          const areaPath = `${linePath} L${sx(last.x).toFixed(2)},${sy(yMin).toFixed(2)} L${sx(first.x).toFixed(2)},${sy(yMin).toFixed(2)} Z`;
          return (
            <g key={s.name}>
              <path d={areaPath} fill={s.color} opacity={0.12} stroke="none" />
              <path
                d={linePath}
                stroke={s.color}
                strokeWidth="1.8"
                fill="none"
                strokeLinejoin="round"
              />
            </g>
          );
        }

        return (
          <path
            key={s.name}
            d={linePath}
            stroke={s.color}
            strokeWidth="1.8"
            fill="none"
            strokeLinejoin="round"
            strokeDasharray={s.strokeDasharray}
          />
        );
      })}

      {/* x axis labels */}
      {renderedXTicks.map((v, i) => (
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
      ))}

      {/* inline legend */}
      {showLegend && series.length > 0 && (
        <g>
          {series.map((s, i) => {
            const lx = width - padding.right - 4;
            const ly = padding.top + 6 + i * 14;
            return (
              <g key={s.name}>
                <line
                  x1={lx - 18}
                  y1={ly}
                  x2={lx}
                  y2={ly}
                  stroke={s.color}
                  strokeWidth="1.8"
                />
                <text
                  x={lx - 22}
                  y={ly + 4}
                  textAnchor="end"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8"
                  fill="var(--fg-subtle)"
                >
                  {s.name}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
