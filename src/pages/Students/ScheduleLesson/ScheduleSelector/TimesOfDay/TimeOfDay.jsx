import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../ScheduleProvider';
import { isWithinInterval } from 'date-fns';

export const TimeOfDay = memo(function TimeOfDay({ data, idx }) {
  const {
    setTimeOfDayInterval,
    setTimeClicked,
    timeClicked,
    todayUserTimezone,
    morningInterval,
    afternoonInterval,
    eveningInterval,
    endMonth,
    isToday,
    isEndMonth,
  } = useSchedule();
  const [t] = useTranslation('common');

  const selectTimeOfDay = () => {
    setTimeClicked(idx);

    if (data.time === 'Morning') {
      const isTodayMorning = isWithinInterval(
        todayUserTimezone,
        morningInterval,
      );

      const isEndMonthMorning = isWithinInterval(endMonth, morningInterval);

      if (isTodayMorning && isToday) {
        setTimeOfDayInterval({
          start: todayUserTimezone,
          end: morningInterval.end,
        });
      } else if (isEndMonthMorning && isEndMonth) {
        setTimeOfDayInterval({
          start: morningInterval.start,
          end: endMonth,
        });
      } else {
        setTimeOfDayInterval(morningInterval);
      }
    }
    if (data.time === 'Afternoon') {
      const isTodayArternoon = isWithinInterval(
        todayUserTimezone,
        afternoonInterval,
      );

      const isEndMonthArternoon = isWithinInterval(endMonth, afternoonInterval);

      if (isTodayArternoon && isToday) {
        setTimeOfDayInterval({
          start: todayUserTimezone,
          end: afternoonInterval.end,
        });
      } else if (isEndMonthArternoon && isEndMonth) {
        setTimeOfDayInterval({
          start: afternoonInterval.start,
          end: endMonth,
        });
      } else {
        setTimeOfDayInterval(afternoonInterval);
      }
    }
    if (data.time === 'Evening') {
      const isTodayEvening = isWithinInterval(
        todayUserTimezone,
        eveningInterval,
      );

      const isEndMonthEvening = isWithinInterval(endMonth, eveningInterval);

      if (isTodayEvening && isToday) {
        setTimeOfDayInterval({
          start: todayUserTimezone,
          end: eveningInterval.end,
        });
      } else if (isEndMonthEvening && isEndMonth) {
        setTimeOfDayInterval({
          start: eveningInterval.start,
          end: endMonth,
        });
      } else {
        setTimeOfDayInterval(eveningInterval);
      }
    }
  };

  return (
    <div
      className={`day-selector  rounded-md border-2 text-center my-3 ${
        idx === timeClicked
          ? 'schedule_lesson_day bg-color-purple'
          : 'schedule_lesson_day_unselect bg-white'
      }`}
      onClick={selectTimeOfDay}
    >
      <div>{t(data.time)}</div>
    </div>
  );
});
