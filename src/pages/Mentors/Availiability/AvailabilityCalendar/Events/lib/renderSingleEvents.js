import { CalendarView, DAY } from 'src/constants/global';
import { EventType } from './EventType';
import { addMinutes } from 'date-fns';

export function renderSingleEvents({
  appointments,
  exceptions,
  monthlyViewEvents,
}) {
  const exceptionsMonthlyEvents = [];
  const exceptionsWeeklyEvents = [];
  exceptions?.forEach((ex) => {
    const exDate = new Date(ex.date);

    if (exDate < new Date()) return;

    const mve = monthlyViewEvents.find(
      (mve) => mve.day === DAY[exDate.getDay()],
    );

    exceptionsMonthlyEvents.push({
      ...mve,
      rrule: undefined,
      exception: { from: ex.from, to: ex.to },
      allDay: true,
      start: exDate,
    });

    exceptionsWeeklyEvents.push({
      type: EventType.EXCEPTION,
      view: CalendarView.WEEK_VIEW,
      start: new Date(`${ex.date}T${ex.from ? ex.from : '00:00'}:00`),
      end: new Date(`${ex.date}T${ex.to ? ex.to : '24:00'}:00`),
    });
  });

  const lessonEvents = appointments?.lessons?.map((l) => ({
    view: CalendarView.WEEK_VIEW,
    title: `${l.student.firstName} ${l.student.lastName}`,
    allDay: false,
    start: new Date(l.startAt),
    end: addMinutes(new Date(l.startAt), l.duration),
    type: EventType.LESSON,
    isTrial: l.isTrial,
    test: true,
  }));

  return { lessonEvents, exceptionsMonthlyEvents, exceptionsWeeklyEvents };
}
