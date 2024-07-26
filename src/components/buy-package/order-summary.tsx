import { memo, useMemo, useState } from "react";

import { useMutation } from "@apollo/client";
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { currencyFormat } from "@/shared/utils/currency-format.js";
import { calculatePriceWithDiscount } from "@/shared/utils/calculate-price-with-discount.js";

import notify from "@/shared/utils/notify.js";
import { RiErrorWarningFill } from "react-icons/ri";
import Button from "@/components/form/button/index.js";
import Loader from
import { PromoModal } from "@/components/buy-package/promo-modal";
import { TermsConditionsModal } from "@/components/buy-package/terms-conditions-modal";

import { CREATE_PAYMENT_INTENT } from "@/shared/apollo/mutations/payment/create-payment-intent.js";
import { useCurrency } from "@/app/providers/currency-provider";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog/index.jsx";

import { BsPlus } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";

export const OrderSummary = memo(function OrderSummary({
	selectedPackage,
	setPromoPackage,
	promoPackage,
}) {
	const { curCurrency } = useCurrency();
	const [open, setOpen] = useState(false);
	const [openTermsConditions, setIsOpenTermsConditions] = useState(false);

	const navigate = useNavigate();
	const [parent] = useAutoAnimate();
	const [t] = useTranslation("purchase");

	const discount = useMemo(() => {
		if (promoPackage) {
			return (
				calculatePriceWithDiscount(selectedPackage) -
				calculatePriceWithDiscount(promoPackage)
			);
		}
	}, [promoPackage]);

	const [getSecret, { loading }] = useMutation(CREATE_PAYMENT_INTENT);

	const submitStripe = () => {
		if (selectedPackage) {
			getSecret({
				variables: {
					packageId: Number.parseInt(selectedPackage.id),
					currency: curCurrency.value.toLowerCase(),
					...(promoPackage && { applyPersonalDiscountCode: true }),
				},
				onCompleted: (data) => {
					const { clientSecret } = data.createPaymentIntent;
					if (clientSecret) {
						navigate(`/purchase/${selectedPackage.id}/payment/${clientSecret}`);
					}
				},
				onError: (error) => {
					notify(error.message);
				},
			});
		}
	};

	return (
		<>
			{loading && (
				<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
					<Loader />
				</div>
			)}
			<div className="w-full p-6 rounded-lg bg-[#F7F8FA] space-y-6">
				<h3 className="text-2xl font-bold">{t("order_summary")}</h3>

				{selectedPackage && !promoPackage && (
					<AdaptiveDialog
						open={open}
						setOpen={setOpen}
						button={
							<button type="button" className="flex items-center gap-2 w-full">
								<span className="flex items-center justify-center w-5 h-5 rounded-full bg-color-purple/10">
									<BsPlus className="text-color-purple" />
								</span>
								<span className="text-[13px] font-medium text-color-purple">
									{t("add_promo")}
								</span>
							</button>
						}
					>
						<PromoModal
							setIsOpen={setOpen}
							selectedPackage={selectedPackage}
							setPromoPackage={setPromoPackage}
						/>
					</AdaptiveDialog>
				)}

				{promoPackage && (
					<button
						type="button"
						className="flex items-center gap-2 w-full"
						onClick={() => setPromoPackage(null)}
					>
						<span className="flex items-center justify-center w-5 h-5 rounded-full bg-color-red/10">
							<FiMinus className="text-xs text-color-red" />
						</span>
						<span className="text-[13px] font-medium text-color-red">
							Remove promo code
						</span>
					</button>
				)}

				<div ref={parent}>
					{selectedPackage && (
						<div ref={parent} className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span>
									{`${selectedPackage.period} ${t("months", {
										count: selectedPackage.period,
									})}`}
								</span>
								<span className="font-semibold">
									{currencyFormat({
										currency: curCurrency.value,
										locales: curCurrency.locales,
										number:
											calculatePriceWithDiscount(selectedPackage) /
											selectedPackage.period,
									})}
									/mo.
								</span>
							</div>

							{discount > 0 && (
								<div className="flex items-center justify-between text-sm">
									<span>{t("promo_code")}</span>
									<span className="font-semibold text-color-purple">
										{`- ${currencyFormat({
											currency: curCurrency.value,
											locales: curCurrency.locales,
											number: discount / selectedPackage.period,
										})}`}
										/mo.
									</span>
								</div>
							)}

							<div className="divider"></div>

							<div className="flex items-center justify-between font-bold text-base">
								<span>{t("total")}</span>
								<span>
									{currencyFormat({
										currency: curCurrency.value,
										locales: curCurrency.locales,
										number:
											calculatePriceWithDiscount(
												promoPackage ? promoPackage : selectedPackage,
											) / selectedPackage.period,
									})}
									/mo.
								</span>
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center gap-4 w-full bg-[#EAECF0] rounded-md px-4 py-3">
					<RiErrorWarningFill className="min-w-5 min-h-5 text-[#908E97]" />
					<div className="text-[#908E97] space-y-1">
						<p>{t("installments_text")}</p>
					</div>
				</div>

				<AdaptiveDialog
					open={openTermsConditions}
					setOpen={setIsOpenTermsConditions}
					button={
						<Button
							disabled={!selectedPackage}
							className="w-full h-auto py-5 px-10"
						>
							{t("proceed_payment")}
						</Button>
					}
				>
					<TermsConditionsModal
						submitStripe={submitStripe}
						setIsOpenTermsConditions={setIsOpenTermsConditions}
					/>
				</AdaptiveDialog>
			</div>
		</>
	);
});
