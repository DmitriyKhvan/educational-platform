import { format } from 'date-fns-tz';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { useSchedule } from '../ScheduleProvider';

export const Day = memo(function Day({ data, idx }) {
  const { setDay, setDayClicked, dayClicked, resetAll } = useSchedule();
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [t] = useTranslation('common');

  const selectDay = () => {
    resetAll();
    setDayClicked(idx);
    setDay(data.day);
  };

  return (
    <div
      className={`day-selector  rounded-md border-2 text-center my-3 ${
        idx === dayClicked
          ? 'schedule_lesson_day bg-color-purple'
          : 'schedule_lesson_day_unselect bg-white'
      }`}
      onClick={selectDay}
    >
      <div>
        {t(
          data.day &&
            format(new Date(data.day), 'EEEE', {
              timeZone: userTimezone,
            }),
        )}
      </div>
    </div>
  );
});
