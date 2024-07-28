import { currencyFormat } from "@/shared/utils/currency-format";
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/app/providers/currency-provider";
import { calculatePriceWithDiscount } from "@/shared/utils/calculate-price-with-discount";
import CheckboxField from "@/components/form/checkbox-field";
import type { Package } from "@/types/types.generated";

export const Packages = memo(function Packages({
	filteredPackage,
	setSelectedPackage,
	selectedPackage,
	setPromoPackage,
}: {
	filteredPackage?: Package[];
	setSelectedPackage: (pkg: Package) => void;
	selectedPackage?: Package;
	setPromoPackage: (pkg?: Package) => void;
}) {
	const { curCurrency } = useCurrency();
	const [t] = useTranslation(["purchase", "common", "translations"]);
	const [parent] = useAutoAnimate();
	return (
		<div>
			<h4 className="text-[15px] font-semibold leading-[18px] mb-4">
				4. {t("length", { ns: "purchase" })}
			</h4>
			<div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3" ref={parent}>
				{filteredPackage?.map((pkg) => {
					return (
						<label
							key={pkg.id}
							className={`flex items-center justify-between w-full md:w-[387px] p-5 rounded-lg border border-color-border-grey transition duration-300 ease-in-out cursor-pointer hover:border-color-purple/50 ${
								selectedPackage === pkg && "border-color-purple/50"
							}`}
						>
							<div className="flex items-center gap-4 sm:gap-5">
								<CheckboxField
									type="radio"
									name="package"
									checked={selectedPackage === pkg}
									onChange={() => {
										setSelectedPackage(pkg);
										setPromoPackage();
									}}
								/>
								<div className="grow flex flex-col gap-2">
									<p className="text-xl font-bold">
										{`${pkg.period} ${t("months", {
											count: pkg.period as number,
										})}`}
									</p>

									<p className="text-[15px]">
										{pkg?.discount ? (
											<>
												<span>
													{currencyFormat({
														currency: curCurrency?.value,
														locales: curCurrency?.locales,
														number:
														pkg.period ? calculatePriceWithDiscount(pkg) / pkg.period : 0,
													})}
													/mo.
												</span>
												<span className="text-[13px] ml-[6px] text-color-red line-through">
													{currencyFormat({
														currency: curCurrency?.value,
														locales: curCurrency?.locales,
														number: pkg.prices?.[0]?.price && pkg.period && (pkg.prices?.[0]?.price / pkg.period) || 0,
													})}
													/mo.
												</span>
											</>
										) : (
											<span>
												{currencyFormat({
													currency: curCurrency?.value,
													locales: curCurrency?.locales,
													number: pkg?.prices?.[0]?.price && (pkg?.prices?.[0]?.price) || 0,
												})}
											</span>
										)}
									</p>

									<p className="text-sm opacity-75">
										{`${pkg.totalSessions} ${t("lessons", {
											ns: "common",
										})}, ${currencyFormat({
											currency: curCurrency?.value,
											locales: curCurrency?.locales,
											number: pkg.totalSessions && Math.round(
												calculatePriceWithDiscount(pkg) / pkg.totalSessions,
											) || 0,
										})}/${t("lesson", {
											ns: "translations",
										})}`}
									</p>
								</div>
							</div>

							{pkg?.discount && (
								<span className="text-[11px] font-semibold text-white bg-color-red px-[10px] py-[5px] rounded-lg whitespace-nowrap">
									{pkg?.discount}% OFF
								</span>
							)}
						</label>
					);
				})}
			</div>
		</div>
	);
});
