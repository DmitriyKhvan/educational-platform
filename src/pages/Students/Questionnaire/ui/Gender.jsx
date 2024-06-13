import React, { forwardRef } from 'react';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { cn } from 'src/shared/utils/functions';

export const Gender = forwardRef(function Gender(
  { watch, setStep, ...props },
  ref,
) {
  const gender = [
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'No preference',
      value: 'No preference',
    },
  ];

  return (
    <>
      <h2 className="text-center text-[30px] font-bold leading-[120%] mb-10">
        Do you have a preference for the gender of your mentor?
      </h2>

      <h4 className="text-gray-400 mb-4 font-normal">Select an option</h4>

      <div className="space-y-4 mb-12">
        {gender.map((gender) => {
          return (
            <label
              key={gender.value}
              ref={ref}
              className={cn(
                `w-full flex items-center gap-3 p-3 rounded-lg border 
              border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)] 
              transition ease-in-out delay-150 hover:border-color-purple cursor-pointer`,
                watch('gender') === gender.value && 'border-color-purple',
              )}
            >
              <CheckboxField type="radio" value={gender.value} {...props} />

              <span>{gender.label}</span>
            </label>
          );
        })}
      </div>

      <Button
        onClick={() => setStep((step) => step + 1)}
        disabled={watch('gender') ? false : true}
        theme="purple"
        className="w-full h-[57px]"
      >
        Next
      </Button>
    </>
  );
});
