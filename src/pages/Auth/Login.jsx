import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import InputField from '../../components/Form/InputField';
import useLogin from '../../modules/auth/hooks/login';
import Button from '../../components/Form/Button/Button';
import InputWithError from '../../components/Form/InputWithError';
import notify from '../../utils/notify';
import { Link } from 'react-router-dom';
import { Roles, setItemToLocalStorage } from 'src/constants/global';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import { useAuth } from 'src/modules/auth';

const Login = () => {
  const { logout } = useAuth();
  logout();

  const [t] = useTranslation('common');

  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const { search } = useLocation();

  // const queryParams = new URLSearchParams(search);
  // const redirectPath = queryParams.get('redirect');

  const { login, loading, error, data } = useLogin();

  const handleLogin = ({ email, password }) => {
    login(email, password);
  };

  useEffect(() => {
    if (data) {
      setItemToLocalStorage(
        'studentId',
        data?.authResult?.user?.students[0]?.id,
      );
      location.href =
        data.authResult.user.role === Roles.STUDENT
          ? '/select-profile'
          : '/mentor/manage-appointments';
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      // notify(t('login_failed'), 'error');
      notify(error.message, 'error');
    }
  }, [error]);

  return (
    <OnboardingLayout>
      <div className="min-w-full min-h-full px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col space-y-10 max-w-[440px] m-auto"
        >
          <fieldset>
            <legend className="text-[32px] mb-10 sm:text-4xl sm:text-center font-bold">
              {t('login')}
            </legend>
            <div className="flex flex-col space-y-6">
              <InputWithError errorsField={errors?.email}>
                <InputField
                  className="w-full"
                  label={t('email')}
                  placeholder="name@email.com"
                  autoComplete="on"
                  {...register('email', {
                    required: t('required_email'),
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: t('error_invalid_email'),
                    },
                  })}
                />
              </InputWithError>

              <InputWithError errorsField={errors?.password}>
                <InputField
                  className="w-full"
                  label={t('password')}
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
                  placeholder="at least 8 characters"
                  {...register('password', {
                    required: t('required_password'),
                  })}
                />

                {/* <div className="mt-3">
                <CheckboxField
                  label="Show Password"
                  name="isShowPassword"
                  onChange={(e) => setIsShowPassword(e.target.checked)}
                />
              </div> */}
              </InputWithError>

              <Link to="/forgot-password" className="forgot-password">
                {t('forgot_password')}
              </Link>
            </div>
          </fieldset>

          {/* <div className="d-grid gap-2"> */}
          <Button
            type="submit"
            disabled={!isValid}
            theme="purple"
            className="w-full"
          >
            {loading ? (
              <ClipLoader loading={loading} size={20} color="white" />
            ) : (
              t('sign_in')
            )}
          </Button>
          {/* </div> */}

          <p className="mt-16 text-[15px] text-color-light-grey font-semibold">
            {t('not_registered')}{' '}
            <Link
              to="/onboarding"
              className="text-color-purple underline underline-offset-2"
            >
              {t('signup')}
            </Link>
          </p>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default Login;
