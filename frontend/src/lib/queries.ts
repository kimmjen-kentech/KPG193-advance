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

export const networkGeneratorsSQL = `
  SELECT
    g.bus::INTEGER AS bus_id,
    g.fuel,
    g.Pmax::DOUBLE AS pmax_mw,
    g.Pmax::VARCHAR AS pmax_exact,
    loc.Latitude::DOUBLE AS lat,
    loc.Longitude::DOUBLE AS lng,
    loc.name_Korean AS name_kr,
    loc.name_English AS name_en
  FROM '${u('generators')}' g
  JOIN '${u('bus_location')}' loc ON g.bus = loc.bus_id
  WHERE g.Pmax > 0
`;

export interface NetworkGenerator {
  bus_id: number;
  fuel: 'coal' | 'lng' | 'nuclear';
  pmax_mw: number;
  pmax_exact: string;
  lat: number;
  lng: number;
  name_kr: string;
  name_en: string;
}

export const networkGenerationMixSQL = `
  WITH per_bus AS (
    SELECT bus::INTEGER AS bus_id, fuel, Pmax::DOUBLE AS mw FROM '${u('generators')}' WHERE Pmax > 0
    UNION ALL
    SELECT bus_ID::INTEGER, 'solar', "Pmax [MW]"::DOUBLE FROM '${u('capacity_solar')}' WHERE "Pmax [MW]" > 0
    UNION ALL
    SELECT bus_ID::INTEGER, 'wind',  "Pmax [MW]"::DOUBLE FROM '${u('capacity_wind')}'  WHERE "Pmax [MW]" > 0
    UNION ALL
    SELECT bus_ID::INTEGER, 'hydro', "Pmax [MW]"::DOUBLE FROM '${u('capacity_hydro')}' WHERE "Pmax [MW]" > 0
  )
  SELECT
    pb.bus_id,
    loc.Latitude::DOUBLE AS lat,
    loc.Longitude::DOUBLE AS lng,
    SUM(CASE WHEN pb.fuel = 'coal'    THEN pb.mw ELSE 0 END) AS coal,
    SUM(CASE WHEN pb.fuel = 'lng'     THEN pb.mw ELSE 0 END) AS lng_mw,
    SUM(CASE WHEN pb.fuel = 'nuclear' THEN pb.mw ELSE 0 END) AS nuclear,
    SUM(CASE WHEN pb.fuel = 'solar'   THEN pb.mw ELSE 0 END) AS solar,
    SUM(CASE WHEN pb.fuel = 'wind'    THEN pb.mw ELSE 0 END) AS wind,
    SUM(CASE WHEN pb.fuel = 'hydro'   THEN pb.mw ELSE 0 END) AS hydro,
    SUM(pb.mw) AS total
  FROM per_bus pb
  JOIN '${u('bus_location')}' loc ON pb.bus_id = loc.bus_id
  GROUP BY pb.bus_id, loc.Latitude, loc.Longitude
  HAVING SUM(pb.mw) > 0
`;

export interface NetworkBusGenMix {
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

export const profileDemandSQL = (day: number, busId: number | null = null) => `
  SELECT
    hour::INTEGER AS hour,
    SUM(demandP)::DOUBLE AS total_mw,
    SUM(demandP)::VARCHAR AS total_exact
  FROM '${u('profile_demand')}'
  WHERE day = ${day}${busId !== null ? ` AND bus_id = ${busId}` : ''}
  GROUP BY hour
  ORDER BY hour
`;

export interface ProfileDemandRow {
  hour: number;
  total_mw: number;
  total_exact: string;
}

export const profileRenewablesSQL = (day: number, busId: number | null = null) => `
  SELECT
    hour::INTEGER AS hour,
    AVG(pv_profile_ratio)::DOUBLE AS solar,
    AVG(wind_profile_ratio)::DOUBLE AS wind,
    AVG(hydro_profile_ratio)::DOUBLE AS hydro
  FROM '${u('profile_renewables')}'
  WHERE day = ${day}${busId !== null ? ` AND bus_id = ${busId}` : ''}
  GROUP BY hour
  ORDER BY hour
`;

/**
 * 365일 일별 수요 집계: 일별 피크/평균/총량.
 * profile_demand 전체(1.69M rows) 스캔이라 한 번만 실행 권장.
 */
export const annualDemandSQL = `
  WITH hourly AS (
    SELECT day, hour, SUM(demandP)::DOUBLE AS hourly_mw
    FROM '${u('profile_demand')}'
    GROUP BY day, hour
  )
  SELECT
    day::INTEGER AS day,
    MAX(hourly_mw) AS peak_mw,
    AVG(hourly_mw) AS avg_mw,
    SUM(hourly_mw) AS total_mwh
  FROM hourly
  GROUP BY day
  ORDER BY day
`;

export interface AnnualDemandRow {
  day: number;
  peak_mw: number;
  avg_mw: number;
  total_mwh: number;
}

/**
 * 365일 재생에너지 일평균 용량계수 (solar/wind/hydro).
 */
export const annualRenewablesSQL = `
  SELECT
    day::INTEGER AS day,
    AVG(pv_profile_ratio)::DOUBLE AS solar,
    AVG(wind_profile_ratio)::DOUBLE AS wind,
    AVG(hydro_profile_ratio)::DOUBLE AS hydro
  FROM '${u('profile_renewables')}'
  GROUP BY day
  ORDER BY day
`;

export interface AnnualRenewablesRow {
  day: number;
  solar: number;
  wind: number;
  hydro: number;
}

export const busListSQL = `
  SELECT bus_id::INTEGER AS id, name_Korean AS name_kr, name_English AS name_en
  FROM '${u('bus_location')}'
  ORDER BY bus_id
`;

export interface BusListRow {
  id: number;
  name_kr: string;
  name_en: string;
}

export interface ProfileRenewablesRow {
  hour: number;
  solar: number;
  wind: number;
  hydro: number;
}

export const commitmentByFuelSQL = (day: number, busId: number | null = null) => `
  WITH gen AS (
    SELECT ROW_NUMBER() OVER ()::INTEGER AS generator_id, fuel, Pmax::DOUBLE AS pmax, bus::INTEGER AS bus_id
    FROM '${u('generators')}'
  )
  SELECT
    c.hour::INTEGER AS hour,
    g.fuel,
    COUNT(*) FILTER (WHERE c.status = 1)::INTEGER AS units_on,
    SUM(g.pmax) FILTER (WHERE c.status = 1)::DOUBLE AS capacity_on_mw
  FROM '${u('profile_commitment')}' c
  JOIN gen g ON c.generator_id = g.generator_id
  WHERE c.day = ${day}${busId !== null ? ` AND g.bus_id = ${busId}` : ''}
  GROUP BY c.hour, g.fuel
  ORDER BY c.hour, g.fuel
`;

export interface CommitmentByFuelRow {
  hour: number;
  fuel: 'coal' | 'lng' | 'nuclear';
  units_on: number;
  capacity_on_mw: number;
}

export const profileWeatherSQL = (day: number, busId: number | null = null) => `
  SELECT
    hour::INTEGER AS hour,
    (AVG(temperature_2m_K) - 273.15)::DOUBLE AS temp_c,
    AVG("wind_speed_93m_m/s")::DOUBLE AS wind_speed
  FROM '${u('profile_weather')}'
  WHERE day = ${day}${busId !== null ? ` AND bus_id = ${busId}` : ''}
  GROUP BY hour
  ORDER BY hour
`;

export interface ProfileWeatherRow {
  hour: number;
  temp_c: number;
  wind_speed: number;
}

// ============================================================
// Applications page — decarbonization study queries
// ============================================================

/**
 * Card 02 — system-wide hourly renewable MW for a given day.
 * Σ_bus (Pmax × profile_ratio) per hour, broken down by source.
 */
export const applicationsRenewablePotentialSQL = (day: number) => `
  WITH cap AS (
    SELECT bus_ID::INTEGER AS bus_id, 'solar' AS fuel, "Pmax [MW]"::DOUBLE AS pmax FROM '${u('capacity_solar')}'
    UNION ALL
    SELECT bus_ID::INTEGER, 'wind',  "Pmax [MW]"::DOUBLE FROM '${u('capacity_wind')}'
    UNION ALL
    SELECT bus_ID::INTEGER, 'hydro', "Pmax [MW]"::DOUBLE FROM '${u('capacity_hydro')}'
  )
  SELECT
    p.hour::INTEGER AS hour,
    SUM(CASE WHEN cap.fuel='solar' THEN cap.pmax * p.pv_profile_ratio    ELSE 0 END)::DOUBLE AS solar_mw,
    SUM(CASE WHEN cap.fuel='wind'  THEN cap.pmax * p.wind_profile_ratio  ELSE 0 END)::DOUBLE AS wind_mw,
    SUM(CASE WHEN cap.fuel='hydro' THEN cap.pmax * p.hydro_profile_ratio ELSE 0 END)::DOUBLE AS hydro_mw
  FROM '${u('profile_renewables')}' p
  JOIN cap ON p.bus_id = cap.bus_id
  WHERE p.day = ${day}
  GROUP BY p.hour
  ORDER BY p.hour
`;

export interface ApplicationsRenewablePotentialRow {
  hour: number;
  solar_mw: number;
  wind_mw: number;
  hydro_mw: number;
}

/**
 * Card 03 — net load (demand − renewable potential) per hour.
 * CTE composes RE potential and demand, then subtracts.
 */
export const applicationsNetLoadSQL = (day: number) => `
  WITH cap AS (
    SELECT bus_ID::INTEGER AS bus_id, 'solar' AS fuel, "Pmax [MW]"::DOUBLE AS pmax FROM '${u('capacity_solar')}'
    UNION ALL
    SELECT bus_ID::INTEGER, 'wind',  "Pmax [MW]"::DOUBLE FROM '${u('capacity_wind')}'
    UNION ALL
    SELECT bus_ID::INTEGER, 'hydro', "Pmax [MW]"::DOUBLE FROM '${u('capacity_hydro')}'
  ),
  re AS (
    SELECT p.hour::INTEGER AS hour,
      (SUM(CASE WHEN cap.fuel='solar' THEN cap.pmax * p.pv_profile_ratio    ELSE 0 END)
      + SUM(CASE WHEN cap.fuel='wind'  THEN cap.pmax * p.wind_profile_ratio  ELSE 0 END)
      + SUM(CASE WHEN cap.fuel='hydro' THEN cap.pmax * p.hydro_profile_ratio ELSE 0 END))::DOUBLE AS re_mw
    FROM '${u('profile_renewables')}' p JOIN cap ON p.bus_id = cap.bus_id
    WHERE p.day = ${day} GROUP BY p.hour
  ),
  dem AS (
    SELECT hour::INTEGER AS hour, SUM(demandP)::DOUBLE AS demand_mw
    FROM '${u('profile_demand')}' WHERE day = ${day} GROUP BY hour
  )
  SELECT dem.hour, dem.demand_mw, COALESCE(re.re_mw, 0)::DOUBLE AS re_mw,
    (dem.demand_mw - COALESCE(re.re_mw, 0))::DOUBLE AS net_mw
  FROM dem LEFT JOIN re USING (hour)
  ORDER BY dem.hour
`;

export interface ApplicationsNetLoadRow {
  hour: number;
  demand_mw: number;
  re_mw: number;
  net_mw: number;
}

/**
 * Card 06 — annual capacity factor per thermal fuel.
 * Uses commitment status × Pmax as actual energy (UPPER BOUND, see caption).
 */
export const applicationsThermalCFSQL = `
  WITH gen AS (
    SELECT ROW_NUMBER() OVER ()::INTEGER AS generator_id, fuel, Pmax::DOUBLE AS pmax
    FROM '${u('generators')}'
  )
  SELECT
    g.fuel,
    SUM(g.pmax * c.status)::DOUBLE   AS energy_mwh,
    (SUM(g.pmax) * 8760)::DOUBLE     AS theoretical_mwh
  FROM '${u('profile_commitment')}' c
  JOIN gen g ON c.generator_id = g.generator_id
  GROUP BY g.fuel
`;

export interface ApplicationsThermalCFRow {
  fuel: 'coal' | 'lng' | 'nuclear';
  energy_mwh: number;
  theoretical_mwh: number;
}
