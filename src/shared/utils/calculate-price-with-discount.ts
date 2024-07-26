import { DiscountType } from "src/shared/constants/global";

export const calculatePriceWithDiscount = (pkg) => {
	const minimumPaymentAmount = 1000; //KRW

	let price = pkg.price * (1 - pkg.discount / 100);
	if (pkg?.promotionCode?.discountType == DiscountType.FIXED) {
		price = pkg.price * (1 - pkg.discount / 100) - pkg.promotionCode.discount;
	}

	return Math.round(price > 0 ? price : minimumPaymentAmount);
};
