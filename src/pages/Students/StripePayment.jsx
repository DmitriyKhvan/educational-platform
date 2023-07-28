import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useHistory } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../modules/auth';

const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $userId: Int!
    $packageId: Int!
    $provider: String
    $metadata: JSON
  ) {
    createPayment(
      userId: $userId
      packageId: $packageId
      provider: $provider
      metadata: $metadata
    ) {
      payment {
        id
        status
        provider
        cancelReason
        metadata
      }
    }
  }
`;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    const { paymentIntent } = await stripe.retrievePaymentIntent(
      params.clientSecret,
    );

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      await createPayment({
        variables: {
          userId: parseInt(user.id),
          packageId: parseInt(params.packageId),
          provider: 'stripe',
          metadata: JSON.stringify(paymentIntent),
        },
      });

      history.push(
        `/purchase/${params.packageId}/complete?payment_intent_client_secret=${params.clientSecret}`,
      );
    }

    setLoading(false);
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
          disabled={!stripe && isLoading}
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
