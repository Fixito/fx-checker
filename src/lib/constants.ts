import { cc, type CurrencyCode, type Pair } from '@/types';

export const TICKER_PAIRS: Pair[] = [
  { base: cc('USD'), quote: cc('JPY') },
  { base: cc('USD'), quote: cc('GBP') },
  { base: cc('USD'), quote: cc('EUR') },
  { base: cc('USD'), quote: cc('CHF') },
  { base: cc('USD'), quote: cc('CAD') },
  { base: cc('USD'), quote: cc('AUD') },
  { base: cc('USD'), quote: cc('INR') },
  { base: cc('USD'), quote: cc('CNY') },
];

export const COMPARE_TARGETS: CurrencyCode[] = [
  cc('GBP'),
  cc('JPY'),
  cc('CHF'),
  cc('CAD'),
  cc('AUD'),
  cc('INR'),
  cc('CNY'),
  cc('BDT'),
];

export const RANGES = [
  { disabled: true, label: '1D', value: '1d' as const },
  { disabled: false, label: '1W', value: '1w' as const },
  { disabled: false, label: '1M', value: '1m' as const },
  { disabled: false, label: '3M', value: '3m' as const },
  { disabled: false, label: '1Y', value: '1y' as const },
  { disabled: false, label: '5Y', value: '5y' as const },
] satisfies { label: string; value: string; disabled: boolean }[];
