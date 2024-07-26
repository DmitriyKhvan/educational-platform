import { toZonedTime } from "date-fns-tz";

export const isWithinHours = ({ dateEnd, dateStart, hours, userTimezone }) => {
	const isWithinHours =
		toZonedTime(dateEnd, userTimezone) - toZonedTime(dateStart, userTimezone) <=
		hours * 60 * 60 * 1000;

	return isWithinHours;
};
