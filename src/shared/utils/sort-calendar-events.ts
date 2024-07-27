import type {
  CalendarEvent,
  CalendarEventProcessed,
  CalendarEventsSorted,
  SortCalendarEventsResult,
} from '@/types';

import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

export const sortCalendarEvents = (
  data: CalendarEvent[],
  timeZone: string,
): SortCalendarEventsResult | undefined => {
  if (!data) return undefined;

  const eventDates: { [key: string]: CalendarEvent[] } = {};

  for (const apt of data) {
    const startAt = new Date(apt.startAt);
    const date = format(startAt, 'yyyy-MM-dd');
    if (eventDates[date]) {
      eventDates[date].push(apt);
    } else {
      eventDates[date] = [apt];
    }
  }

  const eventKeys = Object.keys(eventDates);
  const calendarEvents: CalendarEventProcessed[] = [];

  for (const key of eventKeys) {
    for (const eventDate of eventDates[key]) {
      const duration = Number(eventDate.duration) ?? 0;

      const iterateEvents: CalendarEventProcessed = {
        playground: eventDate.playground,
        lesson: eventDate?.packageSubscription?.package?.course?.title ?? '',
        courseId: eventDate?.packageSubscription?.package?.course?.id ?? '',
        startAt: toZonedTime(new Date(eventDate.startAt), timeZone ?? 'Ne'),
        end_at: addMinutes(toZonedTime(new Date(eventDate.startAt), timeZone), duration),
        type: eventDate.type,
        mentor: eventDate.mentor,
        student: eventDate.student,
        isTrial: eventDate.isTrial,
        eventDate: eventDate,
        status: eventDate.status,
        packageSubscription: eventDate.packageSubscription,
        topic: eventDate.topic,
        languageLevel: eventDate.languageLevel,
        duration: duration,
      };

      calendarEvents.push(iterateEvents);
    }
  }

  const tablularEventData: CalendarEventsSorted[] = [];

  for (const eventKey of eventKeys) {
    for (const eventDate of eventDates[eventKey]) {
      const duration = Number(eventDate.duration) ?? 0;
      const mentor = eventDate.mentor
        ? `${eventDate?.mentor?.firstName ?? ''} ${eventDate?.mentor?.lastName?.charAt(0).toUpperCase()}.`
        : '';

      const startTime = format(toZonedTime(new Date(eventDate.startAt), timeZone), 'hh:mm a', {
        timeZone: timeZone,
      });
      const endTime = format(
        addMinutes(toZonedTime(new Date(eventDate.startAt), timeZone), duration),
        'hh:mm a',
        { timeZone: timeZone },
      );

      const tableRow: CalendarEventsSorted = {
        dateTime: {
          startTime,
          endTime,
          date: format(toZonedTime(new Date(eventDate.startAt), timeZone), 'eee, MMM do', {
            timeZone: timeZone,
          }),
        },
        sessionTime: new Date(eventDate.startAt),
        mentor,
        resource: eventDate,
      };
      tablularEventData.push(tableRow);
    }
  }
  return { tablularEventData, calendarEvents };
};
