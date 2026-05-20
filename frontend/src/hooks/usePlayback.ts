import { useEffect, useRef, useState } from 'react';

interface UsePlaybackOpts {
  min: number;
  max: number;
  step?: number;        // x units per tick
  intervalMs?: number;  // ms between ticks
  loop?: boolean;
}

/**
 * 차트 시간축 재생 훅. 단순한 requestAnimationFrame 기반 카운터.
 */
export const usePlayback = ({
  min,
  max,
  step = 0.5,
  intervalMs = 50,
  loop = true,
}: UsePlaybackOpts) => {
  const [time, setTime] = useState(min);
  const [playing, setPlaying] = useState(false);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const dt = now - lastRef.current;
      if (dt >= intervalMs) {
        setTime((prev) => {
          const next = prev + step;
          if (next >= max) {
            if (loop) return min;
            setPlaying(false);
            return max;
          }
          return next;
        });
        lastRef.current = now;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing, step, intervalMs, min, max, loop]);

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const toggle = () => setPlaying((p) => !p);
  const reset = () => {
    setPlaying(false);
    setTime(min);
  };
  const seek = (t: number) => setTime(Math.max(min, Math.min(max, t)));

  return { time, playing, play, pause, toggle, reset, seek };
};
