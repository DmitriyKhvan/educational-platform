import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';

import InputMask from 'react-input-mask';
import notify from '../../utils/notify';

import { useAuth } from '../../modules/auth';
import Button from '../../components/Form/Button/Button';
import InputField from '../../components/Form/InputField';
import InputWithError from '../../components/Form/InputWithError';
import CheckboxField from '../../components/Form/CheckboxField';

import Logo from '../../assets/images/logo.png';
import nicePayment from '../../assets/images/purchase/nicePayment.png';
import { CREATE_NICE_PAYMENT } from '../../modules/auth/graphql';

export const NicePayment = () => {
  const [parent] = useAutoAnimate();

  const [createNicePayment, { loading, error }] =
    useMutation(CREATE_NICE_PAYMENT);
  const { user } = useAuth();
  const history = useHistory();

  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      history.push('/purchase');
    }
  }, [location]);

  const [t] = useTranslation(['translations', 'common']);

  const [cardType, setCardType] = useState('newCard');

  const submit = (data) => {
    const { card_number, expiry, birth, password } = data;

    const cardNumberTransform = card_number?.replaceAll(' ', '-');
    const birthTransform = birth?.replaceAll('/', '').slice(2);

    const parts = expiry?.split('/');
    const expiryTransform = expiry ? `20${parts[1]}-${parts[0]}` : '';

    const { packageId, amount, courseTitle } = location.state;

    createNicePayment({
      variables: {
        userId: parseInt(user.id),
        packageId: parseInt(packageId),
        amount,
        courseTitle,
        cardNumber: cardNumberTransform,
        expiry: expiryTransform,
        birth: birthTransform,
        pwd2Digit: password,
      },
      onCompleted: () => {
        history.push(`/purchase/${packageId}/complete?success=true`);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      card_number: '',
      birth: '',
      expiry: '',
      password: '',
    },
  });

  useEffect(() => {
    if (cardType === 'oldCard') {
      reset();
    }
  }, [cardType]);

  useEffect(() => {
    if (user.cardLast4) {
      setCardType('oldCard');
    }
  }, []);

  const isCardExpiryValid = (creditCardDate) => {
    // Getting the current date
    const currentDate = new Date();

    // We divide the credit card expiration date into a month and a year
    const parts = creditCardDate.split('/');
    const month = parseInt(parts[0], 10); // Convert month to number
    const year = parseInt(parts[1], 10); // Convert year to number

    // Create a Date object for the credit card expiration date
    const cardExpiryDate = new Date(year + 2000, month - 1, 1); // Months in JavaScript start at 0 (January is 0, February is 1, etc.)

    // Comparing the credit card expiration date with the current date
    if (cardExpiryDate > currentDate) {
      // The credit card expiration date is valid
      return true;
    } else {
      // The credit card has expired
      return t('credit_card_expired', { ns: 'common' });
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="absolute top-0 left-0 p-4">
        <img src={Logo} alt="logo" className="w-24" />
      </div>

      <div className="w-[300px]">
        <p className="text-color-dark-purple mb-7">
          Pay with your credit card via NICE
        </p>

        {user.cardLast4 && (
          <div className="mb-6">
            <CheckboxField
              label={`Card ending in ****${user.cardLast4}`}
              type="radio"
              name="card"
              checked={cardType === 'oldCard'}
              value="oldCard"
              onChange={(e) => setCardType(e.target.value)}
            />
            <CheckboxField
              label="Use a new card"
              type="radio"
              name="card"
              checked={cardType === 'newCard'}
              value="newCard"
              onChange={(e) => setCardType(e.target.value)}
            />
          </div>
        )}

        <form
          className="flex flex-col w-full gap-y-4"
          onSubmit={handleSubmit(submit)}
          ref={parent}
        >
          {cardType === 'newCard' && (
            <>
              <div>
                <InputWithError errorsField={errors?.card_number}>
                  <InputMask
                    mask="9999 9999 9999 9999"
                    maskChar=""
                    // icon={<HiOutlineCreditCard className="text-3xl" />}
                    // positionIcon="left"
                    icon={
                      <img className="w-14" src={nicePayment} alt="payment" />
                    }
                    className="w-full"
                    label={t('card_number')}
                    // placeholder={t('card_number')}
                    placeholder="1234 1234 1234 1234"
                    {...register('card_number', {
                      required: t('required_card_number', { ns: 'common' }),
                      pattern: {
                        value: /\d{4} \d{4} \d{4} \d{4}/,
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
                    maskChar=""
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
                    maskChar=""
                    className="w-full"
                    type="password"
                    label={`${t('password', { ns: 'common' })} 
                       (${t('digits', { ns: 'common', count: 2 })})`}
                    placeholder={t('password', { ns: 'common' })}
                    {...register('password', {
                      required: t('required_password', { ns: 'common' }),
                      pattern: {
                        value: /^[0-9]{2}$/,
                        message: t('error_invalid_password', {
                          ns: 'common',
                        }),
                      },
                    })}
                  >
                    {(inputProps) => <InputField {...inputProps} />}
                  </InputMask>
                </InputWithError>
              </div>

              <div>
                <InputWithError errorsField={errors?.birth}>
                  <InputMask
                    mask="9999/99/99"
                    maskChar=""
                    className="w-full"
                    label={t('birth', { ns: 'common' })}
                    placeholder="YYYY/MM/DD"
                    {...register('birth', {
                      required: t('required_birth', { ns: 'common' }),
                      pattern: {
                        value:
                          /^(?:19|20)\d\d\/(?:(?:0[1-9]|1[0-2])\/(?:0[1-9]|1\d|2[0-9])|(?:0[13-9]|1[0-2])\/(?:30)|(?:0[14578]|1[02])\/(?:3[01]))$/,
                        message: t('birth_invalid', { ns: 'common' }),
                      },
                    })}
                  >
                    {(inputProps) => <InputField {...inputProps} />}
                  </InputMask>
                </InputWithError>
              </div>
            </>
          )}
          <p className="text-color-dark-purple">
            * {t('automatically_renews', { ns: 'common' })}
          </p>

          {error && <div className="text-red-500 mt-2">*{error.message}</div>}

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="self-start rounded text-white mt-4 bg-purple-500"
          >
            {t('continue_button', { ns: 'common' })}
          </Button>
        </form>
      </div>
    </main>
  );
};
