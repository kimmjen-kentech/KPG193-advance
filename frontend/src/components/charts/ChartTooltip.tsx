interface PayloadEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string | number;
  xFormatter?: (x: number) => string;
  yFormatter?: (y: number) => string;
}

/**
 * 우리 에디토리얼 톤에 맞춘 Recharts 호버 툴팁.
 * 헤어라인 보더 + JetBrains Mono + bg-elev.
 */
export const ChartTooltip = ({
  active,
  payload,
  label,
  xFormatter,
  yFormatter,
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="border border-border bg-bg-elev px-3 py-2 font-mono text-[10px] shadow-md">
      {label !== undefined && (
        <div className="mb-1 font-bold text-fg">
          {xFormatter ? xFormatter(Number(label)) : label}
        </div>
      )}
      <div className="space-y-0.5">
        {payload.map((entry, i) => (
          <div key={`${entry.name}-${i}`} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-fg-muted">{entry.name}</span>
            <span className="ml-auto tabular-nums text-fg">
              {yFormatter && typeof entry.value === 'number'
                ? yFormatter(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
