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
import { getItemToLocalStorage } from 'src/constants/global';
import { useMutation } from '@apollo/client';
import { useAuth } from '../../modules/auth';
import { CREATE_PAYMENT } from '../ConfirmPayment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const params = useParams();
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const [t] = useTranslation('purchase');

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(() => true);

    if (!stripe || !elements) {
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/purchase/${params.packageId}/complete`,
      },
    });
    if (confirmError) {
      setErrorMessage(confirmError.message);
      setLoading(() => false);
      return;
    }

    const { paymentIntent, error: paymentIntentError } =
      await stripe.retrievePaymentIntent(params.clientSecret);
    if (paymentIntentError) {
      setErrorMessage(paymentIntentError.message);
      setLoading(() => false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await createPayment({
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
        });

        history.push(
          `/purchase/${params.packageId}/complete?payment_intent_client_secret=${params.clientSecret}`,
        );
      } catch (error) {
        setErrorMessage('Server error. Please try again later.');
      }
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
        {/* Show error message to your customers */}
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
