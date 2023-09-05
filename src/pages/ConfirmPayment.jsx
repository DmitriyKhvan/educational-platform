import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../components/Loader/Loader';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function ConfirmPayment() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );

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
    if (clientSecret)
      stripePromise.then(async (stripe) => {
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret,
        );

        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage(t('payment_success'));
            break;

          case 'processing':
            setMessage(t('payment_processing'));
            break;

          case 'requires_payment_method':
            setMessage(t('payment_failed'));
            setError(true);
            break;

          default:
            setMessage(t('payment_error'));
            setError(true);
            break;
        }
      });
  }, [clientSecret]);

  if (!message) return <Loader />;

  if (error)
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="space-y-8 flex flex-col items-center">
          <FontAwesomeIcon
            icon={faXmarkCircle}
            className="w-16 h-16 text-red-500"
          />
          <h1 className="font-bold">{message}</h1>
          <a
            href="/dashboard"
            className="text-white bg-purple-500 px-4 py-2 rounded font-bold"
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
        <h1 className="font-bold">{message}</h1>
        <a
          href="/dashboard"
          className="text-white bg-purple-500 px-4 py-2 rounded font-bold"
        >
          {t('dashboard')}
        </a>
      </div>
    </main>
  );
}
