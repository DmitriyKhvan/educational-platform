import React, { forwardRef } from 'react';
import { Tag } from './Tag';
import { DAYS } from 'src/shared/constants/global';
import { useTranslation } from 'react-i18next';

export const Days = forwardRef(function Days({ watch, ...props }, ref) {
  const [t] = useTranslation(['translations']);

  return (
    <div className="space-y-4">
      <h6 className="font-bold text-sm">Days</h6>

      <div className="flex flex-wrap gap-3">
        {DAYS.map((day) => {
          return (
            <Tag
              ref={ref}
              key={day}
              active={watch('availability.days').includes(day)}
              label={t(day.slice(0, 3).toLowerCase())}
              value={day}
              className="px-6 py-3 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]"
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
});
