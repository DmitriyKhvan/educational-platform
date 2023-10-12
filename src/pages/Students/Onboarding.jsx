import useMultistepForm from '../../components/onboarding/useMultistepForm';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LoginForm from '../../components/onboarding/LoginForm';
import SelectForm from '../../components/onboarding/SelectForm';
import { useForm } from 'react-hook-form';
import Logo from '../../assets/images/logo.png';
import CredentialsForm from '../../components/onboarding/CredentialsForm';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../../modules/auth/graphql';
import useLogin from '../../modules/auth/hooks/login';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from '../../constants/global';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: JSON.parse(localStorage.getItem('onboarding'))?.data ?? {},
  });

  const [isLoading, setIsLoading] = useState(false);

  const { login, data: loginData } = useLogin();

  const [parent] = useAutoAnimate();

  const [signUp] = useMutation(SIGN_UP, {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setCurrentStepIndex(
      JSON.parse(localStorage.getItem('onboarding'))?.currentStepIndex ?? 0,
    );
  }, []);

  const {
    step,
    currentStepIndex,
    steps,
    next,
    back,
    isFirst,
    isLast,
    setCurrentStepIndex,
  } = useMultistepForm([
    <LoginForm register={register} errors={errors} key="login" />,
    <SelectForm register={register} errors={errors} key="select" />,
    <CredentialsForm register={register} errors={errors} key="credentials" />,
  ]);

  const [t, i18n] = useTranslation('onboarding');

  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );

  const onChangeLanguage = (event) => {
    const lang = event.target.value === 'en' ? 1 : 0;
    setItemToLocalStorage('language', lang);
    setLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language === 0 ? 'kr' : 'en');
  }, [language]);

  const onSubmit = async (data) => {
    console.log('data', data);

    if (!isLast) {
      localStorage.setItem(
        'onboarding',
        JSON.stringify({
          data,
          currentStepIndex,
        }),
      );
      return next();
    }
    setIsLoading(() => true);
    const { errors } = await signUp({
      variables: data,
    });

    if (errors?.length === 0 || !errors) {
      login(data.email, data.password);
    }

    setIsLoading(() => false);
  };

  useEffect(() => {
    if (loginData) {
      location.href = '/purchase';
    }
  }, [loginData]);

  return (
    <main className="flex flex-col relative items-center">
      {isLoading && (
        <div className="absolute z-50 w-screen h-screen bg-black/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
            <Loader />
          </div>
        </div>
      )}
      <img
        className="w-48 md:w-64 my-[8vh] md:my-[12.5vh]"
        src={Logo}
        alt="naonow-logo"
      />
      <select
        name=""
        id=""
        onChange={onChangeLanguage}
        defaultValue={language === 0 ? 'kr' : 'en'}
        className="rounded border border-gray-300 text-sm"
      >
        <option value="en">English</option>
        <option value="kr">한국어</option>
      </select>
      <div className="max-w-2xl gap-4 w-full px-4">
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full block py-8"
        >
          {step}
          <div className="self-start mt-8 flex flex-row gap-4">
            <button
              className="py-2 px-4 bg-purple-800 text-white rounded-md font-bold disabled:bg-opacity-50 disabled:text-gray-200 disabled:cursor-not-allowed duration-200 hover:opacity-75 active:brightness-75 active:scale-95"
              type="button"
              onClick={() => {
                back();
              }}
              disabled={isFirst}
            >
              {t('back')}
            </button>
            <input
              className="py-2 px-4 bg-purple-800 text-white rounded-md font-bold duration-200 transition-transform hover:opacity-75 active:brightness-75 active:scale-95"
              type="submit"
              value={isLast ? t('finish') : t('next')}
            />
          </div>
        </form>
      </div>
      <div className="absolute flex top-0 w-full bg-purple-200">
        <span
          className={`h-2 bg-purple-800 duration-500 ease-in-out z-10`}
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        ></span>
      </div>
    </main>
  );
}
