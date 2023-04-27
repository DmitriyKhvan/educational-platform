import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import NotificationManager from '../../components/NotificationManager';
import AuthLayout from '../../components/AuthLayout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../modules/auth';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const history = useHistory();
  const [t] = useTranslation('common');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const notify = () =>
    toast(
      'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
    );

  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
  });

  const validateEmail = (email) => {
    if (!email) {
      setError(t('error_empty_field'));
      return false;
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const emailValid = re.test(email);
      if (!emailValid) {
        setError(t('error_invalid_email'));
        return false;
      } else {
        setError('');
        return true;
      }
    }
  };

  const handleForgotPassword = async ({ email }) => {
    validateEmail(email);

    const { data } = await resetPassword(email);

    if (data) {
      notify();
    }

    // let resp = await dispatch(forgotPassword(email))

    // if (resp.type === 'AUTH_FORGOT_PASSWORD_SUCCESS') {
    //   history.push('/forgot-password-guide')
    // }

    // if (resp.type === 'AUTH_FORGOT_PASSWORD_FAILURE') {
    //   if (errorMsg) {
    //     NotificationManager.error(t('forgot_password_failure'), t)
    //   }
    // }
  };

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="text-center title mb-3">{t('forgot_password')}?</p>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="form-section"
        >
          <div className="mb-3">
            <div className="form-item-inner">
              <label htmlFor="email" className="form-label">
                <strong>{t('email')}</strong>
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                {...register('email')}
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>
          <div className="d-grid gap-2 pt-4">
            <button type="submit" className="btn btn-primary btn-lg p-3">
              {t('reset_password')}
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
