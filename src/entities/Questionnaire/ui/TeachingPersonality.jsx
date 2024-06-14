import React, { forwardRef } from 'react';
import Button from 'src/components/Form/Button';
import { Tag } from './Tag';

export const TeachingPersonality = forwardRef(function TeachingPersonality(
  { watch, setStep, ...props },
  ref,
) {
  const teachingPersonality = [
    {
      imoji: '✦',
      label: 'Empathetic',
      value: 'Empathetic',
    },
    {
      imoji: '✦',
      label: 'Charismatic',
      value: 'Charismatic',
    },
    {
      imoji: '✦',
      label: 'Academic',
      value: 'Academic',
    },
    {
      imoji: '✦',
      label: 'Playful',
      value: 'Playful',
    },
    {
      imoji: '✦',
      label: 'Creative',
      value: 'Creative',
    },
    {
      imoji: '✦',
      label: 'Enthusiastic',
      value: 'Enthusiastic',
    },
    {
      imoji: '✦',
      label: 'Encouraging',
      value: 'Encouraging',
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 mb-12">
        {teachingPersonality.map((teachingPersonality) => {
          const { imoji, label, value } = teachingPersonality;
          return (
            <Tag
              key={value}
              ref={ref}
              active={watch('teachingPersonality')?.includes(value)}
              imoji={imoji}
              label={label}
              value={value}
              {...props}
            />
          );
        })}
      </div>

      <Button
        onClick={() => setStep((step) => step + 1)}
        disabled={watch('teachingPersonality')?.length ? false : true}
        theme="purple"
        className="w-full h-[57px]"
      >
        Next
      </Button>
    </>
  );
});
