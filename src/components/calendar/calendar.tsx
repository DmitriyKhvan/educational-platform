import  FullCalendar from "@fullcalendar/react";
import { forwardRef } from "react";

import { Language } from "@/shared/constants/global";
import enLocale from "@fullcalendar/core/locales/en-gb";
import koLocale from "@fullcalendar/core/locales/ko";
import chLocale from "@fullcalendar/core/locales/zh-tw";
import { useTranslation } from "react-i18next";

import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from "@fullcalendar/timegrid";

import { useAuth } from "@/app/providers/auth-provider";
import { useMediaQuery } from "react-responsive";

import "@/app/styles/calendar.scss";
import { format, toZonedTime } from "date-fns-tz";


interface CalendarProps extends React.ComponentProps<typeof FullCalendar> {}

type CalendarRef = FullCalendar | null;

const Calendar = forwardRef<CalendarRef, CalendarProps>((props, ref) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <FullCalendar
      ref={ref}
      headerToolbar={false}
      scrollTimeReset={false}
      nowIndicator={true}
      views={{
        dayGridMonth: {
          dayHeaderFormat: { weekday: isTablet ? "short" : "long" },
        },
      }}
      locales={[enLocale, koLocale, chLocale]}
      locale={
        i18n.language === Language.KR
          ? koLocale
          : i18n.language === Language.CH
          ? chLocale
          : enLocale
      }
      now={toZonedTime(new Date(), userTimezone)}
      plugins={[dayGridPlugin, timeGridPlugin, rrulePlugin]}
      dayMaxEvents={true}
      allDaySlot={false}
      displayEventTime={false}
      eventBackgroundColor="transparent"
      eventBorderColor="transparent"
      dayPopoverFormat={{ month: "long", day: "numeric" }}
      slotDuration="01:00:00"
      scrollTime={format(toZonedTime(new Date(), userTimezone), "HH:00:00")}
      {...props}
    />
  );
});

Calendar.displayName = "Calendar";

export default Calendar;
