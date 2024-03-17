import { gql } from '@apollo/client';

export const COMBINED_TIMESHEETS_TRIAL = gql`
  query combinedTimesheetsForTrials($tz: String!, $date: String!) {
    combinedTimesheetsForTrials(tz: $tz, date: $date) {
      id
      day
      from
      to
      reserved
      mentors
    }
  }
`;
