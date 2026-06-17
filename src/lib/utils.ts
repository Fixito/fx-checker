import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = {
  amount: (num: number) =>
    num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
  date: (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
    }),
  pct: (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`,
  rate: (num: number, decimals = 4) => num.toFixed(decimals),
};
