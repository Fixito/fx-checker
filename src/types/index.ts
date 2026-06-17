export type CurrencyCode = string & { readonly _brand: 'CurrencyCode' };

/**
 * The only place in the codebase where casting to CurrencyCode is allowed.
 * Since the brand exists only at the type level, the cast is unavoidable—
 * we isolate it here to prevent it from spreading elsewhere.
 */
export const cc = (code: string): CurrencyCode =>
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  code.toUpperCase() as CurrencyCode;

export interface Pair {
  base: CurrencyCode;
  quote: CurrencyCode;
}
