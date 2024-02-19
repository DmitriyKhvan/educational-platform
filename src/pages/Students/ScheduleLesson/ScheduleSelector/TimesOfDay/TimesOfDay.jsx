import React from 'react';
import { useSchedule } from '../ScheduleProvider';
import { SkeletonTimesheets } from './SkeletonTimesheets';
import { TimeOfDay } from './TimeOfDay';

export const TimesOfDay = () => {
  const { timesheetsLoading, timesOfDay } = useSchedule();

  return (
    <>
      {timesheetsLoading ? (
        <div className="mt-3">
          <SkeletonTimesheets />
        </div>
      ) : (
        timesOfDay.map((time, i) => (
          <TimeOfDay timeOfDay={time} idx={i} key={time} />
        ))
      )}
    </>
  );
};
