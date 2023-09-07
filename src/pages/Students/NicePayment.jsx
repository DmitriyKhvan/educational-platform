import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/images/logo.png';
import Button from '../../components/Form/Button/Button';
import InputField from '../../components/Form/InputField';
import InputWithError from '../../components/Form/InputWithError';

export const NicePayment = () => {
  const [t] = useTranslation(['translations', 'common']);

  const submit = () => {};

  const {
    // control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      card_number: '',
      expiry: '',
      password: '',
    },
  });

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="absolute top-0 left-0 p-4">
        <img src={Logo} alt="logo" className="w-24" />
      </div>
      <form
        className="flex flex-col w-96 gap-y-4"
        onSubmit={handleSubmit(submit)}
      >
        <div>
          <InputWithError errorsField={errors?.card_number}>
            <InputField
              className="w-full"
              label={t('card_number')}
              placeholder={t('card_number')}
              {...register('card_number', {
                required: t('card_number'),
                pattern: {
                  value: '',
                  message: t('error_invalid_card_number'),
                },
              })}
            />
          </InputWithError>

          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="First name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="firstName"
          />
          {errors.firstName && <Text>This is required.</Text>} */}
        </div>

        <div className="flex items-center gap-x-4">
          <InputWithError errorsField={errors?.expiry}>
            <InputField
              className="w-full"
              label={t('expiry', { ns: 'common' })}
              placeholder={t('expiry', { ns: 'common' })}
              {...register('expiry', {
                required: t('expiry'),
                pattern: {
                  value: '',
                  message: t('error_invalid_expiry'),
                },
              })}
            />
          </InputWithError>

          <InputWithError errorsField={errors?.password}>
            <InputField
              className="w-full"
              label={t('password', { ns: 'common' })}
              placeholder={t('password', { ns: 'common' })}
              {...register('password', {
                required: t('password'),
                pattern: {
                  value: '',
                  message: t('error_invalid_password'),
                },
              })}
            />
          </InputWithError>
        </div>

        <Button
          type="submit"
          disabled={!isValid}
          theme="purple"
          className="w-full"
        >
          {/* {loading ? (
              <ClipLoader loading={loading} size={20} color="white" />
            ) : (
              t('sign_in')
            )} */}
          {t('continue_button', { ns: 'common' })}
        </Button>
      </form>
    </main>
  );
};
