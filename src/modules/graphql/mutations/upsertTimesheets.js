import { gql } from '@apollo/client';

export const UPSERT_TIMESHEETS = gql`
  mutation upsertTimesheets($data: TimesheetInput!) {
    upsertTimesheets(data: $data) {
      id
      day
      from
      to
    }
  }
`;
