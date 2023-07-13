import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';

import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/Form/InputField';
import CheckboxField from '../../components/Form/CheckboxField';
import useLogin from '../../modules/auth/hooks/login';
import Button from '../../components/Form/Button';
import InputWithError from '../../components/Form/InputWithError';
import toastCustom from '../../utils/toastCustom';

const Login = () => {
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

  const { login, loading, error } = useLogin();

  useEffect(() => {
    if (error) {
      toastCustom('error', t('login_failed'));
    }
  }, [error]);

  return (
    <AuthLayout>
      <div className="auth-login">
        <div className="text-center">
          <h1 className="title text-center">{t('login')}</h1>
        </div>
        <form
          onSubmit={handleSubmit(({ email, password }) =>
            login(email, password),
          )}
          className="form-section"
        >
          <div className="mb-7">
            <InputWithError errorsField={errors?.email}>
              <InputField
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
                label={t('password')}
                type={isShowPassword ? 'text' : 'password'}
                placeholder="at least 8 characters"
                {...register('password', {
                  required: t('required_password'),
                })}
              />

              <div className="mt-3">
                <CheckboxField
                  label="Show Password"
                  onChange={(check) => setIsShowPassword(check)}
                />
              </div>
            </InputWithError>
          </div>

          <div className="mb-7 mt-7">
            <Link to="/forgot-password" className="forgot-password">
              {t('forgot_password')}
            </Link>
          </div>

          {/* <div className="d-grid gap-2"> */}
          <Button type="submit" disabled={!isValid}>
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
