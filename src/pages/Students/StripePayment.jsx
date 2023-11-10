import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaymentLayout } from 'src/layouts/PaymentLayout';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const params = useParams();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);

  const [t] = useTranslation('purchase');

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(() => true);

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'always',
      confirmParams: {
        return_url: `${window.location.origin}/purchase/${params.packageId}/complete`,
      },
    });
    if (error) {
      setErrorMessage(error.message);
      setLoading(() => false);
      return;
    }

    setLoading(() => false);
  };

  return (
    <PaymentLayout>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <p className="text-red-500 mt-2">
          {errorMessage && <div>*{errorMessage}</div>}
        </p>
        <button
          disabled={isLoading}
          className="py-2 px-3 rounded text-white mt-4 bg-purple-500 disabled:bg-gray-300"
        >
          {t('pay')}
        </button>
      </form>
    </PaymentLayout>
  );
};

export default function StripePayment() {
  const clientSecret = useParams().clientSecret;

  const options = {
    clientSecret: clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
