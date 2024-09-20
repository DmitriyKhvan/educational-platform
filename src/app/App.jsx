import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Loader from 'src/components/Loader/Loader';
import { UPDATE_USER } from 'src/shared/apollo/mutations/user/updateUser';
import {
  Currencies,
  Language,
  currenciesDic,
  languagesDic,
  setItemToLocalStorage,
} from 'src/shared/constants/global';
import notify from 'src/shared/utils/notify';
import { useAuth } from './providers/AuthProvider';
import { useCurrency } from './providers/CurrencyProvider';
import { AppRouter } from './providers/router';

function App() {
  const { loadingCurrency } = useCurrency();
  const { user } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const [_, i18n] = useTranslation();

  const { setCurCurrency, setLoadingCurrency } = useCurrency();
  const [searchParams] = useSearchParams();
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    const langParam = searchParams.get('lang');

    const currency =
      langParam === Language.KR
        ? Currencies.KRW
        : langParam === Language.CH
          ? Currencies.TWD
          : Currencies.USD;

    const onCompleted = () => {
      setCurCurrency(
        currenciesDic.find((c) => c.value === currency) ?? currenciesDic[0],
      );
      localStorage.setItem('currency', currency);
      setItemToLocalStorage('language', langParam);
      i18n.changeLanguage(langParam);
    };

    if (languagesDic.find((ld) => langParam === ld.value)) {
      if (!user?.id) {
        onCompleted();
        return;
      }

      setLoadingCurrency(true);
      updateUser({
        variables: {
          id: Number.parseInt(user?.id),
          data: {
            paymentCurrency: currency.toLowerCase(),
          },
        },
        onCompleted,
        onError: () => {
          notify('Failed to set language', 'error');
        },
      });
      setLoadingCurrency(false);
    }
  }, [searchParams, user]);

  return (
    <>
      {loadingCurrency && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}
      <AppRouter />
      <Toaster />
    </>
  );
}

export default App;
