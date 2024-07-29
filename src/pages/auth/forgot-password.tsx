import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

import Button from '@/components/form/button/button';
import InputWithError from '@/components/form/input-with-error';

import { useResetPassword } from '@/app/providers/auth-provider';
import InputField from '@/components/form/input-field';
import notify from '@/shared/utils/notify';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();

  const currentLanguage = i18n.language;

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
      navigate('/');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notify(t('login_failed'), 'error');
    }
  }, [error]);

  return (
    <form
      onSubmit={handleSubmit(({ email }) => resetPassword(email, currentLanguage))}
      className="max-w-[440px] m-auto"
    >
      <fieldset>
        <legend className="text-[32px] mb-10 sm:text-4xl sm:text-center font-bold">
          {t('forgot_password')}?
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
        </div>
      </fieldset>

      <Button
        type="submit"
        disabled={!isValid}
        className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
      >
        {loading ? <ClipLoader loading={loading} size={20} color="white" /> : t('reset_password')}
      </Button>

      <p className="text-[18px] text-color-light-grey font-semibold">
        {t('already_have_account', { ns: 'common' })}{' '}
        <Link to="/" className="text-color-purple underline underline-offset-2">
          {t('sign_in', { ns: 'common' })}
        </Link>
      </p>
    </form>
  );
};

export default ForgotPassword;
