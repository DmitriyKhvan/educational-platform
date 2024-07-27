import { DiscountType } from '@/shared/constants/global';
import type { Package } from '@/types/types.generated';

export const calculatePriceWithDiscount = (pkg: Package) => {
  const minimumPaymentAmount = 1000; //KRW

  let price = pkg.price * (1 - pkg.discount / 100);
  if (pkg?.promotionCode?.discountType == DiscountType.FIXED) {
    price = pkg.price * (1 - pkg.discount / 100) - pkg.promotionCode.discount;
  }

  return Math.round(price > 0 ? price : minimumPaymentAmount);
};
