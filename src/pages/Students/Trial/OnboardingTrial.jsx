import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
// import { useMutation } from '@apollo/client';
// import { SIGN_UP } from '../../../modules/auth/graphql';
// import useLogin from '../../../modules/auth/hooks/login';

// import Loader from '../../../components/Loader/Loader';
import Button from 'src/components/Form/Button';
// import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

import InputWithError from 'src/components/Form/InputWithError';
import InputField from 'src/components/Form/InputField';
// import notify from 'src/utils/notify';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import ReactInputMask from 'react-input-mask';
import { PhoneCodeListModal } from 'src/components/onboarding/PhoneCodeListModal';
import { phoneCodes } from 'src/constants/global';
import MyDropdownMenu from 'src/components/DropdownMenu';
import { MyDrawer } from 'src/components/Drawer';
import { useMediaQuery } from 'react-responsive';

export default function OnboardingTrial({ setUser, setStep }) {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  localStorage.removeItem('studentId');

  const [country, setCountry] = useState(phoneCodes[4]);

  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  const [isShowPassword, setIsShowPassword] = useState(false);
  // const [isLoading] = useState(false);

  const [parent] = useAutoAnimate();

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { phoneNumber: '' },
  });

  // const { login, data: loginData } = useLogin();
  // const [signUp] = useMutation(SIGN_UP_TRIAL);

  const onSubmit = async (data) => {
    const user = {
      ...data,
      phoneNumber: `${country.code}${data.phoneNumber.replace(/[-()]/g, '')}`,
    };
    console.log('user', user);
    setUser(user);
    setStep((v) => v + 1);
    //   location.href = '/trial/details';
    //   setIsLoading(true);
    //   try {
    //     await signUp({
    //       variables: {
    //         data: {
    //           user: {
    //             ...data,
    //           },
    //           phoneNumber: `${country.code}${data.phoneNumber.replace(
    //             /[-()]/g,
    //             '',
    //           )}`,
    //           timeZone: 'Asia/Seoul', //Asia/Seoul - default value on server side, if omitted
    //         },
    //         packageId: 67, //(67, 42, 31) - selects from previous step
    //         lessonBooking: {
    //           mentorId: 3, //selects on previous step
    //           startAt: new Date(), //selects from previous step
    //         },
    //       },
    //     });
    //     login(data.email, data.password);
    //   } catch (error) {
    //     notify(error.message, 'error');
    //   }
    //   setIsLoading(false);
  };

  // useEffect(() => {
  //   if (loginData) {
  //     location.href = '/purchase';
  //   }
  // }, [loginData]);

  return (
    <>
      {/* <OnboardingLayout> */}
      {/* {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )} */}

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

          <InputWithError errorsField={errors?.phoneNumber}>
            <div>
              <label
                className="flex mb-[10px] font-semibold text-[15px] leading-5 tracking-[-0.2px]"
                htmlFor="phoneNumber"
              >
                {t('phone_number', { ns: 'common' })}
              </label>
              <div className="flex items-center justify-between gap-2">
                {isMobile ? (
                  <MyDrawer
                    button={
                      <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <img
                            className="w-[22px]"
                            src={country?.flag}
                            alt={country?.name}
                          />
                          <span className="text-sm font-medium">
                            {country?.code}
                          </span>
                          <MdOutlineKeyboardArrowDown className="w-4" />
                        </div>
                      </label>
                    }
                  >
                    <PhoneCodeListModal
                      setCountry={setCountry}
                      currentCountry={country}
                      resetField={resetField}
                    />
                  </MyDrawer>
                ) : (
                  <MyDropdownMenu
                    button={
                      <label className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none cursor-pointer">
                        <div className="flex items-center justify-between gap-2">
                          <img
                            className="w-[22px]"
                            src={country?.flag}
                            alt={country?.name}
                          />
                          <span className="text-sm font-medium">
                            {country?.code}
                          </span>
                          <MdOutlineKeyboardArrowDown className="w-4" />
                        </div>
                      </label>
                    }
                  >
                    <PhoneCodeListModal
                      setCountry={setCountry}
                      currentCountry={country}
                      resetField={resetField}
                    />
                  </MyDropdownMenu>
                )}

                <ReactInputMask
                  id="phoneNumber"
                  mask={
                    country?.mask.replace(/#/g, '9') /*.replace(/-/g, ' ')*/
                  }
                  maskChar="X"
                  className="w-full"
                  placeholder={country?.mask.replace(/#/g, 'X')}
                  {...register('phoneNumber', {
                    required: t('required_phone_number', {
                      ns: 'translations',
                    }),
                    pattern: {
                      value: new RegExp(
                        country?.mask.replace(/[()#]/g, (match) => {
                          if (match === '(') return '\\(';
                          if (match === ')') return '\\)';
                          if (match === '#') return '\\d';
                          return match;
                        }),
                      ),
                      message: t('invalid_phone_number', {
                        ns: 'onboarding',
                      }),
                    },
                  })}
                >
                  {(inputProps) => <InputField {...inputProps} />}
                </ReactInputMask>
              </div>
            </div>
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
          {t('create_account', { ns: 'onboarding' })}
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
      {/* </OnboardingLayout> */}
    </>
  );
}
