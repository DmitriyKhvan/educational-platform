import React from 'react';
import InputField from '../Form/InputField';
import { useForm } from 'react-hook-form';
import Button from '../Form/Button';
import { useMutation } from '@apollo/client';
import { APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER } from 'src/modules/auth/graphql';
import { currencyFormat } from 'src/utils/currencyFormat';
import notify from 'src/utils/notify';
import { DiscountType } from 'src/constants/global';
import Loader from '../Loader/Loader';
import { useTranslation } from 'react-i18next';

export const PromoModal = ({ selectedPackage, setPromoPackage, setIsOpen }) => {
  const [t] = useTranslation('purchase');

  const [applyDiscount, { loading }] = useMutation(
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
      onError: () => {
        notify('Promo code not valid', 'error');
      },
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <fieldset>
          <legend className="text-[22px] font-bold">{t('promo_code')}</legend>

          <InputField
            className="w-full mt-4 mb-6"
            {...register('promo', {
              required: 'promo is required',
            })}
          />
        </fieldset>

        <Button type="submit" disabled={!isValid} className="w-full">
          {t('add')}
        </Button>
      </form>
    </>
  );
};
