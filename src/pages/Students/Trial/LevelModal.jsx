import React, { forwardRef } from 'react';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';

const LevelModal = forwardRef(function LevelModal(
  { setOpen, watch, levels, ...props },
  ref,
) {
  return (
    <div className="space-y-6">
      <h2 className="text-center sm:text-left sm:text-2xl sm:font-bold font-semibold">
        Select a Level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {levels?.map((level) => {
          return (
            <label
              key={level.id}
              className={`border rounded-xl p-4 cursor-pointer transition ease-in-out delay-150 hover:border-color-purple ${
                watch('level') === level.title && 'border-color-purple'
              }`}
            >
              <CheckboxField
                ref={ref}
                type="radio"
                value={level.id}
                name="level"
                {...props}
              />
              <h3 className="font-bold mb-2">{level.title}</h3>
              <p>{level.description}</p>
            </label>
          );
        })}
      </div>
      <Button className="w-full h-[57px]" onClick={() => setOpen(false)}>
        Select
      </Button>
    </div>
  );
});

export default LevelModal;
