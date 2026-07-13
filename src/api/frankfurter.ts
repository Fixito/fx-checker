import { z } from 'zod';

import type { CurrencyCode } from '@/types';

export const FRANKFURTER_API_URL = 'https://api.frankfurter.dev/v2';

const RateSchema = z.object({
  base: z.string(),
  date: z.string(),
  quote: z.string(),
  rate: z.number(),
});

const FrankfurterResponseSchema = z.array(RateSchema);
export type Rate = z.infer<typeof RateSchema>;

const CurrencySchema = z.object({
  end_date: z.string(),
  iso_code: z.string(),
  iso_numeric: z.string(),
  name: z.string(),
  start_date: z.string(),
  symbol: z.string(),
});

export const CurrenciesResponseSchema = z.array(CurrencySchema);
export type Currency = z.infer<typeof CurrencySchema>;

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function fetchJson<Response>(url: string, schema: z.ZodSchema<Response>): Promise<Response> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Frankfurter error: ${res.status}`);
  }

  const data: unknown = await res.json();

  return schema.parse(data);
}

export async function fetchCurrencies(): Promise<Currency[]> {
  return fetchJson(`${FRANKFURTER_API_URL}/currencies`, CurrenciesResponseSchema);
}

export async function fetchRate(
  base: CurrencyCode,
  quote: CurrencyCode,
): Promise<Rate | undefined> {
  const data = await fetchJson(
    `${FRANKFURTER_API_URL}/rates?base=${base}&quotes=${quote}`,
    FrankfurterResponseSchema,
  );

  return data[0];
}

export async function fetchPreviousRate(
  base: CurrencyCode,
  quote: CurrencyCode,
): Promise<Rate | undefined> {
  for (let idx = 1; idx <= 5; idx++) {
    try {
      const date = toDateString(new Date(Date.now() - idx * 86_400_000));

      const params = new URLSearchParams({ base, date, quotes: quote });

      const data = await fetchJson(
        `${FRANKFURTER_API_URL}/rates?${params}`,
        FrankfurterResponseSchema,
      );

      if (data.length > 0) {
        return data[0];
      }
    } catch {
      // Ignore errors and continue with the next date.
    }
  }

  return undefined;
}

export async function fetchAllRates(base: CurrencyCode): Promise<Rate[]> {
  return fetchJson(`${FRANKFURTER_API_URL}/rates?base=${base}`, FrankfurterResponseSchema);
}

export async function fetchHistoricalRates(
  base: CurrencyCode,
  quote: CurrencyCode,
  days: number,
): Promise<Rate[]> {
  const to = toDateString(new Date());
  const from = toDateString(new Date(Date.now() - days * 86_400_000));

  const data = await fetchJson(
    `${FRANKFURTER_API_URL}/rates?base=${base}&quotes=${quote}&from=${from}&to=${to}`,
    FrankfurterResponseSchema,
  );

  return data;
}
