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
import { useAuth } from 'src/modules/auth';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const params = useParams();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);

  const [t] = useTranslation('purchase');

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'always',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone ?? '',
          },
        },
        return_url: `${window.location.origin}/purchase/${params.packageId}/complete`,
      },
    });
    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}
      <div className="min-w-full min-h-full px-5 sm:px-20 py-6 sm:py-8 bg-[#F7F8FA]">
        <form
          className="w-full sm:w-[480px] m-auto p-8 rounded-xl bg-white"
          onSubmit={handleSubmit}
        >
          <PaymentElement />
          <p className="text-red-500 mt-2">
            {errorMessage && <div>*{errorMessage}</div>}
          </p>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-auto mt-8 p-5"
          >
            {t('pay')}
          </Button>
        </form>
      </div>
    </>
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
