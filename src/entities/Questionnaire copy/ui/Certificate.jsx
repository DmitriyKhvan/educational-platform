import React, { forwardRef } from 'react';
import { Tag } from './Tag';
import { cn } from 'src/shared/utils/functions';

export const Certificate = forwardRef(function Certificate(
  { watch, dictionaries, setValue, className, ...props },
  ref,
) {
  const { certifications } = dictionaries.matchingProfile;

  return (
    <div
      className={cn(
        'flex flex-wrap justify-between gap-x-3 gap-y-4',
        className,
      )}
    >
      <Tag
        label={'No certificate'}
        active={watch('certifications').length === 0}
        onClick={() => {
          setValue('certifications', []);
        }}
      />

      {certifications.map((certificate) => {
        const { id, certification } = certificate;
        return (
          <Tag
            key={id}
            ref={ref}
            active={watch('certifications')?.includes(id)}
            label={certification}
            value={id}
            {...props}
          />
        );
      })}
    </div>
  );
});
