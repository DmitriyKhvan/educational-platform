import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import Button from '../../components/Form/Button/Button';
import InputField from '../../components/Form/InputField';
import InputWithError from '../../components/Form/InputWithError';
import Logo from '../../assets/images/logo.png';
// import { HiOutlineCreditCard } from 'react-icons/hi2';
import nicePayment from '../../assets/images/purchase/nicePayment.png';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { useMutation, gql } from '@apollo/client';
import notify from '../../utils/notify';

const CREATE_NICE_PAYMENT = gql`
  mutation CREATE_NICE_PAYMENT(
    $userId: ID!
    $packageId: ID!
    $amount: Int!
    $courseTitle: String!
    $cardNumber: String!
    $expiry: String!
    $birth: String!
    $pwd2Digit: String!
  ) {
    createNicePayment(
      userId: $userId
      packageId: $packageId
      amount: $amount
      courseTitle: $courseTitle
      cardNumber: $cardNumber
      expiry: $expiry
      birth: $birth
      pwd2Digit: $pwd2Digit
    ) {
      id
      status
      provider
      cancelReason
      metadata
      user {
        id
        email
        firstName
        lastName
        fullName
        koreanEquivalent
        phoneNumber
        address
        gender
        timeZone
        country
        avatar
        referalCode
        referalId
        # students
        # mentor
        # packageSubscriptions
        # activeSubscriptions
        isActive
        role
        createdAt
        updatedAt
      }
      package {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        courseId
        # course
        # student
        # packageSubscription
      }
      packageSubscription {
        id
        periodStart
        periodEnd
        credits
        modifyCredits
        packageId
        # package
        paymentId
        # payment
        # lessons
      }
      createdAt
      updatedAt
    }
  }
`;

export const NicePayment = () => {
  const [createNicePayment] = useMutation(CREATE_NICE_PAYMENT);
  const { user } = useAuth();
  const params = useParams();
  const urlParams = new URLSearchParams(window.location.search);

  const [t] = useTranslation(['translations', 'common']);

  const submit = (data) => {
    const { card_number, expiry, birth, password } = data;

    const cardNumberTransform = card_number.replaceAll(' ', '-');
    const birthTransform = birth.replaceAll('/', '');

    const parts = expiry.split('/');
    const expiryTransform = `20${parts[1]}-${parts[0]}`;

    createNicePayment({
      variables: {
        userId: parseInt(user.id),
        packageId: parseInt(params.packageId),
        amount: parseInt(urlParams.get('amount')),
        courseTitle: urlParams.get('courseTitle'),
        cardNumber: cardNumberTransform,
        expiry: expiryTransform,
        birth: birthTransform,
        pwd2Digit: password,
      },
      onCompleted: (data) => {
        console.log('data', data);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  const {
    register,
    handleSubmit,
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
      <form
        className="flex flex-col w-96 gap-y-4"
        onSubmit={handleSubmit(submit)}
      >
        <div>
          <InputWithError errorsField={errors?.card_number}>
            <InputMask
              mask="9999 9999 9999 9999"
              maskChar=""
              // icon={<HiOutlineCreditCard className="text-3xl" />}
              icon={<img className="w-14" src={nicePayment} alt="payment" />}
              className="w-full"
              label={t('card_number')}
              placeholder={t('card_number')}
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

        <div>
          <InputWithError errorsField={errors?.birth}>
            <InputMask
              mask="99/99/99"
              maskChar=""
              className="w-full"
              label={t('birth', { ns: 'common' })}
              placeholder="YY/MM/DD"
              {...register('birth', {
                required: t('required_birth', { ns: 'common' }),
                // pattern: {
                //   value: /\d{4} \d{4} \d{4} \d{4}/,
                //   message: t('card_number_invalid', { ns: 'common' }),
                // },
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
