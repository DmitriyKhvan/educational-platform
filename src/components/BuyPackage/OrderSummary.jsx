import { useMemo, memo } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { currencyFormat } from 'src/utils/currencyFormat';
import { calculatePriceWithDiscount } from 'src/utils/calculatePriceWithDiscount';

import { PromoModal } from './PromoModal';
import { TermsConditionsModal } from './TermsConditionsModal';
import Button from '../Form/Button';
import { RiErrorWarningFill } from 'react-icons/ri';
import { BsPlus } from 'react-icons/bs';
import notify from 'src/utils/notify';
import Loader from '../Loader/Loader';
import { useMediaQuery } from 'react-responsive';
import { MyDrawer } from 'src/components/Drawer';
import { MyDialog } from 'src/components/Dialog';

const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($id: Int!) {
    createPaymentIntent(packageId: $id) {
      clientSecret
    }
  }
`;

export const OrderSummary = memo(function OrderSummary({
  selectedPackage,
  setPromoPackage,
  promoPackage,
}) {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const history = useHistory();
  const [parent] = useAutoAnimate();
  const [t] = useTranslation('purchase');

  const discount = useMemo(() => {
    if (promoPackage) {
      return (
        calculatePriceWithDiscount(selectedPackage) -
        calculatePriceWithDiscount(promoPackage)
      );
    }
  }, [promoPackage]);

  const [getSecret, { loading }] = useMutation(CREATE_PAYMENT_INTENT);

  const submitStripe = () => {
    if (selectedPackage) {
      getSecret({
        variables: {
          id: parseInt(selectedPackage.id),
        },
        onCompleted: (data) => {
          const { clientSecret } = data.createPaymentIntent;
          if (clientSecret) {
            history.push(
              `/purchase/${selectedPackage.id}/payment/${clientSecret}`,
            );
          }
        },
        onError: (error) => {
          notify(error.message);
        },
      });
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}
      <div
        className="w-full p-6 rounded-lg bg-[#F7F8FA] space-y-6"
        ref={parent}
      >
        <h3 className="text-2xl font-bold">{t('order_summary')}</h3>

        {selectedPackage && (
          <>
            {isMobile ? (
              <MyDrawer
                button={
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-color-purple/10">
                      <BsPlus className="text-color-purple" />
                    </span>
                    <span className="text-[13px] font-medium text-color-purple">
                      {t('add_promo')}
                    </span>
                  </button>
                }
              >
                <PromoModal
                  selectedPackage={selectedPackage}
                  setPromoPackage={setPromoPackage}
                />
              </MyDrawer>
            ) : (
              <MyDialog
                button={
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-color-purple/10">
                      <BsPlus className="text-color-purple" />
                    </span>
                    <span className="text-[13px] font-medium text-color-purple">
                      {t('add_promo')}
                    </span>
                  </button>
                }
              >
                <PromoModal
                  selectedPackage={selectedPackage}
                  setPromoPackage={setPromoPackage}
                />
              </MyDialog>
            )}

            <div className="space-y-3" ref={parent}>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {`${selectedPackage.period} ${t('months', {
                    count: selectedPackage.period,
                  })}`}
                </span>
                <span className="font-semibold">
                  {currencyFormat({
                    number: calculatePriceWithDiscount(selectedPackage),
                  })}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span>{t('promo_code')}</span>
                  <span className="font-semibold text-color-purple">
                    {`- ${currencyFormat({
                      number: discount,
                    })}`}
                  </span>
                </div>
              )}

              <div className="divider"></div>

              <div className="flex items-center justify-between font-bold text-base">
                <span>{t('total')}</span>
                <span>
                  {currencyFormat({
                    number: calculatePriceWithDiscount(promoPackage),
                  })}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-4 w-full bg-[#EAECF0] rounded-md px-4 py-3">
          <RiErrorWarningFill className="w-5 h-5 text-[#908E97]" />
          <div className="text-[#908E97] space-y-1">
            <p>{t('installments_text')}</p>
          </div>
        </div>

        {isMobile ? (
          <MyDrawer
            button={
              <Button
                disabled={!selectedPackage}
                className="w-full h-auto py-5 px-10"
              >
                {t('proceed_payment')}
              </Button>
            }
          >
            <TermsConditionsModal submitStripe={submitStripe} />
          </MyDrawer>
        ) : (
          <MyDialog
            button={
              <Button
                disabled={!selectedPackage}
                className="w-full h-auto py-5 px-10"
              >
                {t('proceed_payment')}
              </Button>
            }
          >
            <TermsConditionsModal submitStripe={submitStripe} />
          </MyDialog>
        )}
      </div>
    </>
  );
});
