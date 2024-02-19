import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../ScheduleProvider';
import { isWithinInterval } from 'date-fns';

import Button from 'src/components/Form/Button';

export const TimeOfDay = memo(function TimeOfDay({ timeOfDay, idx }) {
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

    if (timeOfDay === 'Morning') {
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
    if (timeOfDay === 'Afternoon') {
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
    if (timeOfDay === 'Evening') {
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
    <Button
      theme="outline"
      className={`
        w-full h-[50px] text-sm font-normal my-3
        ${idx === timeClicked && 'text-white bg-color-purple'}
      `}
      onClick={selectTimeOfDay}
    >
      {t(timeOfDay)}
    </Button>
  );
});
