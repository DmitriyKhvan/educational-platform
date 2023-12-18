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

import InputWithError from 'src/components/Form/InputWithError';
import InputField from 'src/components/Form/InputField';
import notify from 'src/utils/notify';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import countries from 'countries-phone-masks';
import ReactInputMask from 'react-input-mask';
import ModalWrapper from 'src/components/ModalWrapper/ModalWrapper';
import { PhoneCodeListModal } from 'src/components/onboarding/PhoneCodeListModal';

export default function Onboarding() {
  localStorage.removeItem('studentId');

  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState(countries[115]);

  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [parent] = useAutoAnimate();

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: { phoneNumber: '' },
  });

  const { login, data: loginData } = useLogin();
  const [signUp] = useMutation(SIGN_UP);

  const onSubmit = async (data) => {
    if (data) {
      console.log({
        ...data,
        phoneNumber: `${country.code}${data.phoneNumber.replace(/[-()]/g, '')}`,
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        variables: { ...data },
      });

      login(data.email, data.password);
    } catch (error) {
      notify(error.message, 'error');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (loginData) {
      location.href = '/purchase';
    }
  }, [loginData]);

  // const getPhoneCodeList = () => {
  //   console.log(1);
  // };

  return (
    <OnboardingLayout>
      {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="min-w-full min-h-full px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[440px] m-auto"
        >
          <fieldset className="flex flex-col space-y-4" ref={parent}>
            <legend className="text-[32px] sm:text-4xl sm:text-center font-bold">
              {t('lets_get_started', { ns: 'onboarding' })}
            </legend>

            <InputWithError errorsField={errors?.firstName}>
              <InputField
                className="w-full"
                label={t('first_name', { ns: 'common' })}
                placeholder={t('first_name', { ns: 'common' })}
                autoFocus
                {...register('firstName', {
                  required: t('required_first_name', { ns: 'translations' }),
                  focus: true,
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

            <div>
              <label
                className="flex mb-[10px] font-semibold text-[15px] leading-5 tracking-[-0.2px]"
                htmlFor="phoneNumber"
              >
                {t('phone_number', { ns: 'common' })}
              </label>
              <div className="flex items-center justify-between gap-2">
                <label
                  onClick={() => setIsOpen(true)}
                  className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <img
                      className="w-[22px]"
                      src={country?.flag}
                      alt={country?.name}
                    />
                    <span className="text-sm font-medium">{country?.code}</span>
                    <MdOutlineKeyboardArrowDown className="w-4" />
                  </div>
                </label>

                <ReactInputMask
                  id="phoneNumber"
                  mask={
                    country?.mask.replace(/#/g, '9') /*.replace(/-/g, ' ')*/
                  }
                  maskChar=""
                  className="w-full"
                  placeholder={country?.mask}
                  {...register('phoneNumber')}
                >
                  {(inputProps) => <InputField {...inputProps} />}
                </ReactInputMask>
              </div>
            </div>

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
      <ModalWrapper
        isOpen={isOpen}
        closeModal={setIsOpen}
        widthContent="400px"
        // heightContent="268px"
        paddingContent="40px 0 0 0"
      >
        <PhoneCodeListModal
          setIsOpenTermsConditions={setIsOpen}
          setCountry={setCountry}
          currentCountry={country}
          resetField={resetField}
        />
      </ModalWrapper>
    </OnboardingLayout>
  );
}
