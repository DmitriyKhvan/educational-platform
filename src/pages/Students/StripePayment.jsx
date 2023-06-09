import React from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export default function StripePayment() {
  const clientSecret = useParams().clientSecret;

  const options = {
    clientSecret: clientSecret,
    // appearance: {},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <form>
        <PaymentElement />
        <button>Submit</button>
      </form>
    </Elements>
  );
}
