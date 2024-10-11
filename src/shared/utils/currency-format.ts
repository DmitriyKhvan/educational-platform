import { Currency } from '@/types/types.generated';

export const currencyFormat = ({
  locales = 'ko-KR',
  style = 'currency',
  currency = Currency.Krw,
  number,
}: {
  locales?: string;
  style?: 'decimal' | 'currency' | 'percent' | 'unit';
  currency?: Currency | string;
  number: number;
}) => {
  let formatNumber = number;

  switch (currency) {
    case Currency.Usd:
      formatNumber = number / 100;
      break;
    case Currency.Twd:
      formatNumber = Math.ceil(number / 100);
      break;
    default:
      formatNumber;
  }

  return new Intl.NumberFormat(locales, {
    style,
    currency,
    ...(currency === Currency.Twd && { minimumFractionDigits: 0 }),
  }).format(formatNumber);
};
