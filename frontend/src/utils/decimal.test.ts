import { describe, it, expect } from 'vitest';
import { D, sum, mul, div, ratio, toExact, toDisplay, toRounded, toTruncated, isExact } from './decimal';

describe('D() — 정밀도 보존 파싱', () => {
  it('문자열 입력은 원본 정밀도를 그대로 유지한다', () => {
    expect(D('123.4567890123').toString()).toBe('123.4567890123');
  });

  it('숫자 입력도 Decimal로 변환된다', () => {
    expect(D(100.5).toString()).toBe('100.5');
  });

  it('IEEE 754 부동소수점 문제를 회피한다', () => {
    expect(D('0.1').plus(D('0.2')).toString()).toBe('0.3');
    expect(0.1 + 0.2).not.toBe(0.3);
  });
});

describe('sum() — 절사 없이 누적합', () => {
  it('8760시간 누적 시에도 정확하다', () => {
    const values = Array.from({ length: 8760 }, () => '0.1');
    expect(sum(values).toString()).toBe('876');
  });

  it('빈 배열은 0을 반환', () => {
    expect(sum([]).toString()).toBe('0');
  });

  it('혼합 타입 입력도 처리', () => {
    expect(sum(['1.1', 2.2, D('3.3')]).toString()).toBe('6.6');
  });
});

describe('mul()/div() — 정확한 사칙연산', () => {
  it('용량 × 용량계수가 정확하다', () => {
    expect(mul('1000.123', '0.4567').toString()).toBe('456.7561741');
  });

  it('나눗셈도 임의 정밀도를 유지한다', () => {
    const r = div('1', '3');
    expect(r.toString().length).toBeGreaterThan(10);
  });
});

describe('ratio() — 비율 계산', () => {
  it('분모가 0이면 null을 반환 (Infinity 방지)', () => {
    expect(ratio('100', '0')).toBeNull();
  });

  it('정상 비율은 Decimal 반환', () => {
    expect(ratio('25', '100')?.toString()).toBe('0.25');
  });
});

describe('toExact() — 손실 없는 직렬화', () => {
  it('전체 정밀도로 문자열 반환', () => {
    expect(toExact(D('123.456789012345'))).toBe('123.456789012345');
  });

  it('지수 표기법으로 변환되지 않는다', () => {
    expect(toExact(D('0.00000001'))).toBe('0.00000001');
    expect(toExact(D('100000000000'))).toBe('100000000000');
  });
});

describe('toDisplay() — 원본 정밀도 유지 표시 (반올림·절사 없음)', () => {
  it('원본 정밀도를 그대로 보여준다', () => {
    expect(toDisplay('123.456789')).toBe('123.456789');
  });

  it('grouping 옵션은 정밀도 손실 없이 천 단위 구분', () => {
    expect(toDisplay('1234567.89', { grouping: true })).toBe('1,234,567.89');
  });

  it('suffix 부착 — 데이터는 그대로', () => {
    expect(toDisplay('123.456', { suffix: ' MW' })).toBe('123.456 MW');
  });

  it('음수도 grouping 처리', () => {
    expect(toDisplay('-1234567.89', { grouping: true })).toBe('-1,234,567.89');
  });
});

describe('toRounded() — 명시적 반올림 (표시 전용)', () => {
  it('지정 자릿수로 반올림한다', () => {
    expect(toRounded('123.456', 2)).toBe('123.46');
  });

  it('grouping + suffix 조합 가능', () => {
    expect(toRounded('1234567.89', 1, { grouping: true, suffix: ' MWh' })).toBe('1,234,567.9 MWh');
  });
});

describe('toTruncated() — 명시적 절사 (표시 전용)', () => {
  it('지정 자릿수에서 절사한다', () => {
    expect(toTruncated('123.999', 2)).toBe('123.99');
  });
});

describe('isExact() — 원본 정밀도 검증', () => {
  it('표시값과 원본이 동일하면 true', () => {
    expect(isExact('123.45', '123.45')).toBe(true);
  });

  it('절사되었다면 false', () => {
    expect(isExact('123.456', '123.45')).toBe(false);
  });
});
