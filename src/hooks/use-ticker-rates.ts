import { useQueries } from '@tanstack/react-query';

import { TICKER_PAIRS } from '@/lib/constants.ts';
import { getPreviousRateQueryOptions, getRateQueryOptions } from '@/queries/rates.ts';

export function useTickerRates() {
  const rateQueries = useQueries({
    queries: TICKER_PAIRS.map((pair) => getRateQueryOptions(pair.base, pair.quote)),
  });

  const prevRateQueries = useQueries({
    queries: TICKER_PAIRS.map((pair) => getPreviousRateQueryOptions(pair.base, pair.quote)),
  });

  return TICKER_PAIRS.map((pair, index) => ({
    isPending: rateQueries[index]?.isPending || prevRateQueries[index]?.isPending,
    pair,
    prevRate: prevRateQueries[index]?.data?.rate,
    rate: rateQueries[index]?.data?.rate,
  }));
}
