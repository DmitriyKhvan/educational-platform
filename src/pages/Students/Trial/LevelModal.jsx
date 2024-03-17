import React from 'react';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { levels } from 'src/constants/global';

const LevelModal = ({ setOpen, register, watch }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-center sm:text-left sm:text-2xl sm:font-bold font-semibold">
        Select a Level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {levels.map((level) => {
          return (
            <label
              key={level.value}
              className={`border rounded-xl p-4 cursor-pointer transition ease-in-out delay-150 hover:border-color-purple ${
                watch('level') === level.value && 'border-color-purple'
              }`}
            >
              <CheckboxField
                type="radio"
                value={level.value}
                name="level"
                {...register('level')}
              />
              <h3 className="font-bold mb-2">{level.label}</h3>
              <p>{level.text}</p>
            </label>
          );
        })}
      </div>
      <Button className="w-full h-[57px]" onClick={() => setOpen(false)}>
        Select
      </Button>
    </div>
  );
};

export default LevelModal;
