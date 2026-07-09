import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-preset-1',
        'text-preset-1-tablet',
        'text-preset-2',
        'text-preset-2-bold',
        'text-preset-3',
        'text-preset-3-medium',
        'text-preset-3-bold',
        'text-preset-4',
        'text-preset-5',
        'text-preset-5-medium',
        'text-preset-6',
      ],
    },
  },
});

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
