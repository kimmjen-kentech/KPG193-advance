/**
 * Applications 페이지의 순수 계산 헬퍼.
 * 모든 수치는 Decimal로 처리하여 부동소수점 오차를 회피한다 (CLAUDE.md §5).
 */
import { D, sum, mul, div } from '../utils/decimal';
import type { DecimalLike } from '../utils/decimal';

export interface FuelMix {
  coal: DecimalLike;
  lng: DecimalLike;
  nuclear: DecimalLike;
  solar: DecimalLike;
  wind: DecimalLike;
  hydro: DecimalLike;
}

export interface DecarbShares {
  renewablePct: string;
  cleanPct: string;
  fossilPct: string;
  totalMw: string;
}

/**
 * 발전 믹스로부터 재생/무탄소/화석 비율 (%) 계산.
 * renewable = solar + wind + hydro
 * clean     = renewable + nuclear
 * fossil    = coal + lng
 */
export const decarbShares = (mix: FuelMix): DecarbShares => {
  const renewable = sum([mix.solar, mix.wind, mix.hydro]);
  const fossil = sum([mix.coal, mix.lng]);
  const total = sum([renewable, fossil, mix.nuclear]);
  if (total.isZero()) {
    return { renewablePct: '0', cleanPct: '0', fossilPct: '0', totalMw: '0' };
  }
  const renewablePct = mul(div(renewable, total), 100).toFixed();
  const cleanPct = mul(div(sum([renewable, mix.nuclear]), total), 100).toFixed();
  const fossilPct = mul(div(fossil, total), 100).toFixed();
  return {
    renewablePct,
    cleanPct,
    fossilPct,
    totalMw: total.toFixed(),
  };
};

export interface CoalPhaseoutInput {
  coalCapacityMw: DecimalLike;
  phaseoutPct: number;       // 0-100
  emissionFactor: DecimalLike; // tCO2 per MWh
  assumedCf: DecimalLike;      // illustrative, 0-1
}

export interface CoalPhaseoutResult {
  removedCoalMw: string;
  remainingCoalMw: string;
  co2AvoidedMt: string;        // million tCO2 / year
}

/**
 * 석탄 폐지 % → 잔여 firm 용량 + 회피 CO₂ (백만톤/년).
 * CO2 avoided = removed_MW × CF × 8760 h × emission_factor / 1e6
 */
export const coalPhaseoutImpact = ({
  coalCapacityMw,
  phaseoutPct,
  emissionFactor,
  assumedCf,
}: CoalPhaseoutInput): CoalPhaseoutResult => {
  const cap = D(coalCapacityMw);
  const pct = D(phaseoutPct).div(100);
  const removed = mul(cap, pct);
  const remaining = cap.minus(removed);
  // tonnes → million tonnes via /1e6
  const co2t = removed.mul(assumedCf).mul(8760).mul(emissionFactor);
  const co2mt = co2t.div(1_000_000);
  return {
    removedCoalMw: removed.toFixed(),
    remainingCoalMw: remaining.toFixed(),
    co2AvoidedMt: co2mt.toFixed(),
  };
};

export interface ExpansionInput {
  capacityMw: DecimalLike;     // 현재 RE 총 capacity
  multiplier: number;          // 1, 2, 3, …
  annualCfAvg: DecimalLike;    // 365일 일평균 CF
}

export interface ExpansionResult {
  annualEnergyTwh: string;
  effectiveCapacityMw: string;
}

/**
 * 재생에너지 N배 확장 시 연간 에너지 (TWh).
 * energy_MWh = capacity × multiplier × CF × 8760
 * energy_TWh = energy_MWh / 1e6
 */
export const expansionYield = ({
  capacityMw,
  multiplier,
  annualCfAvg,
}: ExpansionInput): ExpansionResult => {
  const effective = D(capacityMw).mul(multiplier);
  const energyMwh = effective.mul(annualCfAvg).mul(8760);
  const energyTwh = energyMwh.div(1_000_000);
  return {
    annualEnergyTwh: energyTwh.toFixed(),
    effectiveCapacityMw: effective.toFixed(),
  };
};
