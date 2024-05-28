import { gql } from '@apollo/client';

export const UPSERT_EXCEPTION_DATES = gql`
  mutation upsertExceptionDates($data: ExceptionDateInput!) {
    upsertExceptionDates(data: $data) {
      id
      date
      from
      to
    }
  }
`;
