import { Day } from '@/pages/students/schedule-lesson/schedule-selector/days/day';
import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { addDays, differenceInDays, isAfter, isBefore, subDays } from 'date-fns';
import { format } from 'date-fns-tz';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DaysProps {
  startOfWeek: Date;
  counter: number;
}

export const Days = memo(function Days({ startOfWeek, counter }: DaysProps) {
  const [t] = useTranslation('availability');
  const { todayUserTimezone, endMonth, userTimezone } = useSchedule();

  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    const availableDays: string[] = [];

    const dayPrior = process.env.REACT_APP_PRODUCTION === 'true' ? 0 : -1; // < 48 hours can't book for prod

    for (let i = 0; i < 7; i++) {
      const tempDay = addDays(startOfWeek, i);
      const startMonth = subDays(todayUserTimezone, 1);

      if (
        isAfter(tempDay, startMonth) &&
        isBefore(tempDay, endMonth) &&
        differenceInDays(tempDay, todayUserTimezone) > dayPrior
      ) {
        const dayOfWeek = format(tempDay, 'yyyy-MM-dd HH:mm:ss', {
          timeZone: userTimezone,
        });
        availableDays.push(dayOfWeek);
      }
    }

    setDays(availableDays);
  }, [startOfWeek, counter, todayUserTimezone, endMonth, userTimezone]);

  return (
    <div>
      <h4 className="font-semibold text-[15px] text-color-dark-purple mb-4">
        2. {t('choose_day')}
      </h4>
      <div className="flex flex-wrap gap-y-3">
        {days?.map((day, i) => (
          <Day dayOfWeek={day} idx={i} key={day} />
        ))}
      </div>
    </div>
  );
});
