import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../components/Loader/Loader';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { getItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import { useMutation, useQuery, gql } from '@apollo/client';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CHECK_STRIPE_PAYMENT = gql`
  query checkStripePaymentStatus($paymentIntentId: String!) {
    checkStripePaymentStatus(paymentIntentId: $paymentIntentId)
  }
`;

const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $studentId: ID!
    $packageId: ID!
    $provider: PaymentProviderType
    $metadata: String
  ) {
    createPayment(
      studentId: $studentId
      packageId: $packageId
      provider: $provider
      metadata: $metadata
    ) {
      id
      status
      provider
      cancelReason
      metadata
    }
  }
`;

export default function ConfirmPayment() {
  const { user } = useAuth();
  const params = useParams();
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );
  const paymentIntentId = new URLSearchParams(window.location.search).get(
    'payment_intent',
  );
  const { data } = useQuery(CHECK_STRIPE_PAYMENT, {
    variables: { paymentIntentId: paymentIntentId },
  });

  const isNiceSuccess = new URLSearchParams(window.location.search).get(
    'success',
  );

  const [t] = useTranslation('purchase');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNiceSuccess) {
      setMessage(t('payment_success'));
    }
  }, [isNiceSuccess]);

  useEffect(() => {
    if (!clientSecret || !data) {
      return;
    }
    const { checkStripePaymentStatus: alreadyPaid } = data;
    stripePromise.then((stripe) => {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(async ({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case 'succeeded': {
              if (alreadyPaid) {
                setMessage('You have already paid for this package.');
                return;
              }

              createPayment({
                variables: {
                  studentId: parseInt(
                    getItemToLocalStorage('studentId')
                      ? getItemToLocalStorage('studentId')
                      : user.students[0].id,
                  ),
                  packageId: parseInt(params.packageId),
                  provider: 'stripe',
                  metadata: JSON.stringify(paymentIntent),
                },
              }).then(() => {
                setMessage(t('payment_success'));
              });

              break;
            }

            case 'processing':
              setMessage(t('payment_processing'));
              break;

            case 'requires_payment_method':
              setMessage(t('payment_fail'));
              setError(true);
              break;

            default:
              setMessage(t('payment_error'));
              setError(true);
              break;
          }
        });
    });
  }, [clientSecret, data]);

  if (!message) return <Loader />;

  if (error)
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="space-y-8 flex flex-col items-center">
          <FontAwesomeIcon
            icon={faXmarkCircle}
            className="w-16 h-16 text-red-500"
          />
          <h1 className="font-bold text-xl sm:text-3xl">{message}</h1>
          <a
            href="/student/manage-lessons"
            className="text-white bg-color-purple px-4 py-2 rounded font-bold"
          >
            {t('dashboard')}
          </a>
        </div>
      </main>
    );

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="space-y-8 flex flex-col items-center">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="w-16 h-16 text-green-500"
        />
        <h1 className="font-bold text-xl sm:text-3xl">{message}</h1>
        <Link
          to={
            !getItemToLocalStorage('studentId') && user.students[0].id
              ? '/select-profile'
              : '/student/manage-lessons'
          }
          className="text-white bg-color-purple px-4 py-2 rounded font-bold"
        >
          {!getItemToLocalStorage('studentId') && user.students[0].id
            ? t('select_profile')
            : t('dashboard')}
        </Link>
      </div>
    </main>
  );
}
