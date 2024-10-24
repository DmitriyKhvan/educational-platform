import React, { forwardRef } from 'react';
import { LANGUAGE_LEVELS_WITH_PAGINATION } from 'src/shared/apollo/queries/levels/languageLevelsWithPagination';
import { cn } from 'src/shared/utils/functions';
import { Tag } from './tag';
import { useQuery } from '@apollo/client';

export const Specializations = forwardRef(function Specializations(
  { watch, className, ...props },
  ref,
) {
  const { data } = useQuery(LANGUAGE_LEVELS_WITH_PAGINATION, {
    variables: {
      limit: 999,
    },
  });

  return (
    <div className={cn('flex flex-wrap justify-center gap-x-3 gap-y-4', className)}>
      {data?.languageLevelsWithPagination?.languageLevels?.map((item) => {
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
