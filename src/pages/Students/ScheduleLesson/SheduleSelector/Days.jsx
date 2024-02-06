import { addDays, isAfter, isSameDay } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { useAuth } from 'src/modules/auth';
import { DaySelector } from './DaySelector';

export const Days = ({ startOfWeek }) => {
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const todayUserTimezone = () => {
    return utcToZonedTime(new Date(), userTimezone);
  };

  const [days, setDays] = useState([]);

  useEffect(() => {
    const availableDays = [];

    for (let i = 0; i < 7; i++) {
      const tempDay = addDays(startOfWeek, i);

      // const availbleTime = addHours(todayUserTimezone(), 1);

      if (
        isAfter(tempDay, todayUserTimezone()) ||
        isSameDay(tempDay, todayUserTimezone())
      ) {
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
  }, [startOfWeek]);

  return (
    <div className="col-6 px-4">
      {days?.map(
        (x, i) => x.format === 'day' && <DaySelector data={x} i={i} key={i} />,
      )}
    </div>
  );
};
