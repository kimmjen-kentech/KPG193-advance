import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PlaybackControlsProps {
  playing: boolean;
  time: number;
  min: number;
  max: number;
  unit?: string;
  onToggle: () => void;
  onReset: () => void;
  onSeek: (t: number) => void;
}

export const PlaybackControls = ({
  playing,
  time,
  min,
  max,
  unit = 's',
  onToggle,
  onReset,
  onSeek,
}: PlaybackControlsProps) => (
  <div className="flex items-center gap-3 border border-border bg-bg p-2">
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pause' : 'Play'}
      className={cn(
        'flex h-7 w-7 items-center justify-center border transition-colors',
        playing
          ? 'border-fg bg-fg text-bg'
          : 'border-border text-fg hover:bg-bg-subtle',
      )}
    >
      {playing ? <Pause size={12} /> : <Play size={12} />}
    </button>
    <button
      type="button"
      onClick={onReset}
      aria-label="Reset"
      className="flex h-7 w-7 items-center justify-center border border-border text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
    >
      <RotateCcw size={12} />
    </button>
    <input
      type="range"
      min={min}
      max={max}
      step={0.1}
      value={time}
      onChange={(e) => onSeek(parseFloat(e.target.value))}
      className="flex-1 accent-[var(--accent)]"
      aria-label="Time scrub"
    />
    <span className="min-w-[52px] text-right font-mono text-[10px] tabular-nums text-fg">
      t = {time.toFixed(1)}
      {unit}
    </span>
  </div>
);
