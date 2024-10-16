import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation createPayment(
    $studentId: ID!
    $packageId: ID!
    $provider: PaymentProviderType
    $metadata: String
    $lang: String!
  ) {
    createPayment(
      studentId: $studentId
      packageId: $packageId
      provider: $provider
      metadata: $metadata
      lang: $lang
    ) {
      id
      status
      provider
      cancelReason
      metadata
    }
  }
`;
