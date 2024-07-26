import { addMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CalendarView, DAY } from "@/shared/constants/global";
import { EventType } from "@/pages/mentors/availability/availability-calendar/events/lib/event-type";

export function renderSingleEvents({
	appointments,
	exceptions,
	monthlyViewEvents,
	userTimezone,
}) {
	const exceptionsMonthlyEvents = [];
	const exceptionsWeeklyEvents = [];
	exceptions?.forEach((ex) => {
		const exDate = new Date(ex.date);

		if (exDate < new Date()) return;

		const mve = monthlyViewEvents.find(
			(mve) => mve.day === DAY[exDate.getDay()],
		);

		const eveIdx = exceptionsMonthlyEvents.findIndex(
			(eve) => eve.date === ex.date,
		);

		if (eveIdx >= 0) {
			exceptionsMonthlyEvents[eveIdx].exception.push({
				from: ex.from,
				to: ex.to,
			});
		} else {
			exceptionsMonthlyEvents.push({
				...mve,
				rrule: undefined,
				date: ex.date,
				exception: [{ from: ex.from, to: ex.to }],
				allDay: true,
				start: exDate,
			});
		}

		exceptionsWeeklyEvents.push({
			type: EventType.EXCEPTION,
			view: CalendarView.WEEK_VIEW,
			start: new Date(`${ex.date}T${ex.from ? ex.from : "00:00"}:00`),
			end: new Date(`${ex.date}T${ex.to ? ex.to : "24:00"}:00`),
		});
	});

	const lessonEvents = appointments?.lessons?.map((l) => ({
		view: CalendarView.WEEK_VIEW,
		title: `${l.student.firstName} ${l.student.lastName}`,
		allDay: false,
		start: toZonedTime(new Date(l.startAt), userTimezone),
		end: addMinutes(toZonedTime(new Date(l.startAt), userTimezone), l.duration),
		type: EventType.LESSON,
		isTrial: l.isTrial,
		test: true,
	}));

	return { lessonEvents, exceptionsMonthlyEvents, exceptionsWeeklyEvents };
}
