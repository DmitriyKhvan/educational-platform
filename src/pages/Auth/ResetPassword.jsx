import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';

import InputWithError from '../../components/Form/InputWithError';
import InputField from '../../components/Form/InputField';
import useNewPassword from '../../modules/auth/hooks/newPassword';
import Button from '../../components/Form/Button';

import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const history = useHistory();
  const [t] = useTranslation('common');
  const [token, setToken] = useState();

  const { newPassword, loading, error, data } = useNewPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token'));
  }, [token]);

  useEffect(() => {
    if (data) {
      toast.success('Password has been reset!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      history.push('/');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
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
        <p className="title text-center mb-3">{t('reset_password')}</p>
        <form
          onSubmit={handleSubmit(({ password }) =>
            newPassword(token, password),
          )}
          className="form-section"
        >
          <div className="mb-7">
            <InputWithError errorsField={errors?.password}>
              <InputField
                label={t('new_password')}
                type="password"
                {...register('password', {
                  required: t('required_password'),
                })}
              />
            </InputWithError>
          </div>

          <div className="mb-10">
            <InputWithError errorsField={errors?.confirmPassword}>
              <InputField
                label={t('confirm_new_password')}
                type="password"
                {...register('confirmPassword', {
                  required: t('required_password'),
                  validate: {
                    samePass: (fieldValue) => {
                      return (
                        fieldValue === getValues('password') ||
                        t('confirm_password_error')
                      );
                    },
                  },
                })}
              />
            </InputWithError>
          </div>

          <Button type="submit" disabled={!isValid}>
            {loading ? (
              <ClipLoader loading={loading} size={20} color="white" />
            ) : (
              t('continue_')
            )}
          </Button>

          <p className="mt-10">
            {t('already_have_account')}{' '}
            <a href="/" className="forgot-password">
              {t('sign_in')}
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
