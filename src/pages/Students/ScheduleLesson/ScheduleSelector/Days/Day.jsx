import { format } from 'date-fns-tz';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { useSchedule } from '../ScheduleProvider';
import Button from 'src/components/Form/Button';
import { cn } from 'src/utils/functions';

export const Day = memo(function Day({ dayOfWeek, idx }) {
  const { setDay, setDayClicked, dayClicked } = useSchedule();
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [t] = useTranslation('common');

  const selectDay = () => {
    setDayClicked(idx);
    setDay(dayOfWeek);
  };

  return (
    <Button
      theme="outline"
      className={cn(
        'w-full sm:w-[214px] h-[50px] text-sm font-normal',
        idx === dayClicked && 'text-white bg-color-purple',
        idx % 2 !== 0 && 'ml-3',
      )}
      onClick={selectDay}
    >
      {t(
        format(new Date(dayOfWeek), 'EEEE (MMM d)', {
          timeZone: userTimezone,
        }),
      )}
    </Button>
  );
});
