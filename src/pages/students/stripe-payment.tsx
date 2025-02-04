import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import Loader from '@/components/loader/loader';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type StripeError } from '@stripe/stripe-js';
import { type FormEvent, type FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY ?? '');

const CheckoutForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const params = useParams();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);

  const [t] = useTranslation('purchase');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent,
  ): Promise<FormEventHandler<HTMLFormElement> | undefined> => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error }: { error: StripeError } = await stripe.confirmPayment({
      elements,
      redirect: 'always',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            phone: user?.phoneNumber ?? '',
          },
        },
        return_url: `${window.location.origin}/purchase/${params.packageId}/complete`,
      },
    });
    if (error) {
      setErrorMessage(error?.message ?? '');
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
      {/* <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#F7F8FA] -z-10"></div> */}

      <div className="flex min-h-[calc(100dvh-60px)] sm:min-h-[calc(100dvh-97px)] bg-[#F7F8FA] p-5 -mx-5 sm:-mx-20 -my-6 sm:-my-8 lg:-my-10">
        <form
          className="w-full sm:w-[480px] p-4 sm:p-8 m-auto rounded-xl bg-white"
          onSubmit={handleSubmit}
        >
          <PaymentElement />
          <p className="text-red-500 mt-2">{errorMessage && <div>*{errorMessage}</div>}</p>
          <Button type="submit" disabled={isLoading} className="w-full h-auto mt-8 p-5">
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
