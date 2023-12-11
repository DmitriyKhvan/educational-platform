import { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useTranslation } from 'react-i18next';
import InputWithError from '../Form/InputWithError';
import InputField from '../Form/InputField';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

export default function LoginForm({ register, errors }) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [parent] = useAutoAnimate();
  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  return (
    <fieldset className="flex flex-col space-y-4" ref={parent}>
      <legend className="text-[32px] sm:text-4xl sm:text-center font-bold">
        {t('lets_get_started', { ns: 'onboarding' })}
      </legend>

      <InputWithError errorsField={errors?.first_name}>
        <InputField
          className="w-full"
          label={t('first_name', { ns: 'common' })}
          placeholder={t('first_name', { ns: 'common' })}
          autoFocus
          {...register('first_name', {
            required: t('required_first_name', { ns: 'translations' }),
            focus: true,
          })}
        />
      </InputWithError>

      <InputWithError errorsField={errors?.first_name}>
        <InputField
          className="w-full"
          label={t('last_name', { ns: 'common' })}
          placeholder={t('last_name', { ns: 'common' })}
          {...register('last_name', {
            required: t('required_last_name', { ns: 'translations' }),
          })}
        />
      </InputWithError>

      <InputWithError errorsField={errors?.first_name}>
        <InputField
          className="w-full"
          label={t('phone_number', { ns: 'common' })}
          placeholder="010-1234-5678"
          {...register('phoneNumber', {
            required: t('required_phone_number', { ns: 'translations' }),
            validate: {
              isPhoneNumber: (value) => {
                const phoneNumberRegex =
                  /^[0-9]{3}([0-9]{3}|[0-9]{4})[0-9]{4}$/;
                return (
                  phoneNumberRegex.test(value) ||
                  t('invalid_phone_number', { ns: 'onboarding' })
                );
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
      </InputWithError>

      <InputWithError errorsField={errors?.first_name}>
        <InputField
          className="w-full"
          label={t('email', { ns: 'common' })}
          placeholder="student@example.com"
          autoComplete="on"
          {...register('email', {
            required: t('required_email', { ns: 'common' }),
            validate: {
              isEmail: (value) => {
                const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                return (
                  emailRegex.test(value) ||
                  t('invalid_email', { ns: 'onboarding' })
                );
              },
            },
          })}
        />
      </InputWithError>

      <InputWithError errorsField={errors?.password}>
        <InputField
          className="w-full"
          label={t('password', { ns: 'common' })}
          placeholder="at least 8 characters"
          type={isShowPassword ? 'text' : 'password'}
          icon={
            isShowPassword ? (
              <BsEyeSlashFill className="text-2xl text-color-purple" />
            ) : (
              <BsEyeFill className="text-2xl text-color-purple" />
            )
          }
          classNameIcon="cursor-pointer px-[15px]"
          iconHandler={() => setIsShowPassword(!isShowPassword)}
          {...register('password', {
            required: t('required_password', { ns: 'common' }),
          })}
        />
      </InputWithError>
    </fieldset>
  );
}
