import { useQuery } from '@tanstack/react-query';

import ChevronDownIcon from '@/assets/images/icon-chevron-down.svg?react';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox.tsx';
import { getCurrenciesQueryOptions } from '@/queries/curencies.ts';
import { type CurrencyCode, cc } from '@/types/index.ts';

const popularSymbols = ['USD', 'EUR', 'GBP'];

const flagModules = import.meta.glob<string>('@/assets/images/flags/*.webp', {
  eager: true,
  import: 'default',
});

const getFlag = (symbol: string) =>
  flagModules[`/src/assets/images/flags/${symbol.toLowerCase()}.webp`] ?? undefined;

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

export default function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const { data: currencies = [] } = useQuery(getCurrenciesQueryOptions());

  const items = currencies.map((currency) => ({
    currencyName: currency.name,
    currencySymbol: currency.iso_code.toUpperCase(),
    icon: getFlag(currency.iso_code.slice(0, 2).toLowerCase()),
  }));

  const popularCurrencies = items.filter((item) => popularSymbols.includes(item.currencySymbol));
  const otherCurrencies = items.filter((item) => !popularSymbols.includes(item.currencySymbol));

  const groupedItems = [
    { group: 'popular', items: popularCurrencies, label: 'Popular' },
    { group: 'other', items: otherCurrencies, label: 'Other Currencies' },
  ];

  const selectedItem = items.find((item) => item.currencySymbol === value) ?? {
    currencyName: '',
    currencySymbol: value,
    icon: undefined,
  };

  return (
    <Combobox
      items={groupedItems}
      value={selectedItem}
      onValueChange={(item) => item && onChange(cc(item.currencySymbol))}
      itemToStringValue={(item) => item.currencySymbol}
      isItemEqualToValue={(item, val) => item.currencySymbol === val.currencySymbol}
      highlightItemOnHover={false}
    >
      <ComboboxTrigger
        render={
          <button className="flex cursor-pointer items-center gap-2 rounded-6 border border-input bg-neutral-500 p-2.5 transition-colors outline-none hover:bg-neutral-400 focus-visible:shadow-focus-input">
            {selectedItem?.icon && (
              <img
                src={selectedItem.icon}
                alt={value}
                className="size-5 rounded-full object-cover"
              />
            )}
            <span className="text-preset-4">{value}</span>
            <ChevronDownIcon className="pointer-events-none text-foreground" />
          </button>
        }
      />

      <ComboboxContent className="w-77.75">
        <ComboboxInput showTrigger={false} placeholder="Search currencies..." />
        <ComboboxEmpty>No currencies found.</ComboboxEmpty>

        <ComboboxList>
          {(group: (typeof groupedItems)[number]) => (
            <ComboboxGroup key={group.group} items={group.items}>
              <ComboboxLabel className="flex items-center justify-between">
                <span>{group.label}</span>
                <span>{group.items.length}</span>
              </ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item.currencySymbol} value={item}>
                    <img
                      src={item.icon}
                      alt={item.currencySymbol}
                      className="size-5 rounded-full object-cover"
                    />
                    <span>{item.currencySymbol}</span>
                    <span className="text-preset-5 text-muted-foreground">{item.currencyName}</span>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
