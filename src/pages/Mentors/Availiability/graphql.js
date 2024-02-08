import { gql } from '@apollo/client';

export const UPSERT_AVAILIABILITY = gql`
  mutation ($data: TimesheetInput!) {
    upsertTimesheets(data: $data) {
      id
      day
      from
      to
    }
  }
`;
