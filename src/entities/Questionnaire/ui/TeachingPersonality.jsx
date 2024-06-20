import React, { forwardRef } from 'react';
import { Tag } from './Tag';
import { cn } from 'src/shared/utils/functions';

export const TeachingPersonality = forwardRef(function TeachingPersonality(
  { watch, className, dictionaries, ...props },
  ref,
) {
  const { teachingStyles } = dictionaries.matchingProfile;

  return (
    <div
      className={cn(
        'flex flex-wrap justify-center gap-x-3 gap-y-4 mb-12',
        className,
      )}
    >
      {teachingStyles.map((item) => {
        const { teachingStyle, id } = item;
        return (
          <Tag
            key={id}
            ref={ref}
            active={watch('teachingPersonality')?.includes(id)}
            icon={<span className="text-base">✦</span>}
            label={teachingStyle}
            value={id}
            {...props}
          />
        );
      })}
    </div>
  );
});
