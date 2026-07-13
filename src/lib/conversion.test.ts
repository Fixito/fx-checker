import { describe, expect, it } from 'vitest';

import { calculateConversion } from './conversion';

describe('calculateConversion', () => {
  it('multiplies amount by rate and rounds to 2 decimals', () => {
    expect(calculateConversion(1000, 0.861_44)).toBe(861.44);
  });

  it('returns undefined when rate is not yet available', () => {
    expect(calculateConversion(1000, undefined)).toBeUndefined();
  });

  it('handles floating point precision correctly', () => {
    expect(calculateConversion(0.1, 3)).toBe(0.3);
  });

  it('returns 0 when amount is 0', () => {
    expect(calculateConversion(0, 0.861_44)).toBe(0);
  });

  it('returns 0 when rate is 0', () => {
    expect(calculateConversion(1000, 0)).toBe(0);
  });
});
