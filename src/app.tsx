import { parseAsFloat, parseAsStringLiteral, throttle, useQueryState } from 'nuqs';

import { RANGE_VALUES, TAB_VALUES } from '@/types/index.ts';

export default function App() {
  const [_baseRaw, _setBaseRaw] = useQueryState('base', { defaultValue: 'USD' });
  const [_quoteRaw, _setQuoteRaw] = useQueryState('quote', { defaultValue: 'EUR' });
  const [_amount, _setAmount] = useQueryState(
    'amount',
    parseAsFloat.withDefault(1000).withOptions({ limitUrlUpdates: throttle(100) }),
  );
  const [_tab, _setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(TAB_VALUES).withDefault('history'),
  );
  const [_range, _setRange] = useQueryState(
    'range',
    parseAsStringLiteral(RANGE_VALUES).withDefault('1m'),
  );

  return (
    <>
      <header className="container">
        <h1 className="text-preset-3-bold">FX_Checker</h1>
      </header>

      <div>Ticker</div>

      <main className="container">
        <div>Converter</div>

        <div>Content</div>
      </main>
    </>
  );
}
