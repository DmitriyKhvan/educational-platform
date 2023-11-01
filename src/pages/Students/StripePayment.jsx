import { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../modules/auth';
import { useTranslation } from 'react-i18next';
import { getItemToLocalStorage } from 'src/constants/global';
import { PaymentLayout } from 'src/layouts/PaymentLayout';

const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $studentId: ID!
    $packageId: ID!
    $provider: PaymentProviderType
    $metadata: JSON
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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutForm = () => {
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const history = useHistory();
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
      redirect: 'if_required',
    });

    const { paymentIntent } = await stripe.retrievePaymentIntent(
      params.clientSecret,
    );

    if (error) {
      setErrorMessage(error.message);
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
