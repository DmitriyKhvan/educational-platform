import { Currencies } from '../constants/global';

export const currencyFormat = ({
  locales = 'ko-KR',
  style = 'currency',
  currency = Currencies.KRW,
  number,
  ...props
}) => {
  // const formatNumber = currency === Currencies.KRW ? number : number / 100;
  let formatNumber = number;

  switch (currency) {
    case Currencies.USD:
      formatNumber = number / 100;
      break;
    case Currencies.TWD:
      formatNumber = Math.ceil(number / 100);
      break;
    default:
      formatNumber;
  }

  return new Intl.NumberFormat(locales, {
    style,
    currency,
    ...props,
    ...(currency === Currencies.TWD && { minimumFractionDigits: 0 }),
  }).format(formatNumber);
};
