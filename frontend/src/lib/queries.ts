import { parquetUrl } from './duckdb';

const u = parquetUrl;

export const overviewKpiSQL = `
  SELECT
    (SELECT COUNT(*) FROM '${u('buses')}')::INTEGER AS bus_count,
    (SELECT COUNT(*) FROM '${u('generators')}')::INTEGER AS gen_count,
    (SELECT COUNT(*) FROM '${u('branches')}')::INTEGER AS branch_count,
    (SELECT COUNT(*) FROM '${u('dc_lines')}')::INTEGER AS dc_count,
    (SELECT SUM("Pmax [MW]") FROM '${u('capacity_solar')}')::VARCHAR AS solar_mw,
    (SELECT SUM("Pmax [MW]") FROM '${u('capacity_wind')}')::VARCHAR AS wind_mw,
    (SELECT SUM("Pmax [MW]") FROM '${u('capacity_hydro')}')::VARCHAR AS hydro_mw,
    (SELECT SUM(Pmax) FROM '${u('generators')}')::VARCHAR AS thermal_mw
`;

export interface OverviewKpi {
  bus_count: number;
  gen_count: number;
  branch_count: number;
  dc_count: number;
  solar_mw: string;
  wind_mw: string;
  hydro_mw: string;
  thermal_mw: string;
}

export const generationMixSQL = `
  SELECT fuel, SUM(Pmax)::VARCHAR AS mw
  FROM '${u('generators')}'
  GROUP BY fuel
  UNION ALL
  SELECT 'solar' AS fuel, SUM("Pmax [MW]")::VARCHAR FROM '${u('capacity_solar')}'
  UNION ALL
  SELECT 'wind',  SUM("Pmax [MW]")::VARCHAR FROM '${u('capacity_wind')}'
  UNION ALL
  SELECT 'hydro', SUM("Pmax [MW]")::VARCHAR FROM '${u('capacity_hydro')}'
`;

export interface GenerationMixRow {
  fuel: 'coal' | 'lng' | 'nuclear' | 'solar' | 'wind' | 'hydro';
  mw: string;
}

export const networkBusesSQL = `
  SELECT
    loc.bus_id::INTEGER AS id,
    loc.Latitude::DOUBLE AS lat,
    loc.Longitude::DOUBLE AS lng,
    loc.name_Korean AS name_kr,
    loc.name_English AS name_en,
    b.baseKV::DOUBLE AS kv,
    b.area::INTEGER AS area,
    b.Pd::VARCHAR AS pd,
    b.Qd::VARCHAR AS qd
  FROM '${u('bus_location')}' loc
  JOIN '${u('buses')}' b ON loc.bus_id = b.bus_i
  ORDER BY id
`;

export interface NetworkBus {
  id: number;
  lat: number;
  lng: number;
  name_kr: string;
  name_en: string;
  kv: number;
  area: number;
  pd: string;
  qd: string;
}

export const networkBranchesSQL = `
  SELECT
    b.fbus::INTEGER AS from_id,
    b.tbus::INTEGER AS to_id,
    f.Latitude::DOUBLE AS from_lat,
    f.Longitude::DOUBLE AS from_lng,
    t.Latitude::DOUBLE AS to_lat,
    t.Longitude::DOUBLE AS to_lng,
    GREATEST(fb.baseKV, tb.baseKV)::DOUBLE AS kv,
    b.rateA::VARCHAR AS rate_mva
  FROM '${u('branches')}' b
  JOIN '${u('bus_location')}' f ON b.fbus = f.bus_id
  JOIN '${u('bus_location')}' t ON b.tbus = t.bus_id
  JOIN '${u('buses')}' fb ON b.fbus = fb.bus_i
  JOIN '${u('buses')}' tb ON b.tbus = tb.bus_i
`;

export interface NetworkBranch {
  from_id: number;
  to_id: number;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  kv: number;
  rate_mva: string;
}

export const networkDcLinesSQL = `
  SELECT
    d.fbus::INTEGER AS from_id,
    d.tbus::INTEGER AS to_id,
    f.Latitude::DOUBLE AS from_lat,
    f.Longitude::DOUBLE AS from_lng,
    t.Latitude::DOUBLE AS to_lat,
    t.Longitude::DOUBLE AS to_lng,
    d.Pmax::VARCHAR AS p_max
  FROM '${u('dc_lines')}' d
  JOIN '${u('bus_location')}' f ON d.fbus = f.bus_id
  JOIN '${u('bus_location')}' t ON d.tbus = t.bus_id
`;

export interface NetworkDcLine {
  from_id: number;
  to_id: number;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  p_max: string;
}
