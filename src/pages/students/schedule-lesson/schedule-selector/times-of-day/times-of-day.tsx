import Button from '@/components/form/button';

import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { SkeletonTimesheets } from '@/pages/students/schedule-lesson/schedule-selector/times-of-day/skeleton-time-sheets';
import { TimeOfDay } from '@/pages/students/schedule-lesson/schedule-selector/times-of-day/time-of-day';
import { useTranslation } from 'react-i18next';

export const TimesOfDay = () => {
  const [t] = useTranslation(['common', 'availability']);
  const { timesheetsLoading, timesOfDay, dayClicked, timeClicked, setTabIndex } = useSchedule();

  return (
    <div>
      {dayClicked !== null && (
        <h4 className="font-semibold text-[15px] text-color-dark-purple mb-4">
          3. {t('choose_time', { ns: 'availability' })}
        </h4>
      )}

      {timesheetsLoading ? (
        <div className="mt-3">
          <SkeletonTimesheets />
        </div>
      ) : (
        timesOfDay.length !== 0 && (
          <div className="space-y-10">
            <div>
              {timesOfDay.map((time, i) => (
                <TimeOfDay timeOfDay={time} idx={i} key={time} />
              ))}
            </div>

            <Button
              id="timeOfDay"
              disabled={timeClicked === null}
              className="w-full"
              onClick={() => setTabIndex(2)}
            >
              {t('continue_button', { ns: 'common' })}
            </Button>
          </div>
        )
      )}
    </div>
  );
};
