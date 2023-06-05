import React, { useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createMultiSelect } from './createMultiSelect';

const options = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LoginForm({ register, errors }) {
  const [parent] = useAutoAnimate();

  const components = useMemo(
    () =>
      createMultiSelect(
        options,
        'englishLevel',
        register,
        'English level is required',
      ),
    [options],
  );

  return (
    <fieldset className="flex flex-col space-y-4 w-full" ref={parent}>
      <legend className="text-2xl font-bold">
        What&apos;s your English level?
      </legend>

      {components}

      {errors.englishLevel && (
        <span className="text-red-500 font-normal">
          * {errors.englishLevel.message}
        </span>
      )}
    </fieldset>
  );
}
