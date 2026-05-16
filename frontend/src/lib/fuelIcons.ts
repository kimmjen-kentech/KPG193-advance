/**
 * 연료별 SVG 아이콘 — IEC 60617 기반 픽토그램.
 * deck.gl IconLayer / 범례 / 패널 등에 재사용.
 */
import { FUEL_COLORS_HEX } from './constants';

type Fuel = 'coal' | 'lng' | 'nuclear' | 'solar' | 'wind' | 'hydro';

const ICON_SIZE = 32;

const wrapCircle = (fill: string, body: string) => `
<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="13" fill="${fill}" fill-opacity="0.18" stroke="${fill}" stroke-width="1.5"/>
  ${body}
</svg>`.trim();

const SVG: Record<Fuel, string> = {
  nuclear: wrapCircle(
    FUEL_COLORS_HEX.nuclear,
    `<circle cx="16" cy="16" r="2.5" fill="${FUEL_COLORS_HEX.nuclear}"/>
     <ellipse cx="16" cy="16" rx="8" ry="4" fill="none" stroke="${FUEL_COLORS_HEX.nuclear}" stroke-width="1"/>
     <ellipse cx="16" cy="16" rx="8" ry="4" fill="none" stroke="${FUEL_COLORS_HEX.nuclear}" stroke-width="1" transform="rotate(60 16 16)"/>
     <ellipse cx="16" cy="16" rx="8" ry="4" fill="none" stroke="${FUEL_COLORS_HEX.nuclear}" stroke-width="1" transform="rotate(120 16 16)"/>`,
  ),
  coal: wrapCircle(
    FUEL_COLORS_HEX.coal,
    `<path d="M16 8 C14 12, 10 14, 12 20 C13 22, 15 24, 16 24 C17 24, 19 22, 20 20 C22 14, 18 12, 16 8Z" fill="${FUEL_COLORS_HEX.coal}" fill-opacity="0.7"/>`,
  ),
  lng: wrapCircle(
    FUEL_COLORS_HEX.lng,
    `<path d="M16 9 C14 13, 11 15, 13 20 C14 22, 16 23, 16 23 C16 23, 18 22, 19 20 C21 15, 18 13, 16 9Z" fill="${FUEL_COLORS_HEX.lng}" fill-opacity="0.7"/>
     <path d="M16 13 C15 15, 14 16, 15 19 C15.5 20, 16 20.5, 16 20.5 C16 20.5, 16.5 20, 17 19 C18 16, 17 15, 16 13Z" fill="#ffffff" fill-opacity="0.6"/>`,
  ),
  solar: wrapCircle(
    FUEL_COLORS_HEX.solar,
    `<circle cx="16" cy="16" r="5" fill="${FUEL_COLORS_HEX.solar}" fill-opacity="0.8"/>
     <g stroke="${FUEL_COLORS_HEX.solar}" stroke-width="1.6" stroke-linecap="round">
       <line x1="16" y1="6" x2="16" y2="3"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(45 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(90 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(135 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(180 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(225 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(270 16 16)"/>
       <line x1="16" y1="6" x2="16" y2="3" transform="rotate(315 16 16)"/>
     </g>`,
  ),
  wind: wrapCircle(
    FUEL_COLORS_HEX.wind,
    `<circle cx="16" cy="16" r="2" fill="${FUEL_COLORS_HEX.wind}"/>
     <path d="M16 16 L14 5 L18 9 Z" fill="${FUEL_COLORS_HEX.wind}" fill-opacity="0.8"/>
     <path d="M16 16 L25 21 L19 22 Z" fill="${FUEL_COLORS_HEX.wind}" fill-opacity="0.8"/>
     <path d="M16 16 L7 21 L13 22 Z" fill="${FUEL_COLORS_HEX.wind}" fill-opacity="0.8"/>`,
  ),
  hydro: wrapCircle(
    FUEL_COLORS_HEX.hydro,
    `<path d="M16 7 C16 7, 10 16, 10 19.5 C10 22.8, 12.7 25, 16 25 C19.3 25, 22 22.8, 22 19.5 C22 16, 16 7, 16 7Z" fill="${FUEL_COLORS_HEX.hydro}" fill-opacity="0.7"/>`,
  ),
};

const toDataUrl = (svg: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const FUEL_ICON_URLS: Record<Fuel, string> = Object.fromEntries(
  Object.entries(SVG).map(([k, v]) => [k, toDataUrl(v)]),
) as Record<Fuel, string>;

export const FUEL_ICON_SVG: Record<Fuel, string> = SVG;

export const getFuelIconUrl = (fuel: string): string => {
  const key = fuel.toLowerCase() as Fuel;
  return FUEL_ICON_URLS[key] ?? FUEL_ICON_URLS.coal;
};

export const FUEL_ICON_SIZE = ICON_SIZE;
