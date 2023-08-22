import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useTranslation } from 'react-i18next';

export default function LoginForm({ register, errors }) {
  const [parent] = useAutoAnimate();
  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  return (
    <fieldset className="flex flex-col space-y-4">
      <legend className="text-2xl font-bold">
        {t('lets_get_started', { ns: 'onboarding' })}
      </legend>
      <label className="font-bold flex gap-2" htmlFor="firstName" ref={parent}>
        {t('first_name', { ns: 'common' })}
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
          required: t('required_first_name', { ns: 'translations' }),
          focus: true,
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="lastName" ref={parent}>
        {t('last_name', { ns: 'common' })}
        {errors.lastName && (
          <span className="text-red-500 font-normal">
            * {errors.lastName.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        {...register('lastName', {
          required: t('required_last_name', { ns: 'translations' }),
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="gender" ref={parent}>
        {t('gender', {
          ns: 'translations',
        })}
        {errors.gender && (
          <span className="text-red-500 font-normal">
            * {errors.gender.message}
          </span>
        )}
      </label>
      <select
        {...register('gender', { required: 'Gender is required' })}
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
      >
        <option value="male">
          {t('male', {
            ns: 'translations',
          })}
        </option>
        <option value="female">
          {t('female', {
            ns: 'translations',
          })}
        </option>
      </select>
    </fieldset>
  );
}
