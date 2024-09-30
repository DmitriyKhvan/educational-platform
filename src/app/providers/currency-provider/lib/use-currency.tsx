import type { CurrencyDictionary } from '@/shared/constants/global';
import { type Dispatch, type SetStateAction, createContext, useContext } from 'react';

interface CurrencyContextType {
  loadingCurrency: boolean;
  curCurrency?: CurrencyDictionary;
  findCurrency?: (value: string) => CurrencyDictionary | undefined;
  setCurCurrency?: Dispatch<SetStateAction<CurrencyDictionary | undefined>>;
  setLoadingCurrency?: Dispatch<SetStateAction<boolean>>;
}

const defaultCurrencyContext: CurrencyContextType = {
  loadingCurrency: false,
  curCurrency: {
    label: '',
    value: 'KRW', // default to USD?
    locales: 'ko-KR',
    active: true,
  },
  // findCurrency: (value)=>{return},
  // setCurCurrency:,
  // setLoadingCurrency:,
};

export const CurrencyContext = createContext<CurrencyContextType>(defaultCurrencyContext);

export const useCurrency = (): CurrencyContextType => {
  return useContext(CurrencyContext);
};
