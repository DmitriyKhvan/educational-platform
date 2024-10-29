import { type FC, type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';
import { Tag } from './tag';
import { cn } from '@/shared/utils/functions';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import type { MatchingProfile } from '@/types/types.generated';

interface CertificateProps extends HTMLAttributes<HTMLInputElement> {
  watch: UseFormWatch<Questionnaire>;
  dictionaries: {
    matchingProfile: MatchingProfile;
  };
  setValue: UseFormSetValue<Questionnaire>;
  className?: string;
}

export const Certificate: FC<CertificateProps> = forwardRef(function Certificate(
  { watch, dictionaries, setValue, className, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { certifications } = dictionaries.matchingProfile;

  return (
    <div className={cn('flex flex-wrap justify-between gap-x-3 gap-y-4', className)}>
      <Tag
        label={'No certificate'}
        active={watch('certifications')?.length === 0}
        onClick={() => {
          setValue('certifications', []);
        }}
      />

      {certifications?.map((certificate) => {
        const { id, certification } = certificate ?? {};
        return (
          <Tag
            key={id}
            reff={ref}
            active={watch('certifications')?.includes(id ?? '')}
            label={certification ?? ''}
            value={id ?? ''}
            {...props}
          />
        );
      })}
    </div>
  );
});
