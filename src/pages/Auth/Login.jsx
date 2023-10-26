import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/Form/InputField';
// import CheckboxField from '../../components/Form/CheckboxField'; text-color-purple
import useLogin from '../../modules/auth/hooks/login';
import Button from '../../components/Form/Button/Button';
import InputWithError from '../../components/Form/InputWithError';
import notify from '../../utils/notify';
import { Link } from 'react-router-dom';
import { Roles } from 'src/constants/global';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const Login = () => {
  localStorage.removeItem('studentId');

  const [t] = useTranslation('common');

  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
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

  if (data) {
    location.href =
      data.authResult.user.role === Roles.STUDENT
        ? '/select-profile'
        : '/mentor/manage-appointments';
  }

  if (error) {
    notify(t('login_failed'), 'error');
  }

  return (
    <AuthLayout>
      <div className="auth-login">
        <div className="text-center">
          <h1 className="title text-center">{t('login')}</h1>
        </div>
        <form onSubmit={handleSubmit(handleLogin)} className="form-section">
          <div className="mb-7">
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
          </div>

          <div className="mb-7">
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
          </div>

          <div className="mb-7 mt-7">
            <Link to="/forgot-password" className="forgot-password">
              {t('forgot_password')}
            </Link>
          </div>

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

          {/* <div className='registered'>
            <p className='mt-5'>
              <a href='/signup' className='forgot-password'>
                {t('not_registered')}
              </a>
            </p>
          </div> */}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
