import React, { forwardRef } from 'react';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';

export const EnergyLevel = forwardRef(function EnergyLevel(
  { watch, ...props },
  ref,
) {
  console.log('watch', watch('energyLevel'));

  return (
    <>
      <h2 className="text-center text-[30px] font-bold leading-[120%] mb-10">
        What energy level do you prefer in a mentor?
      </h2>

      <h4 className="text-gray-400 mb-4 font-normal">Select an option</h4>

      <div className="flex gap-4 mb-12">
        <label
          className="relative grow flex flex-col items-center px-4 py-6 sm:py-8 rounded-lg border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]"
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
          className="relative grow flex flex-col items-center px-4 py-6 sm:py-8 rounded-lg border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]"
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

      <Button
        disabled={watch('energyLevel') ? false : true}
        theme="gray"
        className="w-full h-[57px]"
      >
        Next
      </Button>
    </>
  );
});
