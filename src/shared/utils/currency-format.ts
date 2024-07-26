import { Currencies } from "@/shared/constants/global";

export const currencyFormat = ({
	locales = "ko-KR",
	style = "currency",
	currency = Currencies.KRW,
	number,
}) => {
	let formatNumber = number;

	switch (currency) {
		case Currencies.USD:
			formatNumber = number / 100;
			break;
		case Currencies.TWD:
			formatNumber = Math.ceil(number / 100);
			break;
		default:
			formatNumber;
	}

	return new Intl.NumberFormat(locales, {
		style,
		currency,
		...(currency === Currencies.TWD && { minimumFractionDigits: 0 }),
	}).format(formatNumber);
};
