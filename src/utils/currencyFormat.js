export const currencyFormat = ({
  locales = 'ko-KR',
  style = 'currency',
  currency = 'KRW',
  number,
}) => {
  return new Intl.NumberFormat(locales, {
    style,
    currency,
  }).format(number);
};
