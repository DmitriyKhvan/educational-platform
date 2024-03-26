import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import Button from 'src/components/Form/Button';

import InputWithError from 'src/components/Form/InputWithError';
import InputField from 'src/components/Form/InputField';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

import { timezoneOptions } from 'src/constants/global';
import { SelectField } from 'src/components/Form/SelectField';
import PhoneNumberField from 'src/components/Form/PhoneNumberField';
import { trimSpaces } from 'src/utils/trimSpaces';

export default function OnboardingTrial({
  selectedPlan,
  user,
  setUser,
  setStep,
}) {
  const { firstName, lastName, phoneNumber, email, timeZone, password } = user;

  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    resetField,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName,
      lastName,
      phoneNumber: '',
      phoneNumberWithoutCode: '',
      email,
      timeZone,
      password,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName,
        lastName,
        phoneNumber,
        email,
        timeZone,
        password,
      });
    }
  }, [user]);

  const onSubmit = async (data) => {
    delete data.phoneNumberWithoutCode;
    const user = {
      ...trimSpaces(data),
      phoneNumber: data.phoneNumber,
    };
    setUser(user);
    if (Object.keys(selectedPlan).length !== 0) {
      setStep(3);
    } else {
      setStep((v) => v + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[440px] m-auto">
      <fieldset className="flex flex-col space-y-4">
        <legend className="text-[32px] sm:text-4xl sm:text-center font-bold">
          {t('lets_get_started', { ns: 'onboarding' })}
        </legend>

        <InputWithError errorsField={errors?.firstName}>
          <InputField
            className="w-full"
            label={t('first_name', { ns: 'common' })}
            placeholder={t('first_name', { ns: 'common' })}
            // autoFocus
            {...register('firstName', {
              required: t('required_first_name', { ns: 'translations' }),
              // focus: true,
            })}
          />
        </InputWithError>

        <InputWithError errorsField={errors?.lastName}>
          <InputField
            className="w-full"
            label={t('last_name', { ns: 'common' })}
            placeholder={t('last_name', { ns: 'common' })}
            {...register('lastName', {
              required: t('required_last_name', { ns: 'translations' }),
            })}
          />
        </InputWithError>

        <InputWithError
          errorsField={errors?.phoneNumberWithoutCode ?? errors?.phoneNumber}
        >
          <PhoneNumberField
            disabled={email && true}
            register={register}
            resetField={resetField}
            defaultNumber={phoneNumber}
            setValue={setValue}
            watch={watch}
          />
        </InputWithError>

        <InputWithError errorsField={errors?.email}>
          <InputField
            disabled={email}
            className="w-full"
            label={t('email', { ns: 'common' })}
            placeholder="student@example.com"
            autoComplete="on"
            {...register('email', {
              required: t('required_email', { ns: 'common' }),
              validate: {
                isEmail: (value) => {
                  const emailRegex =
                    /^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/;
                  return (
                    emailRegex.test(value) ||
                    t('invalid_email', { ns: 'onboarding' })
                  );
                },
              },
            })}
          />
        </InputWithError>

        <InputWithError errorsField={errors?.timeZone}>
          <label className="not-italic font-semibold text-base text-color-dark-purple">
            {t('time_zone', { ns: 'common' })}

            <Controller
              control={control}
              defaultValue={timeZone}
              disabled={email && true}
              name="timeZone"
              rules={{
                required: true,
              }}
              render={({ field: { value, disabled, onChange } }) => (
                <SelectField
                  value={value}
                  options={timezoneOptions}
                  isDisabled={disabled}
                  onChange={onChange}
                />
              )}
            />
          </label>
        </InputWithError>

        <InputWithError errorsField={errors?.password}>
          <InputField
            disabled={email}
            className="w-full"
            label={t('password', { ns: 'common' })}
            placeholder="at least 8 characters"
            type={isShowPassword ? 'text' : 'password'}
            icon={
              isShowPassword ? (
                <BsEyeSlashFill
                  className={`text-2xl text-color-purple ${
                    email && 'grayscale'
                  }`}
                />
              ) : (
                <BsEyeFill
                  className={`text-2xl text-color-purple ${
                    email && 'grayscale'
                  }`}
                />
              )
            }
            classNameIcon="cursor-pointer px-[15px]"
            iconHandler={() => !email && setIsShowPassword(!isShowPassword)}
            {...register('password', {
              required: !email
                ? t('required_password', { ns: 'common' })
                : false,
            })}
          />
        </InputWithError>
      </fieldset>

      <Button
        disabled={!isValid}
        className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
        type="submit"
      >
        {t('create_account', { ns: 'onboarding' })}
      </Button>

      <p className="text-[18px] text-color-light-grey font-semibold">
        {t('already_have_account', { ns: 'common' })}{' '}
        <Link to="/" className="text-color-purple underline underline-offset-2">
          {t('sign_in', { ns: 'common' })}
        </Link>
      </p>
    </form>
  );
}
