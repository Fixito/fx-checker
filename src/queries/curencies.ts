import { queryOptions } from '@tanstack/react-query';

import { fetchCurrencies } from '@/api/frankfurter.ts';

export function getCurrenciesQueryOptions() {
  return queryOptions({
    queryFn: fetchCurrencies,
    queryKey: ['currencies'],
    staleTime: Infinity,
  });
}
