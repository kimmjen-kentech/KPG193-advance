import { FUEL_COLORS_HEX, FUEL_KEYS } from './constants';

export interface BusGenerationMix {
  bus_id: number;
  lat: number;
  lng: number;
  coal: number;
  lng_mw: number;
  nuclear: number;
  solar: number;
  wind: number;
  hydro: number;
  total: number;
}

const fuelValue = (mix: BusGenerationMix, key: string): number => {
  if (key === 'lng') return mix.lng_mw;
  return (mix as unknown as Record<string, number>)[key] ?? 0;
};

export const generatePieIconURL = (mix: BusGenerationMix, size: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 1;

  const segments = FUEL_KEYS.map((key) => ({ key, value: fuelValue(mix, key) })).filter(
    (s) => s.value > 0,
  );
  if (segments.length === 0 || mix.total <= 0) return '';

  let startAngle = -Math.PI / 2;
  for (const seg of segments) {
    const sliceAngle = (seg.value / mix.total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = FUEL_COLORS_HEX[seg.key];
    ctx.fill();
    startAngle += sliceAngle;
  }

  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.32, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(10, 10, 10, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  return canvas.toDataURL();
};

export interface PieIcon {
  bus_id: number;
  lat: number;
  lng: number;
  total: number;
  iconUrl: string;
  size: number;
}

export const generateAllPieIcons = (
  mixes: BusGenerationMix[],
  threshold = 50,
): PieIcon[] => {
  const significant = mixes.filter((m) => m.total >= threshold);
  if (significant.length === 0) return [];
  const maxTotal = Math.max(...significant.map((m) => m.total));

  return significant
    .map((m) => {
      const ratio = Math.sqrt(m.total / maxTotal);
      const size = Math.round(24 + ratio * 40);
      const url = generatePieIconURL(m, size * 2);
      return url
        ? { bus_id: m.bus_id, lat: m.lat, lng: m.lng, total: m.total, iconUrl: url, size }
        : null;
    })
    .filter((x): x is PieIcon => x !== null);
};
