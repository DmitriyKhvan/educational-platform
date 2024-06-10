import React, { useMemo, useState } from 'react';
import { CurrencyContext } from '../lib/CurrencyContext';
import { Currencies, currenciesDic } from 'src/shared/constants/global';

export const CurrencyProvider = ({ children }) => {
  const defaultCurrency = useMemo(() => {
    return currenciesDic.find(
      (currency) =>
        currency.value === (localStorage.getItem('currency') || Currencies.KRW),
    );
  }, []);

  const [curCurrency, setCurCurrency] = useState(defaultCurrency);

  return (
    <CurrencyContext.Provider
      value={{
        curCurrency,
        setCurCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
