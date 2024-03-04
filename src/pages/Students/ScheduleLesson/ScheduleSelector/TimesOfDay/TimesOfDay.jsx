import React from 'react';
import { useSchedule } from '../ScheduleProvider';
import { SkeletonTimesheets } from './SkeletonTimesheets';
import { TimeOfDay } from './TimeOfDay';
import Button from 'src/components/Form/Button';
import { useTranslation } from 'react-i18next';

export const TimesOfDay = () => {
  const [t] = useTranslation('common');
  const {
    timesheetsLoading,
    timesOfDay,
    dayClicked,
    timeClicked,
    setTabIndex,
  } = useSchedule();

  return (
    <div>
      {dayClicked !== null && (
        <h4 className="font-semibold text-[15px] text-color-dark-purple mb-4">
          3. Choose time of day
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
              {t('continue_button')}
            </Button>
          </div>
        )
      )}
    </div>
  );
};
