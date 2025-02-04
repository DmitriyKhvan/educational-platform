import { useAuth } from '@/app/providers/auth-provider';
import Calendar from '@/components/calendar/calendar';
import Loader from '@/components/loader/loader';
import AvailabilityCalendarHeader from '@/pages/mentors/availability/availability-calendar/availability-calendar-header';
import { renderRecurEvents } from '@/pages/mentors/availability/availability-calendar/events/lib/render-recur-events';
import { renderSingleEvents } from '@/pages/mentors/availability/availability-calendar/events/lib/render-single-events';
import MonthlyEvent from '@/pages/mentors/availability/availability-calendar/events/monthly-event';
import WeeklyEvent from '@/pages/mentors/availability/availability-calendar/events/weekly-event';
import { APPOINTMENTS_QUERY } from '@/shared/apollo/graphql';
import { MENTOR } from '@/shared/apollo/queries/mentors/mentor';
import { CalendarView, type CalendarViewType } from '@/shared/constants/global';
import type { CalendarEvent, MonthlyViewEvent, WeeklyViewEvent } from '@/types';
import { useQuery } from '@apollo/client';
import type { EventSourceInput } from '@fullcalendar/core';
import type FullCalendar from '@fullcalendar/react';

import { useEffect, useRef, useState } from 'react';

export const AvailabilityCalendar = () => {
  const { user } = useAuth();
  const calendarRef = useRef<FullCalendar | null>(null);

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
  } = useQuery(MENTOR, {
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id },
  });

  const { data: appointments, loading: loadingAppointments } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: 'approved,scheduled,rescheduled',
    },
    fetchPolicy: 'no-cache',
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [monthlyEvents, setMonthlyEvents] = useState<MonthlyViewEvent[]>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyViewEvent[]>([]);

  const updateEvents = (view: CalendarViewType) => {
    if (view === CalendarView.MONTH_VIEW) setCalendarEvents(monthlyEvents);
    if (view === CalendarView.WEEK_VIEW) setCalendarEvents(weeklyEvents as CalendarEvent[]);
  };

  useEffect(() => {
    if (mentorInfo?.availabilities && !loadingAppointments && appointments) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const regular = mentorInfo?.availabilities?.filter((a: any) => !a.isTrial);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const trial = mentorInfo?.availabilities?.filter((a: any) => a.isTrial);
      const exceptions = mentorInfo?.exceptionDates;

      const { monthlyViewEvents, weeklyViewEvents } = renderRecurEvents(regular, trial, exceptions);

      const { lessonEvents, exceptionsMonthlyEvents, exceptionsWeeklyEvents } = renderSingleEvents({
        appointments,
        exceptions,
        monthlyViewEvents,
        userTimezone,
      });

      setWeeklyEvents([...weeklyViewEvents, ...exceptionsWeeklyEvents, ...lessonEvents]);

      setMonthlyEvents([...monthlyViewEvents, ...exceptionsMonthlyEvents]);

      setCalendarEvents([...monthlyViewEvents, ...exceptionsMonthlyEvents]);
    }
  }, [mentorInfo, appointments, loadingMentor, loadingAppointments]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderEventContent = (eventInfo: any) => {
    const data = eventInfo.event.extendedProps;

    if (eventInfo.view.type !== CalendarView.WEEK_VIEW && data.view === CalendarView.WEEK_VIEW)
      return;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    if (data?.exception?.find((e: any) => !e.from && !e.to)) {
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
      <AvailabilityCalendarHeader calendarRef={calendarRef} updateEvents={updateEvents} />
      <Calendar
        ref={calendarRef}
        events={calendarEvents as EventSourceInput}
        eventContent={renderEventContent}
      />
    </div>
  );
};
