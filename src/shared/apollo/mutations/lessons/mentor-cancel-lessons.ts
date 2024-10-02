import { gql } from '@apollo/client';

export const MENTOR_CANCEL_APPOINTMENT = gql`
  mutation MENTOR_CANCEL_LESSON(
    $id: ID!
    $cancelReason: String
    $studentMessage: String
    $repeat: Boolean
    $isTrial: Boolean
  ) {
    mentorCancelLessons(
      id: $id
      cancelReason: $cancelReason
      studentMessage: $studentMessage
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
