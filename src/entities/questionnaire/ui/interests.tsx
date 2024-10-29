import { type FC, type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';
import { Tag } from './tag';
import { cn } from '@/shared/utils/functions';
import type { UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import type { MatchingProfile } from '@/types/types.generated';

interface InterestsProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
  // watch: UseFormWatch<Questionnaire> | UseFormWatch<Omit<Questionnaire, 'gender'>>;
  className?: string;
  dictionaries: {
    matchingProfile: MatchingProfile;
  };
}

export const Interests: FC<InterestsProps> = forwardRef(function Interests(
  { watch, className, dictionaries, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { interests } = dictionaries.matchingProfile;

  return (
    <div className={cn('flex flex-wrap justify-center gap-x-3 gap-y-4', className)}>
      {interests?.map((item) => {
        const { icon, interest, id } = item ?? {};
        return (
          <Tag
            key={id}
            reff={ref}
            active={watch('interests')?.includes(id ?? '')}
            icon={icon}
            label={interest ?? ''}
            value={id ?? ''}
            {...props}
          />
        );
      })}
    </div>
  );
});
