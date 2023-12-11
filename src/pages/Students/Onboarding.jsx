import useMultistepForm from '../../components/onboarding/useMultistepForm';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LoginForm from '../../components/onboarding/LoginForm';
// import SelectForm from '../../components/onboarding/SelectForm';
import { useForm } from 'react-hook-form';

// import CredentialsForm from '../../components/onboarding/CredentialsForm';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../../modules/auth/graphql';
import useLogin from '../../modules/auth/hooks/login';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from 'src/components/Form/Button';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

export default function Onboarding() {
  localStorage.removeItem('studentId');

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
    // steps,
    next,
    isLast,
    setCurrentStepIndex,
  } = useMultistepForm([
    <LoginForm register={register} errors={errors} key="login" />,
    // <SelectForm register={register} errors={errors} key="select" />,
    // <CredentialsForm register={register} errors={errors} key="credentials" />,
  ]);

  const [t] = useTranslation(['onboarding', 'common']);

  const onSubmit = async (data) => {
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
      localStorage.removeItem('onboarding');
    }

    setIsLoading(() => false);
  };

  useEffect(() => {
    if (loginData) {
      location.href = '/purchase';
    }
  }, [loginData]);

  return (
    <OnboardingLayout>
      {isLoading && (
        <div className="absolute z-50 w-screen h-screen bg-black/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
            <Loader />
          </div>
        </div>
      )}

      <div className="max-w-[440px] gap-4 w-full px-5 py-6 sm:py-10">
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full block"
        >
          {step}

          <Button
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
