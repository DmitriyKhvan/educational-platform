import MyDropdownMenu from "@/components/dropdown-menu";
import Button from "@/components/form/button";
import { CurrencySwitcher } from "@/entities/currency-switcher/ui/currency-switcher";
import  { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useCurrency } from "@/app/providers/currency-provider";
import { LangSwitcher, useCurrentLang } from "@/entities/lang-switcher";

export const LangCurrencySwitcher = ({ align } : {
	align?: "start" | "end";
}) => {
	const { curCurrency } = useCurrency();
	const currentLang = useCurrentLang();

	const [t] = useTranslation(["translations", "common"]);
	const [open, setOpen] = useState(false);

	return (
		<MyDropdownMenu
			open={open}
			setOpen={setOpen}
			align={align}
			button={
				<Button
					theme="gray"
					className="flex w-full justify-between items-center gap-2"
				>
					{currentLang?.label && (

						<span className="grow text-left">{`${t(currentLang?.label, { ns: "common" })}, ${curCurrency?.label}`}</span>
					)}
					{open ? <FaAngleUp /> : <FaAngleDown />}
				</Button>
			}
		>
			<div className="space-y-5 w-[240px] p-5">
				<div className="space-y-3">
					<h5 className="text-sm font-bold">{t("language")}</h5>
					<LangSwitcher currentLang={currentLang} />
				</div>
				<div className="space-y-3">
					<h5 className="text-sm font-bold">{t("currency")}</h5>

					<CurrencySwitcher />
				</div>
			</div>
		</MyDropdownMenu>
	);
};
