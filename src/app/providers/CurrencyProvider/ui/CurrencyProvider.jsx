import React, { useMemo, useState } from 'react';
import { CurrencyContext } from '../lib/CurrencyContext';
import { Currencies, currenciesDic } from 'src/shared/constants/global';

export const CurrencyProvider = ({ children }) => {
  const defaultCurrency = useMemo(() => {
    const curCurrency = currenciesDic
      .filter((currency) => currency.active)
      .find(
        (currency) =>
          currency.value ===
          (localStorage.getItem('currency') || Currencies.KRW),
      );

    if (!curCurrency) {
      return currenciesDic.find(
        (currency) => currency.value === Currencies.KRW,
      );
    }

    return curCurrency;
  }, []);

  const [curCurrency, setCurCurrency] = useState(defaultCurrency);

  const [loadingCurrency, setLoadingCurrency] = useState(false);

  const findCurrency = (value) => {
    return currenciesDic.find(
      (currency) => currency.value === value?.toString()?.toUpperCase(),
    );
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
