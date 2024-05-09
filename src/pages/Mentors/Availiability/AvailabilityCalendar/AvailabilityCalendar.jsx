import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useRef, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  COURSE_COLORS,
  CalendarView,
  Language,
  courseColorsDict,
} from 'src/constants/global';
import AvailabilityCalendarHeader from './AvailabilityCalendarHeader';
import { addMonths, format, subMonths } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useAuth } from 'src/modules/auth';
import { useTranslation } from 'react-i18next';
import koLocale from '@fullcalendar/core/locales/ko';
import chLocale from '@fullcalendar/core/locales/zh-tw';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { cn } from 'src/utils/functions';
// import { format } from 'date-fns';
// import { utcToZonedTime } from 'date-fns-tz';

const AvailabilityCalendar = ({ gatherAvailabilities }) => {
  // eslint-disable-next-line no-unused-vars
  const [_, i18n] = useTranslation();
  const { user } = useAuth();
  const calendarRef = useRef();

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log(gatherAvailabilities, 'gatherAvailabilities');

  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (gatherAvailabilities) {
      const tempEvents = gatherAvailabilities?.only_regular?.map(
        (ap, index) => {
          return {
            id: index,
            title: `${ap.day} ${ap.slots[0].from} ${ap.slots[0].to}`,
            daysOfWeek: ap.day === 'Sunday' ? [0] : [],
            startRecur: subMonths(new Date(), 3),
            endRecur: addMonths(new Date(), 3),
            // start: new Date(),
            // end: ap.end_at,
            resource: ap,
          };
        },
      );
      setCalendarEvents([...tempEvents]);
    }
  }, [gatherAvailabilities]);

  const renderEventContent = (eventInfo) => {
    const data = eventInfo.event.extendedProps.resource;
    console.log(data, "DATA")
    console.log(eventInfo, "eventInfo")

    let content = <></>;

    return (
      <div
        className={cn(
          'flex items-center px-2 min-h-[28px] h-full w-full text-gray-800 bg-gray-800 bg-opacity-15 hover:bg-opacity-100 transition-all duration-150 ease-in-out hover:text-white rounded-[4px] border-l-4 border-l-gray-800 overflow-hidden truncate',
          data.isTrial && courseColorsDict[COURSE_COLORS.YELLOW]?.event,
        )}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="border border-color-border-grey rounded-xl shadow-[0px_0px_8px_0px_#00000014]">
      <AvailabilityCalendarHeader calendarRef={calendarRef} />
      <FullCalendar
        ref={calendarRef}
        headerToolbar={null}
        scrollTimeReset={false}
        nowIndicator={true}
        locales={[enLocale, koLocale, chLocale]}
        locale={
          i18n.language === Language.KR
            ? koLocale
            : i18n.language === Language.CH
            ? chLocale
            : Language.EN
        }
        events={calendarEvents}
        eventContent={renderEventContent}
        s
        plugins={[dayGridPlugin, timeGridPlugin]}
        dayMaxEvents={true}
        initialView={CalendarView.MONTH_VIEW}
        allDaySlot={false}
        displayEventTime={false}
        eventBackgroundColor="transparent"
        eventBorderColor="transparent"
        dayPopoverFormat={{ month: 'long', day: 'numeric' }}
        slotDuration="01:00:00"
        scrollTime={format(
          utcToZonedTime(new Date(), userTimezone),
          'HH:00:00',
        )}
      />
    </div>
  );
};

export default AvailabilityCalendar;
