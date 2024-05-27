import { format } from 'date-fns-tz';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useSchedule } from '../ScheduleProvider';
import Button from 'src/components/Form/Button';
import { cn } from 'src/shared/utils/functions';
import { localeDic } from 'src/shared/constants/global';

export const Day = memo(function Day({ dayOfWeek, idx }) {
  const { setDay, setDayClicked, dayClicked, userTimezone } = useSchedule();

  const [t, i18n] = useTranslation('common');

  const locale = useMemo(() => localeDic[i18n.language], [t]);

  const selectDay = () => {
    setDayClicked(idx);
    setDay(dayOfWeek);
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
