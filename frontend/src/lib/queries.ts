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
  SELECT 'solar' AS fuel, SUM("Pmax [MW]")::VARCHAR AS mw FROM '${u('capacity_solar')}'
  UNION ALL
  SELECT 'wind',  SUM("Pmax [MW]")::VARCHAR FROM '${u('capacity_wind')}'
  UNION ALL
  SELECT 'hydro', SUM("Pmax [MW]")::VARCHAR FROM '${u('capacity_hydro')}'
  UNION ALL
  SELECT 'thermal', SUM(Pmax)::VARCHAR FROM '${u('generators')}'
`;

export interface GenerationMixRow {
  fuel: 'solar' | 'wind' | 'hydro' | 'thermal';
  mw: string;
}
