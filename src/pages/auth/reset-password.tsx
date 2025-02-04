import AuthLayout from '@/components/auth-layout';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import Button from '@/components/form/button/button';
import InputField from '@/components/form/input-field';
import InputWithError from '@/components/form/input-with-error';

import { useNewPassword } from '@/app/providers/auth-provider';
import notify from '@/shared/utils/notify';
import { type NewPasswordSchema, newPasswordSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [t] = useTranslation('common');
  const [token, setToken] = useState<string | null>();

  const { newPassword, loading, error, data } = useNewPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<NewPasswordSchema>({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token'));
  }, []);

  useEffect(() => {
    if (data) {
      notify(t('reset_password'), 'success');
      navigate('/');
    }
  }, [data, navigate, t]);

  useEffect(() => {
    if (error) {
      notify(t('invalid_expired_token'), 'error');
    }
  }, [error, t]);

  const onSubmit = (data: NewPasswordSchema) => {
    if (!token) return;
    newPassword(token, data.password);
  };

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="title text-center mb-3">{t('reset_password')}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form-section">
          <div className="mb-7">
            <InputWithError errorsField={errors?.password}>
              <InputField
                className="w-full"
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
                className="w-full"
                label={t('confirm_new_password')}
                type="password"
                {...register('confirmPassword', {
                  required: t('required_password'),
                  validate: {
                    samePass: (fieldValue) => {
                      return fieldValue === getValues('password') || t('confirm_password_error');
                    },
                  },
                })}
              />
            </InputWithError>
          </div>

          <Button type="submit" disabled={!isValid} theme="purple" className="w-full">
            {loading ? (
              <ClipLoader loading={loading} size={20} color="white" />
            ) : (
              t('continue_button')
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
