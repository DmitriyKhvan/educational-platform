import React, { useMemo, useState } from "react";
import { Currencies, currenciesDic } from "@/shared/constants/global";
import { CurrencyContext } from "@/app/providers/currency-provider/lib/currency-context";

export const CurrencyProvider = ({ children }) => {
	const defaultCurrency = useMemo(() => {
		const curCurrency = currenciesDic
			.filter((currency) => currency.active)
			.find(
				(currency) =>
					currency.value ===
					(localStorage.getItem("currency") || Currencies.KRW),
			);

		if (!curCurrency) {
			return currenciesDic.find(
				(currency) => currency.value === Currencies.KRW,
			);
		}

		return curCurrency;
	}, []);

	const [curCurrency, setCurCurrency] = useState(defaultCurrency);

	const [loadingCurrency, setLoadingCurrency] = useState(false);

	const findCurrency = (value) => {
		return currenciesDic.find(
			(currency) => currency.value === value?.toString()?.toUpperCase(),
		);
	};

	return (
		<CurrencyContext.Provider
			value={{
				findCurrency,
				curCurrency,
				setCurCurrency,
				setLoadingCurrency,
				loadingCurrency,
			}}
		>
			{children}
		</CurrencyContext.Provider>
	);
};
