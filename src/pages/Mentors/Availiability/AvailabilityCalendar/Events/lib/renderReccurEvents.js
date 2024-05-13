import { addMonths, intervalToDuration } from 'date-fns';
import { CalendarView, DAY } from 'src/constants/global';
import { EventType } from './EventType';

const rruleWeekdays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export function renderReccurEvents(regular, trial, exceptions) {
  const monthlyViewEvents = [];
  const weeklyViewEvents = [];

  DAY.forEach((weekDay, idx) => {
    const regularWeekDays = regular?.filter((v) => v.day === weekDay);
    const trialWeekDays = trial?.filter((v) => v.day === weekDay);

    if (!regularWeekDays?.length && !trialWeekDays?.length) return;

    const rruleCommon = (dtstart) => ({
      freq: 'weekly',
      byweekday: [rruleWeekdays[idx]],
      dtstart: dtstart,
      until: addMonths(new Date(), 3).toISOString().substring(0, 10),
    });

    monthlyViewEvents.push({
      view: CalendarView.MONTH_VIEW,
      day: weekDay,
      regular: regularWeekDays?.length ? regularWeekDays : undefined,
      trial: trialWeekDays?.length ? trialWeekDays : undefined,
      rrule: rruleCommon(new Date().toISOString().substring(0, 10)),
      exdate: exceptions?.map((ex) => ex.date),
    });

    const pushWeeklyEvents = (weekDays, type) => {
      weekDays?.forEach((weekDay) => {
        weeklyViewEvents.push({
          rrule: rruleCommon(
            `${new Date().toISOString().substring(0, 10)}T${weekDay.from}:00`,
          ),
          view: CalendarView.WEEK_VIEW,
          type,
          duration: intervalToDuration({
            start: new Date(`01/01/2011 ${weekDay.from}:00`),
            end: new Date(`01/01/2011 ${weekDay.to}:00`),
          }),
          allDay: false,
          display: 'background',
        });
      });
    };

    if (regularWeekDays) pushWeeklyEvents(regularWeekDays, EventType.REGULAR);

    if (trialWeekDays) pushWeeklyEvents(trialWeekDays, EventType.TRIAL);
  });

  return { monthlyViewEvents, weeklyViewEvents };
}
