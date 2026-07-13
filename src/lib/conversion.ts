export function calculateConversion(amount: number, rate: number | undefined): number | undefined {
  if (!rate) {
    return undefined;
  }

  return Math.round(amount * rate * 100) / 100;
}
