import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from 'src/modules/auth/graphql';
import { CREATE_PAYMENT } from 'src/modules/graphql/mutations/payment/createPayment';
import { CHECK_STRIPE_PAYMENT_STATUS } from 'src/modules/graphql/queries/payment/checkStripePaymentStatus';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';

import { useAuth } from 'src/modules/auth';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import { MarketingChannelForm } from 'src/components/onboarding/MarketingChannel';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';
import { getItemToLocalStorage } from 'src/constants/global';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function ConfirmPayment() {
  const { user, currentStudent } = useAuth();

  const studentId = getItemToLocalStorage('studentId')
    ? getItemToLocalStorage('studentId')
    : currentStudent?.id ?? user.students[0].id;

  const { data: { packageSubscriptions: planStatus = [] } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      fetchPolicy: 'no-cache',
      variables: {
        studentId,
      },
    },
  );

  const params = useParams();
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );
  const paymentIntentId = new URLSearchParams(window.location.search).get(
    'payment_intent',
  );
  const { data } = useQuery(CHECK_STRIPE_PAYMENT_STATUS, {
    variables: { paymentIntentId: paymentIntentId },
  });

  const isNiceSuccess = new URLSearchParams(window.location.search).get(
    'success',
  );

  const [t] = useTranslation(['purchase', 'onboarding']);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const checkPayment = async () => {
    const { checkStripePaymentStatus: alreadyPaid } = data;

    try {
      const stripe = await stripePromise;

      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret,
      );

      switch (paymentIntent.status) {
        case 'succeeded': {
          if (alreadyPaid) {
            setMessage('already_paid');
            return;
          }

          await createPayment({
            variables: {
              studentId,
              packageId: parseInt(params.packageId),
              provider: 'stripe',
              metadata: JSON.stringify(paymentIntent),
            },
          });

          setMessage('payment_confirmed');
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
    } catch (error) {
      setMessage(error.message);
      setError(true);
    }
  };

  useEffect(() => {
    if (isNiceSuccess) {
      setMessage('payment_confirmed');
    }
  }, [isNiceSuccess]);

  useEffect(() => {
    if (clientSecret && data) {
      checkPayment();
    }
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
                {t(message)}
              </h1>
            </div>

            {planStatus.length ? (
              // href for authenticatedUser to work
              <a
                className="w-full mt-28 block"
                href={`${window.location.origin}/student/manage-lessons`}
              >
                <Button className="w-full h-auto p-5">{t('dashboard')}</Button>
              </a>
            ) : (
              <MarketingChannelForm />
            )}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
