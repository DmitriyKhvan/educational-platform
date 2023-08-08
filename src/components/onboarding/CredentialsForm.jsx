import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useTranslation } from 'react-i18next';

export default function CredentialsForm({ register, errors }) {
  const [parent] = useAutoAnimate();
  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  return (
    <fieldset className="flex flex-col space-y-4">
      <legend className="text-2xl font-bold">{t('lets_get_started')}</legend>
      <label
        className="font-bold flex gap-2"
        htmlFor="phoneNumber"
        ref={parent}
      >
        {t('phone_number', { ns: 'common' })}
        {errors.phoneNumber && (
          <span className="text-red-500 font-normal flex-grow">
            * {errors.phoneNumber.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        placeholder="010-1234-5678"
        autoFocus
        {...register('phoneNumber', {
          required: t('required_phone_number', { ns: 'translations' }),
          validate: {
            isPhoneNumber: (value) => {
              const phoneNumberRegex = /^[0-9]{3}([0-9]{3}|[0-9]{4})[0-9]{4}$/;
              return phoneNumberRegex.test(value) || 'Invalid phone number';
            },
          },
          onChange: (e) => {
            let { value } = e.target;
            value = value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
              value = value.replace(/(\d{3})(\d+)/, '$1-$2');
            } else if (value.length > 6) {
              value = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
            }
            e.target.value = value;
          },
          setValueAs: (value) => value.replace(/-/g, ''),
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="email" ref={parent}>
        {t('email', { ns: 'common' })}
        {errors.email && (
          <span className="text-red-500 font-normal flex-grow">
            * {errors.email.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="email"
        placeholder="student@example.com"
        {...register('email', {
          required: t('required_email', { ns: 'common' }),
          validate: {
            isEmail: (value) => {
              const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
              return emailRegex.test(value) || 'Invalid email address';
            },
          },
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="password" ref={parent}>
        {t('password', { ns: 'common' })}
        {errors.password && (
          <span className="text-red-500 font-normal flex-grow">
            * {errors.password.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="password"
        placeholder="**********"
        {...register('password', {
          required: t('required_password', { ns: 'common' }),
        })}
      />
    </fieldset>
  );
}
