import { Currencies } from '../constants/global';

export const currencyFormat = ({
  locales = 'ko-KR',
  style = 'currency',
  currency = Currencies.KRW,
  number,
}) => {
  const formatNumber = currency === Currencies.KRW ? number : number / 100;

  return new Intl.NumberFormat(locales, {
    style,
    currency,
  }).format(formatNumber);
};
