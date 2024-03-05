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
        const dayOfWeek = format(tempDay, 'yyyy-MM-dd HH:mm:ss', {
          timeZone: userTimezone,
        });
        availableDays.push(dayOfWeek);
      }
    }

    setDays(availableDays);
  }, [counter]);

  return (
    <div>
      <h4 className="font-semibold text-[15px] text-color-dark-purple mb-4">
        2. Choose a day
      </h4>
      <div className="flex flex-wrap gap-y-3">
        {days?.map((day, i) => (
          <Day dayOfWeek={day} idx={i} key={day} />
        ))}
      </div>
    </div>
  );
});
