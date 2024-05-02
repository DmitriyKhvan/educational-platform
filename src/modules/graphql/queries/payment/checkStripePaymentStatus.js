import { gql } from '@apollo/client';

export const CHECK_STRIPE_PAYMENT_STATUS = gql`
  query checkStripePaymentStatus($paymentIntentId: String!) {
    checkStripePaymentStatus(paymentIntentId: $paymentIntentId)
  }
`;
