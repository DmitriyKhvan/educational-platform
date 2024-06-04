import { gql } from '@apollo/client';

export const CREATE_PAYMENT_INTENT = gql`
  mutation createPaymentIntent(
    $packageId: Int!
    $currency: Currency
    $applyPersonalDiscountCode: Boolean
  ) {
    createPaymentIntent(
      packageId: $packageId
      currency: $currency
      applyPersonalDiscountCode: $applyPersonalDiscountCode
    ) {
      clientSecret
    }
  }
`;
