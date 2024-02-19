import React from 'react';
import { useSchedule } from '../ScheduleProvider';
import { SkeletonTimesheets } from './SkeletonTimesheets';
import { TimeOfDay } from './TimeOfDay';

export const TimesOfDay = () => {
  const { timesheetsLoading, timesOfDay, dayClicked } = useSchedule();

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
        timesOfDay.map((time, i) => (
          <TimeOfDay timeOfDay={time} idx={i} key={time} />
        ))
      )}
    </div>
  );
};
