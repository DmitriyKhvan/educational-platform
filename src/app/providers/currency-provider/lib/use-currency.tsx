import { useContext } from "react";
import { CurrencyContext } from "@/app/providers/currency-provider/lib/currency-context";

export const useCurrency = () => {
	return useContext(CurrencyContext);
};
