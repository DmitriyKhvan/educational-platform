import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation createPayment(
    $studentId: ID!
    $packageId: ID!
<<<<<<< HEAD
    #$currency: Currency!
=======
>>>>>>> dev
    $provider: PaymentProviderType
    $metadata: String
  ) {
    createPayment(
      studentId: $studentId
      packageId: $packageId
      provider: $provider
      metadata: $metadata
<<<<<<< HEAD
    ) #currency: $currency
    {
=======
    ) {
>>>>>>> dev
      id
      status
      provider
      cancelReason
      metadata
    }
  }
`;
