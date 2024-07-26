import { addMinutes, isWithinInterval, subMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const isBetween = ({ dateStart, duration, userTimezone }) => {
	const dateLesson = toZonedTime(dateStart, userTimezone);

	const today = toZonedTime(new Date(), userTimezone);

	const tenMinuteBeforeStart = subMinutes(dateLesson, 10);
	const beforeEndLesson = addMinutes(dateLesson, duration);

	const isBetween = isWithinInterval(today, {
		start: tenMinuteBeforeStart,
		end: beforeEndLesson,
	});

	return isBetween;
};
