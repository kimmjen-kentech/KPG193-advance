import { describe, it, expect } from 'vitest';
import {
  decarbShares,
  coalPhaseoutImpact,
  expansionYield,
} from '../applications-compute';

describe('decarbShares — 발전 믹스 비율 (Decimal 정밀)', () => {
  it('재생에너지 + 화석 비율이 100%가 된다', () => {
    const mix = { coal: '100', lng: '100', nuclear: '100', solar: '100', wind: '100', hydro: '100' };
    const r = decarbShares(mix);
    // renewable = 300 / 600 = 50%, clean = 400 / 600 = 66.67%, fossil = 200 / 600 = 33.33%
    expect(r.renewablePct).toBe('50');
    expect(parseFloat(r.cleanPct)).toBeCloseTo(66.666666, 3);
    expect(parseFloat(r.fossilPct)).toBeCloseTo(33.333333, 3);
  });

  it('총합이 0이면 모두 0 반환', () => {
    const mix = { coal: '0', lng: '0', nuclear: '0', solar: '0', wind: '0', hydro: '0' };
    const r = decarbShares(mix);
    expect(r.renewablePct).toBe('0');
    expect(r.cleanPct).toBe('0');
    expect(r.fossilPct).toBe('0');
  });

  it('큰 정밀도 입력도 정확히 처리 (0.1 + 0.2 = 0.3 보장)', () => {
    const mix = { coal: '0.1', lng: '0.2', nuclear: '0', solar: '0', wind: '0', hydro: '0' };
    const r = decarbShares(mix);
    // fossil/total = 0.3/0.3 = 100%
    expect(parseFloat(r.fossilPct)).toBeCloseTo(100, 6);
  });
});

describe('coalPhaseoutImpact — 석탄 폐지 영향 (CO₂ 회피량)', () => {
  it('100% 폐지 시 모든 석탄 용량 제거', () => {
    const r = coalPhaseoutImpact({
      coalCapacityMw: '1000',
      phaseoutPct: 100,
      emissionFactor: '0.82', // tCO2/MWh
      assumedCf: '0.6',
    });
    // removed = 1000 MW; CO2 avoided = 1000 × 0.6 × 8760 × 0.82 = 4,310,560 tCO2 ≈ 4.31 Mt
    expect(r.removedCoalMw).toBe('1000');
    expect(r.remainingCoalMw).toBe('0');
    expect(parseFloat(r.co2AvoidedMt)).toBeCloseTo(4.310, 2);
  });

  it('0% 폐지 시 변화 없음', () => {
    const r = coalPhaseoutImpact({
      coalCapacityMw: '1000',
      phaseoutPct: 0,
      emissionFactor: '0.82',
      assumedCf: '0.6',
    });
    expect(r.removedCoalMw).toBe('0');
    expect(r.remainingCoalMw).toBe('1000');
    expect(r.co2AvoidedMt).toBe('0');
  });

  it('50% 폐지 시 절반', () => {
    const r = coalPhaseoutImpact({
      coalCapacityMw: '1000',
      phaseoutPct: 50,
      emissionFactor: '0.82',
      assumedCf: '0.6',
    });
    expect(r.removedCoalMw).toBe('500');
    expect(r.remainingCoalMw).toBe('500');
    expect(parseFloat(r.co2AvoidedMt)).toBeCloseTo(2.155, 2);
  });
});

describe('expansionYield — 재생에너지 확장 연간 에너지', () => {
  it('1배일 때 baseline 연간 에너지', () => {
    // capacity 100 MW × CF 0.2 × 8760 = 175,200 MWh = 0.1752 TWh
    const r = expansionYield({
      capacityMw: '100',
      multiplier: 1,
      annualCfAvg: '0.2',
    });
    expect(parseFloat(r.annualEnergyTwh)).toBeCloseTo(0.1752, 4);
  });

  it('3배일 때 3배 에너지', () => {
    const r = expansionYield({
      capacityMw: '100',
      multiplier: 3,
      annualCfAvg: '0.2',
    });
    expect(parseFloat(r.annualEnergyTwh)).toBeCloseTo(0.5256, 4);
  });

  it('multiplier 1과 비교한 delta TWh', () => {
    // baseline = 0.1752 TWh, 3x = 0.5256 → delta = 0.3504
    const baseline = expansionYield({ capacityMw: '100', multiplier: 1, annualCfAvg: '0.2' });
    const tripled = expansionYield({ capacityMw: '100', multiplier: 3, annualCfAvg: '0.2' });
    const delta = parseFloat(tripled.annualEnergyTwh) - parseFloat(baseline.annualEnergyTwh);
    expect(delta).toBeCloseTo(0.3504, 4);
  });
});
