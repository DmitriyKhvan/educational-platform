
import { useMutation } from "@apollo/client";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import '../assets/styles/buy_package.scss';
import { APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER } from "src/modules/auth/graphql";
import notify from '../utils/notify';

export default function BuyPackageDiscountForm({ selectedPackage }) {
    const [t] = useTranslation(['translations']);
    const codeInput = useRef(null);
    const [applyDiscount] = useMutation(APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER);
    const makeQuery = async () => {
        applyDiscount({
            variables: {
                code: codeInput.current.value,
                packageId: selectedPackage.id,
            },
            onCompleted: async (data) => {
                const discount = data.applyPromotionCodeForPackage.promotionCode.discountType == 'percent' ? `${data.applyPromotionCodeForPackage.promotionCode.value}%` : new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                  }).format(data.applyPromotionCodeForPackage.promotionCode.value)
                notify(`Code: ${codeInput.current.value} applied, your discount is ${discount}`, 'success');
            },
            onError: (error) => {
                notify(error.message, 'error');
            },            
        });
    }
    
return (<div className="apply_promotion_controls_wrapper">
    <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        ref={codeInput}
    />
    <button
        className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 max-w-[16rem] justify-center self-end w-full flex flex-row gap-2 items-center hover:brightness-75 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        type="button"
        onClick={() => makeQuery()}
    >
        {t('use_discount')}
    </button>
    </div>
);
}
