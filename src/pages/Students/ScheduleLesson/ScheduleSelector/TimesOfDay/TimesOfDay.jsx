import React from 'react';
import { useSchedule } from '../ScheduleProvider';
import { SkeletonTimesheets } from '../SkeletonTimesheets';
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
        timesOfDay.map((x, i) => {
          i = i + 10;
          if (x.format === 'time') {
            return <TimeOfDay data={x} idx={i} key={i} />;
          }
        })
      )}
    </>
  );
};
