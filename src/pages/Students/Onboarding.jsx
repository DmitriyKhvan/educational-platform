import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../../modules/auth/graphql';
import useLogin from '../../modules/auth/hooks/login';

import Loader from '../../components/Loader/Loader';
import Button from 'src/components/Form/Button';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from 'src/constants/global';
import InputWithError from 'src/components/Form/InputWithError';
import InputField from 'src/components/Form/InputField';
import notify from 'src/utils/notify';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

export default function Onboarding() {
  localStorage.removeItem('studentId');

  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [parent] = useAutoAnimate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: JSON.parse(getItemToLocalStorage('onboarding'))?.data ?? {},
  });

  const { login, data: loginData } = useLogin();
  const [signUp] = useMutation(SIGN_UP);

  const onSubmit = async (data) => {
    setIsLoading(true);

    setItemToLocalStorage(
      'onboarding',
      JSON.stringify({
        data,
      }),
    );

    try {
      await signUp({
        variables: {
          dataa: data,
        },
      });

      login(data.email, data.password);
    } catch (error) {
      notify(error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (loginData) {
      location.href = '/purchase';
    }
  }, [loginData]);

  return (
    <OnboardingLayout>
      {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="w-full h-full px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[440px] m-auto"
        >
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

            <InputWithError errorsField={errors?.last_name}>
              <InputField
                className="w-full"
                label={t('last_name', { ns: 'common' })}
                placeholder={t('last_name', { ns: 'common' })}
                {...register('last_name', {
                  required: t('required_last_name', { ns: 'translations' }),
                })}
              />
            </InputWithError>

            <InputWithError errorsField={errors?.phoneNumber}>
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
                      value = value.replace(
                        /(\d{3})(\d{3,4})(\d{4})/,
                        '$1-$2-$3',
                      );
                    }
                    e.target.value = value;
                  },
                  setValueAs: (value) => value.replace(/-/g, ''),
                })}
              />
            </InputWithError>

            <InputWithError errorsField={errors?.email}>
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

          <Button
            disabled={!isValid}
            className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
            type="submit"
          >
            {t('create_account')}
          </Button>

          <p className="text-[18px] text-color-light-grey font-semibold">
            {t('already_have_account', { ns: 'common' })}{' '}
            <Link
              to="/"
              className="text-color-purple underline underline-offset-2"
            >
              {t('sign_in', { ns: 'common' })}
            </Link>
          </p>
        </form>
      </div>
    </OnboardingLayout>
  );
}
