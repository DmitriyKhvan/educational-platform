import React, { forwardRef } from 'react';
import { Tag } from './Tag';

export const Days = forwardRef(function Days({ watch, ...props }, ref) {
  const days = [
    {
      label: 'Sun',
      value: 'Sunday',
    },
    {
      label: 'Mon',
      value: 'Monday',
    },
    {
      label: 'Tue',
      value: 'Tuesday',
    },
    {
      label: 'Wed',
      value: 'Wednesday',
    },
    {
      label: 'Thu',
      value: 'Thursday',
    },
    {
      label: 'Fri',
      value: 'Friday',
    },
    {
      label: 'Sat',
      value: 'Saturday',
    },
  ];

  return (
    <div className="space-y-4">
      <h6 className="font-bold text-sm">Days</h6>

      <div className="flex flex-wrap gap-3">
        {days.map((day) => {
          return (
            <Tag
              ref={ref}
              key={day.value}
              active={watch('availability.days').includes(day.value)}
              label={day.label}
              value={day.value}
              className="px-6 py-3 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]"
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
});
