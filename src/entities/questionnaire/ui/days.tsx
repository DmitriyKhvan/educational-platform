import { type ForwardedRef, forwardRef, type HTMLAttributes, type FC } from 'react';
import { Tag } from './tag';
import { DAY } from '@/shared/constants/global';
import { useTranslation } from 'react-i18next';
import type { UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';

interface DaysProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
}

export const Days: FC<DaysProps> = forwardRef(function Days(
  { watch, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const [t] = useTranslation(['translations']);

  return (
    <div className="space-y-4">
      <h6 className="font-bold text-sm">Days</h6>

      <div className="flex flex-wrap gap-3">
        {DAY.map((day) => {
          return (
            <Tag
              reff={ref}
              key={day}
              active={watch('availabilities.days').includes(day)}
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
