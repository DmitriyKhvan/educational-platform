import { gql } from '@apollo/client';

export const CANCEL_APPOINTMENT = gql`
  mutation CANCEL_LESSON(
    $id: ID!
    $cancelReason: String
    $repeat: Boolean
    $isTrial: Boolean
  ) {
    cancelLessons(
      id: $id
      cancelReason: $cancelReason
      repeat: $repeat
      isTrial: $isTrial
    ) {
      id
      startAt
      duration
      status
      cancelAction
    }
  }
`;
