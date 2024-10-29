import CheckboxField from '@/components/form/checkbox-field';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import { type FC, type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useGenderDic } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';

interface GenderProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
  className?: string;
}

export const Gender: FC<GenderProps> = forwardRef(function Gender(
  { watch, className, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const gender = useGenderDic();

  return (
    <>
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
              className,
            )}
          >
            <CheckboxField type="radio" value={gender.value} {...props} />

            <span>{gender.label}</span>
          </label>
        );
      })}
    </>
  );
});
