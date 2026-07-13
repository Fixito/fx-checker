import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test/mocks/server';
import { cc } from '@/types';

import { fetchPreviousRate, fetchRate, FRANKFURTER_API_URL } from './frankfurter';

describe('fetchRate', () => {
  it('returns the rate object for a given pair', async () => {
    const result = await fetchRate(cc('USD'), cc('EUR'));
    expect(result?.rate).toBe(0.861_44);
    expect(result?.base).toBe('USD');
    expect(result?.quote).toBe('EUR');
  });
});

describe('fetchPreviousRate', () => {
  it('returns the rate on the first successful day', async () => {
    const result = await fetchPreviousRate(cc('USD'), cc('EUR'));
    expect(result?.rate).toBe(0.861_44);
  });

  it('walks back when a day has no data (weekend/holiday)', async () => {
    let callCount = 0;

    server.use(
      http.get(`${FRANKFURTER_API_URL}/rates`, () => {
        callCount++;

        // The first two calls fail (simulating a weekend), the third succeeds
        if (callCount < 3) {
          return HttpResponse.json([]); // No data for that day
        }

        return HttpResponse.json([{ base: 'USD', date: '2026-06-13', quote: 'EUR', rate: 0.85 }]);
      }),
    );

    const result = await fetchPreviousRate(cc('USD'), cc('EUR'));
    expect(result?.rate).toBe(0.85);
    expect(callCount).toBe(3);
  });

  it('returns undefined after 5 failed attempts', async () => {
    server.use(http.get(`${FRANKFURTER_API_URL}/rates`, () => HttpResponse.json([])));

    const result = await fetchPreviousRate(cc('USD'), cc('EUR'));
    expect(result).toBeUndefined();
  });
});
