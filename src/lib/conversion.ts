export function calculateConversion(amount: number, rate: number | undefined): number | undefined {
  if (rate === undefined) {
    return undefined;
  }

  return Math.round(amount * rate * 100) / 100;
}

export function calculateDailyChange(rate: number | undefined, prevRate: number | undefined) {
  if (rate === undefined || prevRate === undefined || prevRate === 0) {
    return undefined;
  }

  return ((rate - prevRate) / prevRate) * 100;
}
