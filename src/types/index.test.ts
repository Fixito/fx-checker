import { describe, expect, it } from 'vitest';

import { cc, formatPair } from './index';

describe('formatPair', () => {
  it('formats a pair as BASE/QUOTE', () => {
    expect(formatPair({ base: cc('USD'), quote: cc('EUR') })).toBe('USD/EUR');
  });
});
