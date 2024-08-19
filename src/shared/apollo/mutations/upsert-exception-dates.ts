import { gql } from '@apollo/client';

export const UPSERT_EXCEPTION_DATES = gql`
  mutation upsertExceptionDates($mentorId: ID!, $exceptionDates: [ExceptionDateSlot!]!) {
    upsertExceptionDates(mentorId: $mentorId, exceptionDates: $exceptionDates) {
      id
      date
      from
      to
    }
  }
`;
