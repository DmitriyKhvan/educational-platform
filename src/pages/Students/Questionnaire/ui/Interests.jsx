import React, { forwardRef } from 'react';
import Button from 'src/components/Form/Button';
import { Tag } from './Tag';

export const Interests = forwardRef(function Interests(
  { watch, setStep, ...props },
  ref,
) {
  const interests = [
    {
      imoji: '🐶',
      label: 'Animals',
      value: 'Animals',
    },
    {
      imoji: '💃',
      label: 'Dance',
      value: 'Dance',
    },
    {
      imoji: '📺',
      label: 'Cartoons',
      value: 'Cartoons',
    },
    {
      imoji: '🎨',
      label: 'Art',
      value: 'Art',
    },
    {
      imoji: '🍥',
      label: 'Anime',
      value: 'Anime',
    },
    {
      imoji: '🍿',
      label: 'Movies',
      value: 'Movies',
    },
    {
      imoji: '📜',
      label: 'History',
      value: 'History',
    },
    {
      imoji: '🎼',
      label: 'Music',
      value: 'Music',
    },
    {
      imoji: '➗',
      label: 'Math',
      value: 'Math',
    },
    {
      imoji: '🗺️',
      label: 'Geography',
      value: 'Geography',
    },
    {
      imoji: '🎮',
      label: 'Video games',
      value: 'Video games',
    },
    {
      imoji: '✈️',
      label: 'Traveling',
      value: 'Traveling',
    },
    {
      imoji: '⚽',
      label: 'Sports',
      value: 'Sports',
    },
    {
      imoji: '🔬',
      label: 'Science',
      value: 'Science',
    },
    {
      imoji: '🚴',
      label: 'Outdoor activities',
      value: 'Outdoor activities',
    },
  ];

  console.log('watch', watch('interests'));

  return (
    <>
      <h2 className="text-center text-[30px] font-bold leading-[120%] mb-3">
        What are your interests?
      </h2>

      <h4 className="text-center text-color-dark-purple mb-10 font-normal">
        You can select multiple options
      </h4>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 mb-12">
        {interests.map((interest) => {
          const { imoji, label, value } = interest;
          return (
            <Tag
              key={value}
              ref={ref}
              active={watch('interests')?.includes(value)}
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
        disabled={watch('interests')?.length ? false : true}
        theme="purple"
        className="w-full h-[57px]"
      >
        Next
      </Button>
    </>
  );
});
