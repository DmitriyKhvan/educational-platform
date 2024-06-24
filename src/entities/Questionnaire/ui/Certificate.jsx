import React, { forwardRef, useEffect, useState } from 'react';
import { Tag } from './Tag';
import { cn } from 'src/shared/utils/functions';

export const Certificate = forwardRef(function Certificate(
  { watch, setValue, className, ...props },
  ref,
) {
  const [certificate, setCertificate] = useState();

  const certificates = [
    {
      label: 'TESOL',
      value: 'TESOL',
    },
    {
      label: 'TEFL',
      value: 'TEFL',
    },
  ];

  useEffect(() => {
    if (certificate) {
      setValue('certificate', []);
    }
  }, [certificate]);

  useEffect(() => {
    if (watch('certificate').length) {
      setCertificate(false);
    } else {
      setCertificate(true);
    }
  }, [watch('certificate')]);

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

      {certificates.map((certificate) => {
        const { label, value } = certificate;
        return (
          <Tag
            key={value}
            ref={ref}
            active={watch('certificate').includes(value)}
            label={label}
            value={value}
            {...props}
          />
        );
      })}
    </div>
  );
});
