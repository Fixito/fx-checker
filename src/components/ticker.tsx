import { useTickerRates } from '@/hooks/use-ticker-rates.ts';
import { calculateDailyChange } from '@/lib/conversion';
import { formatPair } from '@/types';

export function Ticker() {
  const tickerData = useTickerRates();
  const looped = [...tickerData, ...tickerData];

  return (
    <div className="flex h-8.5 overflow-hidden bg-card text-preset-6 tablet:text-preset-5-medium">
      <div className="flex shrink-0 items-center gap-2 bg-accent px-2 py-3 text-accent-foreground uppercase">
        <span className="size-1.5 rounded-full bg-background" />
        Live markets
      </div>

      <div className="group flex overflow-hidden">
        <div className="flex animate-ticker group-hover:paused">
          {looped.map(({ pair, rate, prevRate, isPending }, index) => {
            const dailyChange = calculateDailyChange(rate, prevRate);

            return (
              <div
                key={`${formatPair(pair)}-${index}`}
                className="flex shrink-0 items-center gap-2.5 border border-border p-3"
              >
                <span className="text-muted-foreground">{formatPair(pair)}</span>

                <span className="font-bold">{isPending ? '...' : rate?.toFixed(4)}</span>

                {dailyChange != undefined && (
                  <span
                    className={dailyChange >= 0 ? 'text-success' : 'text-destructive'}
                    aria-label={`${dailyChange >= 0 ? 'Up' : 'Down'} ${Math.abs(dailyChange).toFixed(2)} percent`}
                  >
                    {dailyChange >= 0 ? '▲' : '▼'} {dailyChange >= 0 ? '+' : '-'}
                    {Math.abs(dailyChange).toFixed(2)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
