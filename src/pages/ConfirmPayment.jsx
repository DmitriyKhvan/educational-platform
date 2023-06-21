import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../components/Loader/Loader';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function ConfirmPayment() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stripe = stripePromise;
    stripe.then((res) => {
      res.confirmCardPayment(clientSecret).then((result) => {
        if (result.error) {
          setMessage(result.error.message);
          setError(true);
        } else {
          setMessage('Your payment was successfull!');
        }
      });
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
