import { DiscountType, type Package } from '@/types/types.generated';

export const calculatePriceWithDiscount = (pkg?: Package) => {
  const minimumPaymentAmount = 1000; //KRW

  let price = pkg?.prices?.[0]?.price ?? 0 * (1 - (pkg?.discount ?? 0) / 100);
  if (pkg?.promotionCode?.discountType === DiscountType.Fixed) {
    price =
      pkg.prices?.[0]?.price ?? 0 * (1 - (pkg?.discount ?? 0) / 100) - pkg.promotionCode.value; // promotionCode has no "discount" field
  }

  return Math.round(price > 0 ? price : minimumPaymentAmount);
};
