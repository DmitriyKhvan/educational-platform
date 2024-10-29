import { type ForwardedRef, forwardRef, type HTMLAttributes, type FC } from 'react';
import { cn } from '@/shared/utils/functions';
import { FiSun } from 'react-icons/fi';
import type { UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';

interface TimeProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
}

export const Time: FC<TimeProps> = forwardRef(function Time(
  { watch, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const times = [
    {
      timeOfDay: 'DayTime',
      slots: [
        {
          label: '9-12',
          value: '09:00',
        },
        {
          label: '12-15',
          value: '12:00',
        },
        {
          label: '15-18',
          value: '15:00',
        },
      ],
    },
    {
      timeOfDay: 'Evening and night',
      slots: [
        {
          label: '18-21',
          value: '18:00',
        },
        {
          label: '21-24',
          value: '21:00',
        },
        {
          label: '0-3',
          value: '00:00',
        },
      ],
    },
    {
      timeOfDay: 'Morning',
      slots: [
        {
          label: '3-6',
          value: '03:00',
        },
        {
          label: '6-9',
          value: '06:00',
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
                      watch('availabilities.time').includes(slot.value) &&
                        'border-color-purple text-color-purple',
                    )}
                    key={slot.value}
                  >
                    <input className="hidden" type="checkbox" value={slot.value} {...props} />

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
