import IconStar from '@/assets/images/icon-star.svg?react';
import { CurrencyField } from '@/components/currency-field.tsx';
import { SwapButton } from '@/components/swap-button.tsx';
import { Button } from '@/components/ui/button.tsx';
import { calculateConversion } from '@/lib/conversion.ts';
import type { CurrencyCode } from '@/types/index.ts';

interface ConverterProps {
  amount: number;
  base: CurrencyCode;
  quote: CurrencyCode;
  data?: {
    rate: number;
  };
  setBaseRaw: (value: string) => void;
  setQuoteRaw: (value: string) => void;
  setAmount: (value: number) => void;
  handleSwap: () => void;
}

export function Converter({
  amount,
  base,
  quote,
  data,
  setBaseRaw,
  setQuoteRaw,
  setAmount,
  handleSwap,
}: ConverterProps) {
  const converted = calculateConversion(amount, data?.rate);

  return (
    <div className="mbs-4 rounded-20 bg-card">
      {/* Top container */}
      <div className="flex flex-col items-center gap-4 p-4">
        <CurrencyField
          amount={amount}
          base={base}
          label="Send"
          id="send-amount"
          name="send-amount"
          onCurrencyChange={setBaseRaw}
          onInputChange={setAmount}
        />

        <SwapButton onSwap={handleSwap} />

        <CurrencyField
          amount={converted ?? 0}
          base={quote}
          inputClassName="text-accent"
          isReadOnly
          label="Receive"
          id="receive-amount"
          name="receive-amount"
          onCurrencyChange={setQuoteRaw}
        />
      </div>

      {/* Bottom container */}
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-preset-6">
          1 {base} = {data?.rate ?? 0} {quote}
        </p>

        <div className="flex gap-2">
          <Button disabled>
            <IconStar stroke="currentColor" /> favorite
          </Button>

          <Button
            className="border-accent hover:bg-lime-800 active:bg-accent active:text-accent-foreground"
            disabled
          >
            log conversion
          </Button>
        </div>
      </div>
    </div>
  );
}
