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
  highlightX?: number | null;
  'aria-label'?: string;
}

export const AreaChart = ({
  data,
  width = 800,
  height = 240,
  color = 'var(--accent)',
  fillOpacity = 0.15,
  xLabel,
  yLabel,
  highlightX = null,
  'aria-label': ariaLabel,
}: AreaChartProps) => {
  if (data.length === 0) return null;

  const padding = { top: 16, right: 24, bottom: 24, left: 48 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys);
  const yMin = 0;

  const sx = (x: number) =>
    padding.left + ((x - xMin) / Math.max(xMax - xMin, 1)) * innerW;
  const sy = (y: number) =>
    padding.top + innerH - ((y - yMin) / Math.max(yMax - yMin, 1)) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(d.x).toFixed(2)},${sy(d.y).toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePath} L${sx(xMax).toFixed(2)},${sy(yMin).toFixed(2)} L${sx(xMin).toFixed(2)},${sy(yMin).toFixed(2)} Z`;

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

      <path d={areaPath} fill={color} fillOpacity={fillOpacity} />
      <path d={linePath} stroke={color} strokeWidth="1.4" fill="none" />

      {data.map((d, i) => {
        if (i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1) return null;
        return (
          <text
            key={i}
            x={sx(d.x)}
            y={height - 8}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="var(--fg-subtle)"
          >
            {xLabel ? xLabel(d.x) : d.x}
          </text>
        );
      })}

      {highlightX !== null && (
        <g>
          <line
            x1={sx(highlightX)}
            x2={sx(highlightX)}
            y1={padding.top}
            y2={height - padding.bottom}
            stroke="var(--fg)"
            strokeWidth="0.6"
            strokeDasharray="2 3"
          />
        </g>
      )}
    </svg>
  );
};
