const minimumPaymentAmount = 1000; //KRW

export const calculatePriceWithDiscount = (pkg, promotionCode) => {
    let price = pkg.price * (1 - pkg.discount / 100);
    if (pkg?.promotionCode?.discountType == "fixed") {
        price = pkg.price * (1 - pkg.discount / 100) - pkg.promotionCode.discount;
    }
    
    return Math.round(
        price > 0 ? price : minimumPaymentAmount
    )
};
  