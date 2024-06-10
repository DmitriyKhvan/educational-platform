import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation createPayment(
    $studentId: ID!
    $packageId: ID!
    $currency: Currency!
    $provider: PaymentProviderType
    $metadata: String
  ) {
    createPayment(
      studentId: $studentId
      packageId: $packageId
      provider: $provider
      metadata: $metadata
      currency: $currency
    ) {
      id
      status
      provider
      cancelReason
      metadata
    }
  }
`;
