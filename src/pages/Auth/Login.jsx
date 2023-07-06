import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';

import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/Form/InputField';
import CheckboxField from '../../components/Form/CheckboxField';
import useLogin from '../../modules/auth/hooks/login';

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

  const { login, loading } = useLogin();

  const handleLogin = ({ email, password }) => {
    login(email, password);
  };

  return (
    <AuthLayout>
      <div className="auth-login">
        <div className="text-center">
          <h1 className="title text-center">{t('login')}</h1>
        </div>
        <form onSubmit={handleSubmit(handleLogin)} className="form-section">
          <div className="mb-4 form-item-inner">
            <InputField
              label={t('email')}
              placeholder="name@email.com"
              autoComplete="on"
              register={register('email', {
                required: t('required_email'),
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: t('error_invalid_email'),
                },
              })}
            />

            {errors?.email && (
              <p className="error-msg">{errors?.email?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <div className="form-item-inner">
              <InputField
                label={t('password')}
                type={isShowPassword ? 'text' : 'password'}
                placeholder="at least 8 characters"
                register={register('password', {
                  required: t('required_password'),
                })}
              />

              <div className="flex mt-3 gap-2">
                <CheckboxField
                  label="Show Password"
                  onChange={(check) => setIsShowPassword(check)}
                />
              </div>

              {errors?.password && (
                <p className="error-msg">{errors?.password?.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4 forget">
            <Link to="/forgot-password" className="forgot-password">
              {t('forgot_password')}
            </Link>
          </div>

          <div className="d-grid gap-2">
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-primary btn-lg p-3"
            >
              {loading ? (
                <ClipLoader loading={loading} size={20} color="white" />
              ) : (
                t('sign_in')
              )}
            </button>
          </div>
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
