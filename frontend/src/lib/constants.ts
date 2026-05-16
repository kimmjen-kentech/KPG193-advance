export const FUEL_COLORS_HEX: Record<string, string> = {
  coal: '#FF6B4A',
  lng: '#00D4FF',
  nuclear: '#A78BFA',
  solar: '#FACC15',
  wind: '#34D399',
  hydro: '#065F46',
  gas: '#00BCD4',
  oil: '#795548',
  biomass: '#8BC34A',
  waste: '#607D8B',
  tidal: '#0288D1',
  battery: '#00E676',
  biogas: '#66BB6A',
  diesel: '#A1887F',
} as const;

export const FUEL_COLORS_RGBA: Record<string, [number, number, number, number]> = {
  coal: [255, 107, 74, 200],
  lng: [0, 212, 255, 200],
  nuclear: [167, 139, 250, 200],
  solar: [255, 204, 21, 200],
  wind: [52, 211, 153, 200],
  hydro: [6, 95, 70, 200],
  gas: [0, 188, 212, 200],
  oil: [121, 85, 72, 200],
  biomass: [139, 195, 74, 200],
  waste: [96, 125, 139, 200],
  tidal: [2, 136, 209, 200],
  battery: [0, 230, 118, 200],
} as const;

export const FUEL_KEYS = ['coal', 'lng', 'nuclear', 'solar', 'wind', 'hydro'] as const;

export const FUEL_LABELS: Record<string, string> = {
  coal: 'Coal',
  lng: 'LNG',
  nuclear: 'Nuclear',
  thermal: 'Thermal',
  solar: 'Solar',
  wind: 'Wind',
  hydro: 'Hydro',
} as const;
