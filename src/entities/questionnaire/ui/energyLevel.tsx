import React, { forwardRef } from 'react';
import CheckboxField from 'src/components/Form/CheckboxField';
import { cn } from 'src/shared/utils/functions';

export const EnergyLevel = forwardRef(function EnergyLevel(
  { watch, ...props },
  ref,
) {
  return (
    <div className="flex gap-x-4">
      <label
        className={cn(
          `relative grow flex flex-col items-center px-4 py-6 sm:py-8 
        rounded-lg border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)] 
        transition ease-in-out delay-150 hover:border-color-purple cursor-pointer`,
          watch('energy') === 'calm' && 'border-color-purple',
        )}
        ref={ref}
      >
        <CheckboxField
          className="absolute right-2 top-2"
          type="radio"
          value="calm"
          {...props}
        />

        <span>🧘</span>
        <span>Calm energy</span>
      </label>

      <label
        className={cn(
          `relative grow flex flex-col items-center px-4 py-6 sm:py-8 
          rounded-lg border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)] 
          transition ease-in-out delay-150 hover:border-color-purple cursor-pointer`,
          watch('energy') === 'high' && 'border-color-purple',
        )}
        ref={ref}
      >
        <CheckboxField
          className="absolute right-2 top-2"
          type="radio"
          value="high"
          {...props}
        />

        <span>🏃‍♂️</span>
        <span>High energy</span>
      </label>
    </div>
  );
});
