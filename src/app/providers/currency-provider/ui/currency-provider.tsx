import { CurrencyContext } from '@/app/providers/currency-provider/lib/use-currency';
import { UPDATE_USER } from '@/shared/apollo/mutations/user/update-user';
import { type CurrencyDictionary, currenciesDic } from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import { CourseTranslationsLanguage, Currency } from '@/types/types.generated';
import { useMutation } from '@apollo/client';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth-provider';

const defaultCurrenciesDic = {
  [CourseTranslationsLanguage.En]: Currency.Usd,
  [CourseTranslationsLanguage.Kr]: Currency.Krw,
  [CourseTranslationsLanguage.Cn]: Currency.Twd,
} as const;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [curCurrency, setCurCurrency] = useState<CurrencyDictionary>();

  const findCurrency = (value: string) => {
    return currenciesDic.find((currency) => currency.value === value?.toString()?.toUpperCase());
  };

  const [updateUser] = useMutation(UPDATE_USER);

  const onChangeCurrency = async (currency: CurrencyDictionary) => {
    setLoadingCurrency?.(true);
    await updateUser({
      variables: {
        id: Number.parseInt(user?.id ?? ''),
        data: {
          paymentCurrency: currency.value.toLowerCase(),
        },
      },
      onCompleted: () => {
        setCurCurrency(currency);
        localStorage.setItem('currency', currency.value);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
    setLoadingCurrency?.(false);
  };

  useEffect(() => {
    if (user) {
      const curCurrency = currenciesDic
        .filter((currency) => currency.active)
        .find(
          (currency) =>
            currency.value ===
            (localStorage.getItem('currency')?.toLowerCase() ||
              defaultCurrenciesDic[i18n.language as CourseTranslationsLanguage] ||
              Currency.Krw),
        );

      if (!localStorage.getItem('currency')) {
        onChangeCurrency(curCurrency as CurrencyDictionary);
      } else {
        setCurCurrency(curCurrency as CurrencyDictionary);
      }
    }
  }, [user]);

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
