import { Decimal } from 'decimal.js';

Decimal.set({ precision: 40, toExpNeg: -40, toExpPos: 40 });

export type DecimalLike = string | number | Decimal;

export const D = (v: DecimalLike): Decimal => new Decimal(v);

export const sum = (values: DecimalLike[]): Decimal =>
  values.reduce<Decimal>((acc, v) => acc.plus(v), new Decimal(0));

export const mul = (a: DecimalLike, b: DecimalLike): Decimal => D(a).mul(b);

export const div = (a: DecimalLike, b: DecimalLike): Decimal => D(a).div(b);

export const ratio = (numerator: DecimalLike, denominator: DecimalLike): Decimal | null => {
  const d = D(denominator);
  return d.isZero() ? null : D(numerator).div(d);
};

export const toExact = (v: DecimalLike): string => D(v).toFixed();

export interface DisplayOptions {
  grouping?: boolean;
  suffix?: string;
}

const applyFormatting = (base: string, opts: DisplayOptions): string => {
  const { grouping = false, suffix = '' } = opts;
  if (!grouping) return base + suffix;

  const [intPart, fracPart] = base.split('.');
  const sign = intPart.startsWith('-') ? '-' : '';
  const digits = sign ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = fracPart !== undefined ? `${sign}${grouped}.${fracPart}` : `${sign}${grouped}`;
  return formatted + suffix;
};

export const toDisplay = (v: DecimalLike, opts: DisplayOptions = {}): string =>
  applyFormatting(D(v).toFixed(), opts);

export const toRounded = (v: DecimalLike, decimals: number, opts: DisplayOptions = {}): string =>
  applyFormatting(D(v).toFixed(decimals, Decimal.ROUND_HALF_UP), opts);

export const toTruncated = (v: DecimalLike, decimals: number, opts: DisplayOptions = {}): string =>
  applyFormatting(D(v).toFixed(decimals, Decimal.ROUND_DOWN), opts);

export const isExact = (original: DecimalLike, displayed: DecimalLike): boolean =>
  D(original).equals(D(displayed));
