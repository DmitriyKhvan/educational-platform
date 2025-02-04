import { type Dispatch, type SetStateAction, memo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '@/components/form/button';
import InputField from '@/components/form/input-field';
import InputWithError from '@/components/form/input-with-error';
import PhoneNumberField from '@/components/form/phone-number-field';
import { SelectField } from '@/components/form/select-field';
import type { PhoneNumberFieldForm } from '@/components/form/types';
import { usePublicMentors } from '@/pages/students/trial/lib/use-public-mentors';
import { timezoneOptions } from '@/shared/constants/global';
import { trimSpaces } from '@/shared/utils/trim-spaces';
import type { AuthenticatedUser, Mentor } from '@/types/types.generated';
// import type { AuthenticatedUser, TrialPackage } from '@/types/types.generated';
// import type { PhoneNumberFieldForm } from '@/components/form/types';
import { Facebook, Hotjar } from '@/widgets/tracking';
import type { SelectedPlan } from './types';

import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import type { AuthedUserWithPassword } from '.';

interface OnboardingTrialProps {
  currentUser?: AuthenticatedUser | null;
  selectedPlan?: SelectedPlan | null;
  user?: AuthedUserWithPassword;
  setUser: Dispatch<
    SetStateAction<
      | (AuthenticatedUser & {
          password: string;
        })
      | undefined
    >
  >;
  setStep: Dispatch<SetStateAction<number>>;
  setSelectMentor: Dispatch<SetStateAction<Mentor | undefined>>;
}

const OnboardingTrial = memo(function OnboardingTrial({
  currentUser,
  selectedPlan,
  user,
  setUser,
  setStep,
  setSelectMentor,
}: OnboardingTrialProps) {
  const { firstName, lastName, phoneNumber, email, timeZone, password } = user ?? {};

  const [t] = useTranslation(['onboarding', 'common', 'translations', 'lessons']);

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    control,
    resetField,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PhoneNumberFieldForm>({
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
    reset({
      firstName,
      lastName,
      phoneNumber: phoneNumber || '',
      email: email || localStorage.getItem('referralEmail') || '',
      timeZone,
      password,
    });
  }, [user, reset, firstName, lastName, phoneNumber, email, timeZone]);

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneNumberWithoutCode?: string;
    email?: string;
    timeZone: string;
    password: string;
  }) => {
    const { firstName, lastName, phoneNumber, email, timeZone, password } = data;
    const updatedUser: Partial<AuthenticatedUser> = {
      ...trimSpaces({ firstName, lastName, phoneNumber, email, timeZone, password }),
    };

    setUser(updatedUser as AuthenticatedUser & { password: string });
    if (Object.keys(selectedPlan ?? {}).length !== 0) {
      setStep(3);
    } else {
      setStep((v) => v + 1);
    }
  };

  return (
    <>
      <Facebook />
      <Hotjar />
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

          <InputWithError errorsField={errors?.phoneNumberWithoutCode ?? errors?.phoneNumber}>
            <PhoneNumberField
              disabled={!!currentUser}
              register={register}
              resetField={resetField}
              defaultNumber={phoneNumber ?? ''}
              setValue={setValue}
              watch={watch}
            />
          </InputWithError>

          <InputWithError errorsField={errors?.email}>
            <InputField
              disabled={!!currentUser}
              className="w-full"
              label={t('email', { ns: 'common' })}
              placeholder="student@example.com"
              autoComplete="on"
              {...register('email', {
                required: t('required_email', { ns: 'common' }),
                validate: {
                  isEmail: (value) => {
                    const emailRegex = /^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/;
                    return emailRegex.test(value ?? '') || t('invalid_email', { ns: 'onboarding' });
                  },
                },
              })}
            />
          </InputWithError>

          <InputWithError errorsField={errors?.timeZone}>
            <label className="font-semibold text-base text-color-dark-purple">
              {t('time_zone', { ns: 'common' })}

              <Controller
                control={control}
                defaultValue={timeZone}
                name="timeZone"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <SelectField
                    value={value}
                    options={timezoneOptions}
                    isDisabled={!!currentUser}
                    onChange={onChange}
                  />
                )}
              />
            </label>
          </InputWithError>

          <InputWithError errorsField={errors?.password}>
            <InputField
              disabled={!!currentUser}
              className="w-full"
              label={t('password', { ns: 'common' })}
              placeholder="at least 8 characters"
              type={isShowPassword ? 'text' : 'password'}
              icon={
                isShowPassword ? (
                  <BsEyeSlashFill
                    className={`text-2xl text-color-purple ${currentUser && 'grayscale'}`}
                  />
                ) : (
                  <BsEyeFill
                    className={`text-2xl text-color-purple ${currentUser && 'grayscale'}`}
                  />
                )
              }
              classNameIcon="cursor-pointer px-[15px]"
              iconHandler={() => !currentUser && setIsShowPassword(!isShowPassword)}
              {...register('password', {
                required: !currentUser ? t('required_password', { ns: 'common' }) : false,
              })}
            />
          </InputWithError>

          {process.env.REACT_APP_PRODUCTION === 'false' && (
            <label className="font-semibold text-base text-color-dark-purple">
              {t('mentor', { ns: 'lessons' })}
              <SelectField
                options={usePublicMentors()}
                isClearable
                onChange={(id) => {
                  setSelectMentor({ id } as unknown as Mentor);
                }}
              />
            </label>
          )}
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
    </>
  );
});

export default OnboardingTrial;
