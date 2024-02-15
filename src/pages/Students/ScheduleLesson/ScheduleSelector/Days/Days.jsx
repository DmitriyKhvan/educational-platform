import { memo, useEffect, useState } from 'react';
import { addDays, isAfter, isBefore, subDays } from 'date-fns';
import { format } from 'date-fns-tz';
import { useAuth } from 'src/modules/auth';
import { Day } from './Day';
import { useSchedule } from '../ScheduleProvider';

export const Days = memo(function Days({ startOfWeek, counter }) {
  const { todayUserTimezone, endMonth } = useSchedule();
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [days, setDays] = useState([]);

  useEffect(() => {
    const availableDays = [];

    for (let i = 0; i < 7; i++) {
      const tempDay = addDays(startOfWeek, i);
      const startMonth = subDays(todayUserTimezone, 1);

      if (isAfter(tempDay, startMonth) && isBefore(tempDay, endMonth)) {
        const dayOfTheWeek = {
          day: format(tempDay, 'yyyy-MM-dd HH:mm:ss', {
            timeZone: userTimezone,
          }),
          format: 'day',
        };
        availableDays.push(dayOfTheWeek);
      }
    }

    setDays(availableDays);
  }, [counter]);

  return (
    <>
      {days?.map(
        (x, i) => x.format === 'day' && <Day data={x} idx={i} key={i} />,
      )}
    </>
  );
});
