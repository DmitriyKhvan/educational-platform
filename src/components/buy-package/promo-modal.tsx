import Button from '@/components/form/button';
import InputField from '@/components/form/input-field';
import Loader from '@/components/loader/loader';
import { APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER } from '@/shared/apollo/graphql';
import { DiscountType } from '@/shared/constants/global';
import { currencyFormat } from '@/shared/utils/currency-format';
import notify from '@/shared/utils/notify';
import { Currency, type Mutation, type Package } from '@/types/types.generated';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const PromoModal = ({
  selectedPackage,
  setPromoPackage,
  setIsOpen,
}: {
  selectedPackage: Package;
  setPromoPackage: (promoPackage: Package) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [t] = useTranslation('purchase');

  const [applyDiscount, { loading }] = useMutation<Mutation>(
    APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER,
  );

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      promo: selectedPackage?.promotionCode?.code,
    },
  });

  const onSubmitHandler = ({ promo }: { promo?: string }) => {
    applyDiscount({
      variables: {
        code: promo,
        packageId: selectedPackage.id,
        currency: (localStorage.getItem('currency') || Currency.Krw).toLowerCase(),
      },
      onCompleted: (data) => {
        if (!data.applyPromotionCodeForPackage.promotionCode) {
          notify('Promo code is invalid', 'error');
          return;
        }
        const discount =
          data.applyPromotionCodeForPackage.promotionCode.discountType == 'percent'
            ? `${data.applyPromotionCodeForPackage.promotionCode.value}%`
            : currencyFormat({
                number: data.applyPromotionCodeForPackage.promotionCode.value,
              });
        notify(`Code: ${promo} applied, your discount is ${discount}`, 'success');

        const promoPackage = structuredClone(selectedPackage);

        if (data.applyPromotionCodeForPackage.promotionCode.discountType === DiscountType.PERCENT) {
          promoPackage.discount =
            selectedPackage?.discount ?? 0 + data.applyPromotionCodeForPackage.promotionCode.value;
        } else {
          promoPackage.promotionCode = {
            discountType: data.applyPromotionCodeForPackage.promotionCode.discountType,
            // discount: data.applyPromotionCodeForPackage.promotionCode?.value,
          };
        }
        setPromoPackage(promoPackage);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    setIsOpen(false);
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
