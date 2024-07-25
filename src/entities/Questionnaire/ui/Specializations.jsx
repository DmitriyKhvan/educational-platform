import React, { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';
import { Tag } from './Tag';

export const Specializations = forwardRef(function Specializations(
  { watch, className, dictionaries, ...props },
  ref,
) {
  return (
    <div
      className={cn('flex flex-wrap justify-center gap-x-3 gap-y-4', className)}
    >
      {dictionaries?.map((item) => {
        const { title, id } = item;
        return (
          <Tag
            key={id}
            ref={ref}
            active={watch('specializations')?.includes(id)}
            label={title}
            value={id}
            {...props}
          />
        );
      })}
    </div>
  );
});
