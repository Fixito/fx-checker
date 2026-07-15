import { queryOptions } from '@tanstack/react-query';

import { fetchPreviousRate, fetchRate } from '@/api/frankfurter.ts';
import type { CurrencyCode } from '@/types/index.ts';

const queryKeys = {
  getPreviousRate: (base: CurrencyCode, quote: CurrencyCode) => [
    'previousRate',
    { base },
    { quote },
  ],
  getRate: (base: CurrencyCode, quote: CurrencyCode) => ['rate', { base }, { quote }],
};

export function getRateQueryOptions(base: CurrencyCode, quote: CurrencyCode) {
  return queryOptions({
    queryFn: () => fetchRate(base, quote),
    queryKey: queryKeys.getRate(base, quote),
    refetchInterval: 15_000, // 15s
  });
}

export function getPreviousRateQueryOptions(base: CurrencyCode, quote: CurrencyCode) {
  return queryOptions({
    queryFn: () => fetchPreviousRate(base, quote),
    queryKey: queryKeys.getPreviousRate(base, quote),
    staleTime: 60 * 60 * 1000, // 1h
  });
}
