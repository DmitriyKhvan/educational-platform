import { type FC, type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils/functions';
import { Tag } from './tag';
import type { UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import { useLanguageLevelsWithPaginationQuery } from '@/shared/apollo/queries/levels/language-levels-with-pagination.generated';

interface SpecializationsProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
  className?: string;
}

export const Specializations: FC<SpecializationsProps> = forwardRef(function Specializations(
  { watch, className, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { data } = useLanguageLevelsWithPaginationQuery({
    variables: {
      limit: 999,
    },
  });

  return (
    <div className={cn('flex flex-wrap justify-center gap-x-3 gap-y-4', className)}>
      {data?.languageLevelsWithPagination?.languageLevels?.map((item) => {
        const { title, id } = item ?? {};
        return (
          <Tag
            key={id}
            reff={ref}
            active={watch('specializations')?.includes(id ?? '')}
            label={title ?? ''}
            value={id ?? ''}
            {...props}
          />
        );
      })}
    </div>
  );
});
