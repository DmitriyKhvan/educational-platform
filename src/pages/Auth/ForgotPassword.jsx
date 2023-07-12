import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

// import NotificationManager from '../../components/NotificationManager';
import useResetPassword from '../../modules/auth/hooks/resetPassword';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Form/Button';
import InputWithError from '../../components/Form/InputWithError';

import 'react-toastify/dist/ReactToastify.css';
import InputField from '../../components/Form/InputField';

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

  // const notify = () =>
  //   toast(
  //     'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
  //   );

  useEffect(() => {
    if (data) {
      toast.success(
        'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        },
      );
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      // NotificationManager.error(t('login_failed'), t);
      toast.error(t('login_failed'), {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
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
            <Button type="submit" disabled={!isValid}>
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
