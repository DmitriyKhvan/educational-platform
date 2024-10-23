import { CalendarView, DAY } from '@/shared/constants/global';
import type {
  Exception,
  MonthlyViewEvent,
  RRuleCommon,
  RecurringEvent,
  RenderRecurEventsResult,
  WeeklyViewEvent,
} from '@/types';
import { EventType } from '@/types';
import { intervalToDuration } from 'date-fns';

const rruleWeekdays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export function renderRecurEvents(
  regular: RecurringEvent[],
  trial: RecurringEvent[],
  exceptions: Exception[],
): RenderRecurEventsResult {
  const monthlyViewEvents: MonthlyViewEvent[] = [];
  const weeklyViewEvents: WeeklyViewEvent[] = [];

  for (const [idx, weekDay] of DAY.entries()) {
    const regularWeekDays = regular?.filter((v) => v.day === weekDay);
    const trialWeekDays = trial?.filter((v) => v.day === weekDay);

    if (!regularWeekDays?.length && !trialWeekDays?.length) continue;

    const rruleCommon = (dtstart: string): RRuleCommon => ({
      freq: 'weekly',
      byweekday: [rruleWeekdays[idx]],
      dtstart: dtstart,
    });

    monthlyViewEvents.push({
      view: CalendarView.MONTH_VIEW,
      day: weekDay,
      regular: regularWeekDays?.length ? regularWeekDays : undefined,
      trial: trialWeekDays?.length ? trialWeekDays : undefined,
      rrule: rruleCommon(new Date().toISOString().substring(0, 10)),
      exdate: exceptions?.map((ex) => new Date(Number(ex.date)).toISOString().substring(0, 10)),
      // allDay: false,
    });

    const pushWeeklyEvents = (weekDays: RecurringEvent[], type: keyof typeof EventType) => {
      for (const weekDay of weekDays) {
        weeklyViewEvents.push({
          rrule: rruleCommon(`${new Date().toISOString().substring(0, 10)}T${weekDay.from}:00`),
          view: CalendarView.WEEK_VIEW,
          type,
          duration: intervalToDuration({
            start: new Date(`01/01/2011 ${weekDay.from}:00`),
            end: new Date(`01/01/2011 ${weekDay.to}:00`),
          }),
          allDay: false,
          display: 'background',
        });
      }
    };

    if (regularWeekDays)
      pushWeeklyEvents(regularWeekDays, EventType.REGULAR as keyof typeof EventType);
    if (trialWeekDays) pushWeeklyEvents(trialWeekDays, EventType.TRIAL as keyof typeof EventType);
  }

  return { monthlyViewEvents, weeklyViewEvents };
}
