import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';
import { ATTACH_STUDENT_TO_USER } from 'src/modules/auth/graphql';
import { useAuth } from 'src/modules/auth';
import notify from 'src/utils/notify';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import InputWithError from 'src/components/Form/InputWithError';
import InputField from 'src/components/Form/InputField';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';

export const AddStudentProfile = () => {
  const [t] = useTranslation(['onboarding', 'common', 'translations']);
  const [parent] = useAutoAnimate();

  const { user } = useAuth();

  const [attachStudentToUser, { loading, error, data }] = useMutation(
    ATTACH_STUDENT_TO_USER,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { firstName, lastName } = data;

    attachStudentToUser({
      variables: {
        userId: user.id,
        firstName,
        lastName,
      },
    });
  };

  if (data) {
    notify('Student profile added');
    location.href = '/select-profile';
  }

  if (error) {
    notify(error.message, 'error');
  }

  return (
    <OnboardingLayout>
      {loading && (
        <div className="absolute z-50 w-screen h-screen bg-black/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
            <Loader />
          </div>
        </div>
      )}
      <div className="max-w-[440px] gap-4 w-full px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full block py-8">
          <fieldset className="flex flex-col space-y-4" ref={parent}>
            <legend className="text-[32px] sm:text-4xl sm:text-center font-bold">
              {t('lets_get_started', { ns: 'onboarding' })}
            </legend>

            <InputWithError errorsField={errors?.first_name}>
              <InputField
                className="w-full"
                label={t('first_name', { ns: 'common' })}
                placeholder={t('first_name', { ns: 'common' })}
                autoFocus
                {...register('first_name', {
                  required: t('required_first_name', { ns: 'translations' }),
                  focus: true,
                })}
              />
            </InputWithError>

            <InputWithError errorsField={errors?.first_name}>
              <InputField
                className="w-full"
                label={t('last_name', { ns: 'common' })}
                placeholder={t('last_name', { ns: 'common' })}
                {...register('last_name', {
                  required: t('required_last_name', { ns: 'translations' }),
                })}
              />
            </InputWithError>
          </fieldset>

          <Button
            className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
            type="submit"
          >
            Add profile
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};
