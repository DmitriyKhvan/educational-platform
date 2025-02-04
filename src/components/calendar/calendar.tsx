import { useAuth } from '@/app/providers/auth-provider';
import {} from '@/shared/constants/global';
import enLocale from '@fullcalendar/core/locales/en-gb';
import koLocale from '@fullcalendar/core/locales/ko';
import chLocale from '@fullcalendar/core/locales/zh-tw';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import '@/app/styles/calendar.scss';
import { CourseTranslationsLanguage } from '@/types/types.generated';
import type { CalendarOptions } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { format, toZonedTime } from 'date-fns-tz';
import Loader from '../loader/loader';

interface CalendarProps extends CalendarOptions {
  isLoading?: boolean;
}

const Calendar = forwardRef<FullCalendar, CalendarProps>((props, ref) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="relative">
      {props.isLoading && (
        <>
          <div className="absolute z-50 top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader />
          </div>
          <div className="absolute z-50 bg-opacity-20 rounded-md left-0 right-0 top-0 w-full h-full bg-black" />
        </>
      )}
      <FullCalendar
        ref={ref}
        headerToolbar={false}
        scrollTimeReset={false}
        nowIndicator={true}
        views={{
          dayGridMonth: {
            dayHeaderFormat: { weekday: isTablet ? 'short' : 'long' },
          },
        }}
        locales={[enLocale, koLocale, chLocale]}
        locale={
          i18n.language === CourseTranslationsLanguage.Kr
            ? koLocale
            : i18n.language === CourseTranslationsLanguage.Cn
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
        dayPopoverFormat={{ month: 'long', day: 'numeric' }}
        nextDayThreshold="01:00:00"
        displayEventEnd={false}
        slotDuration="01:00:00"
        scrollTime={format(toZonedTime(new Date(), userTimezone), 'HH:00:00')}
        {...props}
      />
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;
