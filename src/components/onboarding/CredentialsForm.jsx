import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function CredentialsForm({ register, errors }) {
  const [parent] = useAutoAnimate();

  return (
    <fieldset className="flex flex-col space-y-4">
      <legend className="text-2xl font-bold">Let&apos;s get started!</legend>
      <label className="font-bold flex gap-2" htmlFor="email" ref={parent}>
        Email
        {errors.email && (
          <span className="text-red-500 font-normal flex-grow">
            * {errors.email.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="email"
        autoFocus
        {...register('email', {
          required: 'Email is required',
          validate: {
            isEmail: (value) => {
              const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
              return emailRegex.test(value) || 'Invalid email address';
            },
          },
        })}
      />
      <label className="font-bold flex gap-2" htmlFor="phone" ref={parent}>
        Phone number
        {errors.phone && (
          <span className="text-red-500 font-normal flex-grow">
            * {errors.phone.message}
          </span>
        )}
      </label>
      <input
        className="rounded-md ring-purple-800 duration-200 border border-gray-300"
        type="text"
        placeholder="010-1234-5678"
        {...register('phone', {
          required: 'Phone number is required',
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
    </fieldset>
  );
}
