import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

import useResetPassword from '../../modules/auth/hooks/resetPassword';
import Button from '../../components/Form/Button/Button';
import InputWithError from '../../components/Form/InputWithError';

import InputField from '../../components/Form/InputField';
import notify from '../../utils/notify';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation('common');

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
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notify(t('login_failed'), 'error');
    }
  }, [error]);

  return (
    <OnboardingLayout>
      <div className="min-w-full min-h-full px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <form
          onSubmit={handleSubmit(({ email }) =>
            resetPassword(email, currentLanguage),
          )}
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
            {loading ? (
              <ClipLoader loading={loading} size={20} color="white" />
            ) : (
              t('reset_password')
            )}
          </Button>

          <p className="text-[18px] text-color-light-grey font-semibold">
            {t('already_have_account', { ns: 'common' })}{' '}
            <Link
              to="/"
              className="text-color-purple underline underline-offset-2"
            >
              {t('sign_in', { ns: 'common' })}
            </Link>
          </p>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default ForgotPassword;
