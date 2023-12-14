import React from 'react';
import InputField from '../Form/InputField';
import { useForm } from 'react-hook-form';
import Button from '../Form/Button';
import { useMutation } from '@apollo/client';
import { APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER } from 'src/modules/auth/graphql';
import { currencyFormat } from 'src/utils/currencyFormat';
import notify from 'src/utils/notify';
import { DiscountType } from 'src/constants/global';

export const PromoModal = ({ selectedPackage, setPromoPackage, setIsOpen }) => {
  const [applyDiscount] = useMutation(
    APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER,
  );

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({});

  const onSubmitHandler = ({ promo }) => {
    applyDiscount({
      variables: {
        code: promo,
        packageId: selectedPackage.id,
      },
      onCompleted: (data) => {
        const discount =
          data.applyPromotionCodeForPackage.promotionCode.discountType ==
          'percent'
            ? `${data.applyPromotionCodeForPackage.promotionCode.value}%`
            : currencyFormat({
                number: data.applyPromotionCodeForPackage.promotionCode.value,
              });
        notify(
          `Code: ${promo} applied, your discount is ${discount}`,
          'success',
        );

        const promoPackage = structuredClone(selectedPackage);

        if (
          data.applyPromotionCodeForPackage.promotionCode.discountType ===
          DiscountType.PERCENT
        ) {
          promoPackage.discount =
            selectedPackage.discount +
            data.applyPromotionCodeForPackage.promotionCode.value;
        } else {
          promoPackage.promotionCode = {
            discountType:
              data.applyPromotionCodeForPackage.promotionCode.discountType,
            discount: data.applyPromotionCodeForPackage.promotionCode.value,
          };
        }
        setPromoPackage(promoPackage);
        setIsOpen(false);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  return (
    <>
      <h3 className="text-[22px] font-bold">Promo code</h3>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <InputField
          className="w-full mt-4 mb-6"
          {...register('promo', {
            required: 'promo is required',
          })}
        />

        <Button type="submit" disabled={!isValid} className="w-full">
          Add
        </Button>
      </form>
    </>
  );
};
