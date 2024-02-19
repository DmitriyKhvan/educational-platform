import { format } from 'date-fns-tz';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { useSchedule } from '../ScheduleProvider';
import Button from 'src/components/Form/Button';

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
      className={`w-full h-[50px] text-sm font-normal my-3 ${
        idx === dayClicked && 'text-white bg-color-purple'
      }`}
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
