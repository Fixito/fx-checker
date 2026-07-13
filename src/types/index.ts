export type CurrencyCode = string & { readonly _brand: 'CurrencyCode' };

/**
 * The only place in the codebase where casting to CurrencyCode is allowed.
 * Since the brand exists only at the type level, the cast is unavoidable—
 * we isolate it here to prevent it from spreading elsewhere.
 */
export const cc = (code: string): CurrencyCode =>
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  code.toUpperCase() as CurrencyCode;

export function pairEq(pairA: Pair, pairB: Pair): boolean {
  return pairA.base === pairB.base && pairA.quote === pairB.quote;
}

export interface Pair {
  base: CurrencyCode;
  quote: CurrencyCode;
}

export interface ConversionEntry {
  id: string;
  pair: Pair;
  amount: number;
  rate: number;
  result: number;
  timestamp: number;
}

export const TAB_VALUES = ['history', 'compare', 'favorites', 'log'] as const;
export type TabValue = (typeof TAB_VALUES)[number];

export const RANGE_VALUES = ['1w', '1m', '3m', '1y', '5y'] as const;
export type RangeValue = (typeof RANGE_VALUES)[number];
