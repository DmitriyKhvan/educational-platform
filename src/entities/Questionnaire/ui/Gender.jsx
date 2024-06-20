import React, { forwardRef } from 'react';
import CheckboxField from 'src/components/Form/CheckboxField';
import { useGenderDic } from 'src/shared/constants/global';
import { cn } from 'src/shared/utils/functions';

export const Gender = forwardRef(function Gender({ watch, ...props }, ref) {
  const gender = useGenderDic();

  return (
    <div className="space-y-4">
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
  );
});
