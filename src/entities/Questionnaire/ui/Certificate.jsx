import React, { forwardRef, useEffect, useState } from 'react';
import { Tag } from './Tag';
import { cn } from 'src/shared/utils/functions';

export const Certificate = forwardRef(function Certificate(
  { watch, setValue, dictionaries, className, ...props },
  ref,
) {
  const [certificate, setCertificate] = useState();

  const { certifications } = dictionaries.matchingProfile;

  console.log('certifications', certifications);

  // const certificates = [
  //   {
  //     label: 'TESOL',
  //     value: 'TESOL',
  //   },
  //   {
  //     label: 'TEFL',
  //     value: 'TEFL',
  //   },
  // ];

  useEffect(() => {
    if (certificate) {
      setValue('certifications', []);
    }
  }, [certificate]);

  useEffect(() => {
    if (watch('certifications').length) {
      setCertificate(false);
    } else {
      setCertificate(true);
    }
  }, [watch('certifications')]);

  return (
    <div
      className={cn(
        'flex flex-wrap justify-between gap-x-3 gap-y-4',
        className,
      )}
    >
      <Tag
        active={certificate}
        label={'No certificate'}
        value={'No certificate'}
        onClick={() => {
          setCertificate(true);
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
