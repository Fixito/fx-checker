import { useQuery } from '@tanstack/react-query';
import { parseAsFloat, parseAsStringLiteral, throttle, useQueryState } from 'nuqs';

import { Converter } from '@/components/converter.tsx';
import { Header } from '@/components/header.tsx';
import { getRateQueryOptions } from '@/queries/rates.ts';
import { cc, RANGE_VALUES, TAB_VALUES } from '@/types/index.ts';

export default function App() {
  const [baseRaw, setBaseRaw] = useQueryState('base', { defaultValue: 'USD' });
  const [quoteRaw, setQuoteRaw] = useQueryState('quote', { defaultValue: 'EUR' });
  const [amount, setAmount] = useQueryState(
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

  const base = cc(baseRaw);
  const quote = cc(quoteRaw);

  const { data } = useQuery(getRateQueryOptions(base, quote));

  const handleSwap = () => {
    setBaseRaw(quote);
    setQuoteRaw(base);
  };

  return (
    <>
      <Header />

      {/* <div>Ticker</div> */}

      <main className="container">
        {/* Converter wrapper */}
        <section>
          <h2 className="text-preset-2 uppercase">Check the rate</h2>

          <Converter
            amount={amount}
            base={base}
            quote={quote}
            data={data}
            setBaseRaw={setBaseRaw}
            setQuoteRaw={setQuoteRaw}
            setAmount={setAmount}
            handleSwap={handleSwap}
          />
        </section>

        {/* <div>Content</div> */}
      </main>
    </>
  );
}
