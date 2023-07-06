import React from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

import AuthLayout from '../../components/AuthLayout';
import InputField from '../../components/Form/InputField';
import useResetPassword from '../../modules/auth/hooks/resetPassword';

import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [t] = useTranslation('common');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
    },
  });

  const { resetPassword, loading } = useResetPassword();

  const handleForgotPassword = ({ email }) => {
    resetPassword(email);
  };

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="text-center title mb-3">{t('forgot_password')}?</p>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="form-section"
        >
          <div className="mb-3 form-item-inner">
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
          <div className="d-grid gap-2 pt-4">
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-primary btn-lg p-3"
            >
              {loading ? (
                <ClipLoader loading={loading} size={20} color="white" />
              ) : (
                t('reset_password')
              )}
            </button>
          </div>
          <p className="mt-5">
            {t('already_have_account')}{' '}
            <a href="/" className="forgot-password">
              {t('sign_in')}
            </a>
          </p>
        </form>
      </div>
      <ToastContainer />
    </AuthLayout>
  );
};

export default ForgotPassword;
