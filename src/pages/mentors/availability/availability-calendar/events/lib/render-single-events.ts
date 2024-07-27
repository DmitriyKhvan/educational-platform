import { CalendarView, DAY } from '@/shared/constants/global';
import {
  EventType,
  type MonthlyViewEvent,
  type RenderSingleEventsParams,
  type RenderSingleEventsResult,
  type RenderedEvent,
} from '@/types';
import { addMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function renderSingleEvents({
  appointments,
  exceptions,
  monthlyViewEvents,
  userTimezone,
}: RenderSingleEventsParams): RenderSingleEventsResult {
  const exceptionsMonthlyEvents: MonthlyViewEvent[] = [];
  const exceptionsWeeklyEvents: RenderedEvent[] = [];

  for (const ex of exceptions) {
    const exDate = new Date(ex.date);

    if (exDate < new Date()) continue;

    const mve = monthlyViewEvents.find((mve) => mve.day === DAY[exDate.getDay()]);

    const eveIdx = exceptionsMonthlyEvents.findIndex((eve) => eve.date === ex.date);

    if (eveIdx >= 0) {
      exceptionsMonthlyEvents[eveIdx].exception?.push({
        from: ex.from ?? '00:00',
        to: ex.to ?? '24:00',
      });
    } else {
      exceptionsMonthlyEvents.push({
        ...mve,
        rrule: undefined,
        date: ex.date,
        exception: [{ from: ex.from ?? '00:00', to: ex.to ?? '24:00' }],
        allDay: true,
        start: exDate,
      });
    }

    exceptionsWeeklyEvents.push({
      type: EventType.EXCEPTION,
      view: CalendarView.WEEK_VIEW,
      start: new Date(`${ex.date}T${ex.from ?? '00:00'}:00`),
      end: new Date(`${ex.date}T${ex.to ?? '24:00'}:00`),
    });
  }

  const lessonEvents: RenderedEvent[] =
    appointments?.lessons?.map((l) => ({
      type: EventType.LESSON,
      view: CalendarView.WEEK_VIEW,
      start: toZonedTime(new Date(l.startAt), userTimezone),
      end: addMinutes(toZonedTime(new Date(l.startAt), userTimezone), l.duration),
    })) || [];

  return { lessonEvents, exceptionsMonthlyEvents, exceptionsWeeklyEvents };
}
