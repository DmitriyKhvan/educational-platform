import type { UpdatedPackage } from '@/components/buy-package/packages';
import { DiscountType } from '@/types/types.generated';

export const calculatePriceWithDiscount = (pkg?: UpdatedPackage) => {
  const minimumPaymentAmount = 1000; //KRW

  let price = (pkg?.price ?? 0) * (1 - (pkg?.discount ?? 0) / 100);
  if (pkg?.promotionCode?.discountType === DiscountType.Fixed) {
    price = pkg.price * (1 - (pkg?.discount ?? 0) / 100) - pkg.promotionCode.value;
  }

  return Math.round(price > 0 ? price : minimumPaymentAmount);
};
