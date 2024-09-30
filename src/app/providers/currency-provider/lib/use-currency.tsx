import type { CurrencyDictionary } from '@/shared/constants/global';
import { createContext, useContext } from 'react';

interface CurrencyContextType {
  loadingCurrency: boolean;
  curCurrency?: CurrencyDictionary;
  setCurCurrency: React.Dispatch<React.SetStateAction<CurrencyDictionary | undefined>>;
  setLoadingCurrency: React.Dispatch<React.SetStateAction<boolean>>;
  findCurrency: (value: CurrencyDictionary) => CurrencyDictionary | undefined;
}

const defaultCurrencyContext: CurrencyContextType = {
  loadingCurrency: false,
  curCurrency: {
    label: '',
    value: 'KRW', // default to USD?
    locales: 'ko-KR',
    active: true,
  },
  setCurCurrency: () => {},
  setLoadingCurrency: () => {},
  findCurrency: () => undefined,
};

export const CurrencyContext = createContext<CurrencyContextType>(defaultCurrencyContext);

export const useCurrency = (): CurrencyContextType => {
  return useContext(CurrencyContext);
};
