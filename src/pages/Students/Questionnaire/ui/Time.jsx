import React, { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';
import { FiSun } from 'react-icons/fi';

export const Time = forwardRef(function Time({ watch, ...props }, ref) {
  const times = [
    {
      timeOfDay: 'DayTime',
      slots: [
        {
          label: '9-12',
          value: '9-12',
        },
        {
          label: '12-15',
          value: '12-15',
        },
        {
          label: '15-18',
          value: '15-18',
        },
      ],
    },
    {
      timeOfDay: 'Evening and night',
      slots: [
        {
          label: '18-21',
          value: '18-21',
        },
        {
          label: '21-24',
          value: '21-24',
        },
        {
          label: '0-3',
          value: '0-3',
        },
      ],
    },
    {
      timeOfDay: 'Morning',
      slots: [
        {
          label: '3-6',
          value: '3-6',
        },
        {
          label: '6-9',
          value: '6-9',
        },
      ],
    },
  ];
  return (
    <div className="space-y-4 mb-12">
      <h6 className="font-bold text-sm">Time</h6>

      {times.map((time) => {
        return (
          <div className="space-y-3" key={time.timeOfDay}>
            <h6 className="text-gray-400 text-[13px]">{time.timeOfDay}</h6>
            <div className="grid grid-cols-3 gap-3">
              {time.slots.map((slot) => {
                return (
                  <label
                    ref={ref}
                    className={cn(
                      `flex flex-col items-center gap-3 px-4 py-4 sm:py-5 font-medium 
                      rounded-lg border border-gray-100 cursor-pointer
                      shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]`,
                      watch('availability.time').includes(slot.value) &&
                        'border-color-purple text-color-purple',
                    )}
                    key={slot.value}
                  >
                    <input
                      className="hidden"
                      type="checkbox"
                      value={slot.value}
                      {...props}
                    />

                    <FiSun className="" />
                    <span className="text-[13px]">{slot.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
