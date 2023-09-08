import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import Button from '../../components/Form/Button/Button';
import InputField from '../../components/Form/InputField';
import InputWithError from '../../components/Form/InputWithError';
import Logo from '../../assets/images/logo.png';
import { HiOutlineCreditCard } from 'react-icons/hi2';

export const NicePayment = () => {
  const [t] = useTranslation(['translations', 'common']);

  const submit = (data) => {
    console.log(data);
  };

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

  const isCardExpiryValid = (creditCardDate) => {
    // Получаем текущую дату
    var currentDate = new Date();

    // Разбиваем дату срока кредитной карты на месяц и год
    var parts = creditCardDate.split('/');
    var month = parseInt(parts[0], 10); // Преобразуем месяц в число
    var year = parseInt(parts[1], 10); // Преобразуем год в число

    // Создаем объект Date для срока кредитной карты
    var cardExpiryDate = new Date(year + 2000, month - 1, 1); // Месяцы в JavaScript начинаются с 0 (январь - 0, февраль - 1 и т.д.)

    // Сравниваем срок кредитной карты с текущей датой
    if (cardExpiryDate > currentDate) {
      // Срок кредитной карты действителен.
      return true;
    } else {
      // Срок кредитной карты истек.
      return 'Срок кредитной карты истек.';
    }
  };

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
            <InputMask
              mask="9999 9999 9999 9999"
              maskChar="_"
              icon={<HiOutlineCreditCard className="text-3xl" />}
              className="w-full"
              label={t('card_number')}
              placeholder={t('card_number')}
              {...register('card_number', {
                required: t('required_card_number', { ns: 'common' }),
                minLength: {
                  value: 19,
                  message: t('card_number_invalid', { ns: 'common' }),
                },
              })}
            >
              {(inputProps) => <InputField {...inputProps} />}
            </InputMask>
          </InputWithError>
        </div>

        <div className="flex items-start gap-x-4">
          <InputWithError errorsField={errors?.expiry}>
            <InputMask
              mask="99/99"
              maskChar="_"
              className="w-full"
              label={t('expiry', { ns: 'common' })}
              placeholder="MM/YY"
              {...register('expiry', {
                required: t('required_expiry', { ns: 'common' }),
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
                  message: t('error_invalid_expiry', { ns: 'common' }),
                },
                validate: isCardExpiryValid,
              })}
            >
              {(inputProps) => <InputField {...inputProps} />}
            </InputMask>
          </InputWithError>

          <InputWithError errorsField={errors?.password}>
            <InputMask
              mask="99"
              maskChar="_"
              className="w-full"
              label={t('password', { ns: 'common' })}
              placeholder={t('password', { ns: 'common' })}
              {...register('password', {
                required: t('required_password', { ns: 'common' }),
                pattern: {
                  value: /^[0-9]{2}$/,
                  message: t('error_invalid_password', { ns: 'common' }),
                },
              })}
            >
              {(inputProps) => <InputField {...inputProps} />}
            </InputMask>
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
