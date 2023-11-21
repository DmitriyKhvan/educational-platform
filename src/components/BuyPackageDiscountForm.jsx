import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER } from 'src/modules/auth/graphql';
import notify from '../utils/notify';
import { useState } from 'react';
import { currencyFormat } from 'src/utils/currencyFormat';
import { DiscountType } from 'src/constants/global';

export default function BuyPackageDiscountForm({
  selectedPackage,
  setCourseData,
  courseData,
}) {
  const [t] = useTranslation(['translations']);
  const [codeInput, setCodeInput] = useState('');
  const [applyDiscount] = useMutation(
    APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER,
  );
  const makeQuery = () => {
    applyDiscount({
      variables: {
        code: codeInput,
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
          `Code: ${codeInput} applied, your discount is ${discount}`,
          'success',
        );

        const cloneСourseData = structuredClone(courseData);

        let packageFind = cloneСourseData.packages.find(
          (packageItem) =>
            packageItem.id ===
            data.applyPromotionCodeForPackage.selectedPackage.id,
        );

        if (
          data.applyPromotionCodeForPackage.promotionCode.discountType ===
          DiscountType.PERCENT
        ) {
          packageFind.discount =
            packageFind.discount +
            data.applyPromotionCodeForPackage.promotionCode.value;
        } else {
          packageFind.promotionCode = {
            discountType:
              data.applyPromotionCodeForPackage.promotionCode.discountType,
            discount: data.applyPromotionCodeForPackage.promotionCode.value,
          };
        }

        setCourseData(cloneСourseData);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        onChange={(e) => setCodeInput(e.target.value)}
      />
      <button
        className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 px-8 justify-center self-end flex flex-row gap-2 items-center hover:brightness-75 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        type="button"
        onClick={makeQuery}
      >
        {t('use_discount')}
      </button>
    </div>
  );
}
