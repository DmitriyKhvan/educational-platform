import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function LoginForm({ register, errors }) {
  const [parent] = useAutoAnimate();

  return (
    <fieldset className="flex flex-col space-y-4">
      <legend className="text-2xl font-bold">Let&apos;s get started!</legend>
      <label className="font-bold flex gap-2" htmlFor="firstName" ref={parent}>
        First Name
        {errors.firstName && (
          <span className="text-red-500 font-normal">
            * {errors.firstName.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        autoFocus
        {...register('firstName', {
          required: 'First name is required',
          focus: true,
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="lastName" ref={parent}>
        Last Name
        {errors.lastName && (
          <span className="text-red-500 font-normal">
            * {errors.lastName.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        {...register('lastName', { required: 'Last name is required' })}
      />
    </fieldset>
  );
}
