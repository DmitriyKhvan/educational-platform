import { CurrencyContext } from '@/app/providers/currency-provider/lib/use-currency';
import { Currencies, type CurrencyDictionary, currenciesDic } from '@/shared/constants/global';
import { type ReactNode, useMemo, useState } from 'react';

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const defaultCurrency = useMemo(() => {
    const curCurrency = currenciesDic
      .filter((currency) => currency.active)
      .find((currency) => currency.value === (localStorage.getItem('currency') || Currencies.KRW));

    if (!curCurrency) {
      return currenciesDic.find((currency) => currency.value === Currencies.KRW);
    }

    return curCurrency;
  }, []);

  const [curCurrency, setCurCurrency] = useState(defaultCurrency);

  const [loadingCurrency, setLoadingCurrency] = useState(false);

  const findCurrency = (value: CurrencyDictionary) => {
    return currenciesDic.find((currency) => currency.value === value?.toString()?.toUpperCase());
  };

  return (
    <CurrencyContext.Provider
      value={{
        findCurrency,
        curCurrency,
        setCurCurrency,
        setLoadingCurrency,
        loadingCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
