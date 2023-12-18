import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import Loader from '../components/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { getItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import { useMutation, useQuery, gql } from '@apollo/client';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
// eslint-disable-next-line import/no-unresolved
import { MarketingChannelForm } from 'src/components/onboarding/MarketingChannel';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CHECK_STRIPE_PAYMENT = gql`
  query checkStripePaymentStatus($paymentIntentId: String!) {
    checkStripePaymentStatus(paymentIntentId: $paymentIntentId)
  }
`;

const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $studentId: ID!
    $packageId: ID!
    $provider: PaymentProviderType
    $metadata: String
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

export default function ConfirmPayment() {
  const { user } = useAuth();
  const params = useParams();
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );
  const paymentIntentId = new URLSearchParams(window.location.search).get(
    'payment_intent',
  );
  const { data } = useQuery(CHECK_STRIPE_PAYMENT, {
    variables: { paymentIntentId: paymentIntentId },
  });

  const isNiceSuccess = new URLSearchParams(window.location.search).get(
    'success',
  );

  const [t] = useTranslation('purchase');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNiceSuccess) {
      setMessage('payment_success');
    }
  }, [isNiceSuccess]);

  useEffect(() => {
    if (!clientSecret || !data) {
      return;
    }
    const { checkStripePaymentStatus: alreadyPaid } = data;
    stripePromise.then((stripe) => {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(async ({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case 'succeeded': {
              if (alreadyPaid) {
                setMessage('already_paid');
                return;
              }

              createPayment({
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
              }).then(() => {
                setMessage('payment_success');
              });

              break;
            }

            case 'processing':
              setMessage('payment_processing');
              break;

            case 'requires_payment_method':
              setMessage('payment_fail');
              setError(true);
              break;

            default:
              setMessage('payment_error');
              setError(true);
              break;
          }
        });
    });
  }, [clientSecret, data]);

  if (!message) return <Loader height="100vh" />;

  return (
    <OnboardingLayout>
      <div className="px-5 sm:px-20 py-6 sm:py-8">
        {error ? (
          <div className="max-w-[440px] m-auto space-y-8 flex flex-col items-center">
            <FaCircleXmark className="w-16 h-16 text-red-500" />
            <h1 className="font-bold text-2xl sm:text-3xl text-center">
              {t(message)}
            </h1>

            <Link className="w-full" to="/student/manage-lessons">
              <Button className="w-full h-auto p-5">{t('dashboard')}</Button>
            </Link>
          </div>
        ) : (
          <div className="w-full sm:w-[480px] m-auto rounded-lg sm:p-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <FaCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
              <h1 className="font-bold text-2xl sm:text-[32px]">
                {/* Payment confirmed */}
                {t(message)}
              </h1>
            </div>

            <MarketingChannelForm />
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
