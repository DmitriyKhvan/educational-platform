import Loader from "@/components/loader/loader";
import { APPOINTMENTS_QUERY, GET_MENTOR } from "@/shared/apollo/graphql";
import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "src/app/providers/auth-provider";
import { Calendar } from "src/components/calendar";
import { CalendarView } from "src/shared/constants/global";
import AvailabilityCalendarHeader from "./availability-calendar-header";
import { renderReccurEvents } from "./events/lib/render-reccur-events";
import { renderSingleEvents } from "./events/lib/render-single-events";
import MonthlyEvent from "./events/monthly-event";
import WeeklyEvent from "./events/weekly-event";

export const AvailabilityCalendar = () => {
	// eslint-disable-next-line no-unused-vars
	const { user } = useAuth();
	const calendarRef = useRef();

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	const {
		data: { mentor: mentorInfo } = {},
		loading: loadingMentor,
	} = useQuery(GET_MENTOR, {
		fetchPolicy: "no-cache",
		variables: { id: user?.mentor?.id },
	});

	const { data: appointments, loading: loadingAppointments } = useQuery(
		APPOINTMENTS_QUERY,
		{
			variables: {
				mentorId: user?.mentor?.id,
				status: `approved,scheduled,rescheduled`,
			},
			fetchPolicy: "no-cache",
		},
	);

	const [calendarEvents, setCalendarEvents] = useState([]);
	const [monthlyEvents, setMonthlyEvents] = useState([]);
	const [weeklyEvents, setWeeklyEvents] = useState([]);

	const updateEvents = (view) => {
		if (view === CalendarView.MONTH_VIEW) setCalendarEvents(monthlyEvents);
		if (view === CalendarView.WEEK_VIEW) setCalendarEvents(weeklyEvents);
	};

	useEffect(() => {
		if (mentorInfo?.availabilities && !loadingAppointments && appointments) {
			const regular = mentorInfo?.availabilities?.regular;
			const trial = mentorInfo?.availabilities?.trial;
			const exceptions = mentorInfo?.exceptionDates;

			const { monthlyViewEvents, weeklyViewEvents } = renderReccurEvents(
				regular,
				trial,
				exceptions,
			);

			const { lessonEvents, exceptionsMonthlyEvents, exceptionsWeeklyEvents } =
				renderSingleEvents({
					appointments,
					exceptions,
					monthlyViewEvents,
					userTimezone,
				});

			setWeeklyEvents([
				...weeklyViewEvents,
				...exceptionsWeeklyEvents,
				...lessonEvents,
			]);

			setMonthlyEvents([...monthlyViewEvents, ...exceptionsMonthlyEvents]);

			setCalendarEvents([...monthlyViewEvents, ...exceptionsMonthlyEvents]);
		}
	}, [mentorInfo, appointments, loadingMentor]);

	const renderEventContent = (eventInfo) => {
		const data = eventInfo.event.extendedProps;

		if (
			eventInfo.view.type !== CalendarView.WEEK_VIEW &&
			data.view === CalendarView.WEEK_VIEW
		)
			return;

		if (data?.exception && data?.exception?.find((e) => !e.from && !e.to)) {
			return (
				<div className="px-3 py-2 min-h-[41px] h-full 2xl:mx-2 bg-[#EDEEF0] text-[#C0C0C3] font-medium text-xs flex items-center justify-center rounded-lg overflow-hidden truncate shadow-[0px_0px_8px_0px_#00000014]">
					Date Override
				</div>
			);
		}

		if (data.view === CalendarView.MONTH_VIEW) {
			return <MonthlyEvent data={data} />;
		}

		return <WeeklyEvent data={data} eventInfo={eventInfo} />;
	};

	if (loadingMentor || loadingAppointments) {
		return <Loader height="calc(100vh - 80px)" />;
	}

	return (
		<div className="border border-color-border-grey rounded-xl">
			<AvailabilityCalendarHeader
				calendarRef={calendarRef}
				updateEvents={updateEvents}
			/>

			<Calendar
				ref={calendarRef}
				events={calendarEvents}
				eventContent={renderEventContent}
			/>
		</div>
	);
};
