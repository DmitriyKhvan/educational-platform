import { useContext } from "react";
import { CurrencyContext } from "./currency-context";

export const useCurrency = () => {
	return useContext(CurrencyContext);
};
