import React, { forwardRef } from 'react';
import { Tag } from './Tag';
import { cn } from 'src/shared/utils/functions';

export const Interests = forwardRef(function Interests(
  { watch, className, dictionaries, ...props },
  ref,
) {
  const { interests } = dictionaries.matchingProfile;

  return (
    <div
      className={cn(
        'flex flex-wrap justify-center gap-x-3 gap-y-4 mb-12',
        className,
      )}
    >
      {interests.map((item) => {
        const { icon, interest, id } = item;
        return (
          <Tag
            key={id}
            ref={ref}
            active={watch('interests')?.includes(id)}
            icon={icon}
            label={interest}
            value={id}
            {...props}
          />
        );
      })}
    </div>
  );
});
