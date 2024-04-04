import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../ScheduleProvider';
import {
  addHours,
  isWithinInterval,
  // parse
} from 'date-fns';

import Button from 'src/components/Form/Button';

export const TimeOfDay = memo(function TimeOfDay({ timeOfDay, idx }) {
  const {
    day,
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

        // setTimeOfDayInterval({
        //   start: parse(day, 'yyyy-MM-dd HH:mm:ss', new Date(day)),
        //   end: morningInterval.end,
        // });
      }
    }
    if (timeOfDay === 'Afternoon') {
      const isTodayArternoon = isWithinInterval(
        todayUserTimezone,
        afternoonInterval,
      );

      const isEndMonthArternoon = isWithinInterval(endMonth, afternoonInterval);

      // if (hoursPrior) {
      //   setTimeOfDayInterval({
      //     start: addHours(todayUserTimezone, hoursPrior),
      //     end: afternoonInterval.end,
      //   });
      // }

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

      if (
        isTodayEvening &&
        isToday &&
        process.env.REACT_APP_PRODUCTION === 'false'
      ) {
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
        // setTimeOfDayInterval(eveningInterval);
        setTimeOfDayInterval({
          start: addHours(new Date(day), 48),
          end: eveningInterval.end,
        });
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
