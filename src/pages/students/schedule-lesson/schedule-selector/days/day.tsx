import { format } from 'date-fns-tz';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/form/button';
import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { localeDic } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';

interface DayProps {
  dayOfWeek: string;
  idx: number;
}

export const Day = memo(function Day({ dayOfWeek, idx }: DayProps) {
  const { setDay, setDayClicked, dayClicked, userTimezone } = useSchedule();

  const [t, i18n] = useTranslation('common');

  const locale = useMemo(() => localeDic[i18n.language as keyof typeof localeDic], [i18n.language]);

  const selectDay = () => {
    setDayClicked(idx);
    setDay(new Date(dayOfWeek));
  };

  return (
    <Button
      theme="outline"
      className={cn(
        'w-full sm:w-[calc(100%/2-6px)] h-[50px] text-sm font-normal',
        idx === dayClicked && 'text-white bg-color-purple',
        idx % 2 !== 0 && 'sm:ml-3',
      )}
      onClick={selectDay}
    >
      {t(
        format(new Date(dayOfWeek), 'EEEE (MMM d)', {
          timeZone: userTimezone,
          locale,
        }),
      )}
    </Button>
  );
});
