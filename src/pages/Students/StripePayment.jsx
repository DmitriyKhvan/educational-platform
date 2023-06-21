import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();

  console.log();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_URL}/purchase/${params.packageId}/complete`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="absolute top-0 left-0 p-4">
        <img src={Logo} alt="logo" className="w-24" />
      </div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <p className="text-red-500 mt-2">
          {errorMessage && <div>*{errorMessage}</div>}
        </p>
        <button
          disabled={!stripe}
          className="py-2 px-3 rounded text-white mt-4 bg-purple-500"
        >
          Continue
        </button>
        {/* Show error message to your customers */}
      </form>
    </main>
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
