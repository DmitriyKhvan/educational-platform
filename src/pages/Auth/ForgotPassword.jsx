import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

// import NotificationManager from '../../components/NotificationManager';
import useResetPassword from '../../modules/auth/hooks/resetPassword';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Form/Button/Button';
import InputWithError from '../../components/Form/InputWithError';

import 'react-toastify/dist/ReactToastify.css';
import InputField from '../../components/Form/InputField';
import notify from '../../utils/notify';

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

  const { resetPassword, loading, error, data } = useResetPassword();

  useEffect(() => {
    if (data) {
      notify(t('reset_password_message'), 'success');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notify(t('login_failed'), 'error');
    }
  }, [error]);

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="text-center title mb-3">{t('forgot_password')}?</p>
        <form
          onSubmit={handleSubmit(({ email }) => resetPassword(email))}
          className="form-section"
        >
          <div className="mb-3">
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

          <div className="d-grid gap-2 pt-4">
            <Button
              type="submit"
              disabled={!isValid}
              theme="purple"
              className="w-full"
            >
              {loading ? (
                <ClipLoader loading={loading} size={20} color="white" />
              ) : (
                t('reset_password')
              )}
            </Button>
          </div>
          <p className="mt-5">
            {t('already_have_account')}{' '}
            <a href="/" className="forgot-password">
              {t('sign_in')}
            </a>
          </p>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </AuthLayout>
  );
};

export default ForgotPassword;
