import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../components/Loader/Loader';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function ConfirmPayment() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    stripePromise.then(async (stripe) => {
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret,
      );

      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Success! Payment received.');
          break;

        case 'processing':
          setMessage(
            "Payment processing. We'll update you when payment is received.",
          );

          break;

        case 'requires_payment_method':
          setMessage('Payment failed. Please try another payment method.');
          setError(true);
          break;

        default:
          setMessage('Something went wrong.');
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
            Go to Dashboard
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
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
