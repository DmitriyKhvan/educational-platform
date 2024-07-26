import type { CurrencyDictionary } from "@/shared/constants/global";
import { createContext, useContext } from "react";

interface CurrencyContextType {
	loadingCurrency: boolean;
	curCurrency?: CurrencyDictionary;
}

const defaultCurrencyContext: CurrencyContextType = {
	loadingCurrency: false,
	curCurrency: {
		label: "",
		value: "KRW", // default to USD?
		locales: "ko-KR",
		active: true,
	},
};

export const CurrencyContext = createContext<CurrencyContextType>(
	defaultCurrencyContext,
);

export const useCurrency = (): CurrencyContextType => {
	return useContext(CurrencyContext);
};
