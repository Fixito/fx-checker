import CurrencySelect from '@/components/ui/currency-select.tsx';
import { Input } from '@/components/ui/input.tsx';
import { cn } from '@/lib/utils.ts';
import type { CurrencyCode } from '@/types/index.ts';

interface ConverterProps {
  amount: number;
  base: CurrencyCode;
  label: string;
  inputClassName?: string;
  isReadOnly?: boolean;
  onInputChange?: (value: number) => void;
  onCurrencyChange: (value: CurrencyCode) => void;
}

export function CurrencyField({
  amount,
  base,
  inputClassName,
  isReadOnly,
  label,
  onCurrencyChange,
  onInputChange,
}: ConverterProps) {
  return (
    <div className="w-full rounded-16 bg-card-inner p-4 outline outline-card-inner-border">
      <p className="text-preset-4 text-card-muted-foreground uppercase">{label}</p>

      <div className="mbs-5 flex items-center justify-between">
        <Input
          type="number"
          name="send"
          id="send"
          value={amount}
          readOnly={isReadOnly}
          onChange={
            isReadOnly || !onInputChange
              ? undefined
              : (event) => onInputChange(parseFloat(event.target.value))
          }
          className={cn('focus-visible:shadow-focus-input', inputClassName)}
        />
        <CurrencySelect value={base} onChange={onCurrencyChange} />
      </div>
    </div>
  );
}
