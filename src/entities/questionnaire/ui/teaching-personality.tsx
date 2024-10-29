import { type FC, type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';
import { Tag } from './tag';
import { cn } from '@/shared/utils/functions';
import type { UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import type { MatchingProfile } from '@/types/types.generated';

interface TeachingPersonalityProps extends HTMLAttributes<HTMLDivElement> {
  watch: UseFormWatch<Questionnaire>;
  className?: string;
  dictionaries: {
    matchingProfile: MatchingProfile;
  };
}

export const TeachingPersonality: FC<TeachingPersonalityProps> = forwardRef(
  function TeachingPersonality(
    { watch, className, dictionaries, ...props },
    ref: ForwardedRef<HTMLLabelElement>,
  ) {
    const { teachingStyles } = dictionaries.matchingProfile;

    return (
      <div className={cn('flex flex-wrap justify-center gap-x-3 gap-y-4', className)}>
        {teachingStyles?.map((item) => {
          const { teachingStyle, id } = item ?? {};
          return (
            <Tag
              key={id}
              reff={ref}
              active={watch('teachingStyles')?.includes(id ?? '')}
              icon={<span className="text-base">✦</span>}
              label={teachingStyle ?? ''}
              value={id ?? ''}
              {...props}
            />
          );
        })}
      </div>
    );
  },
);
