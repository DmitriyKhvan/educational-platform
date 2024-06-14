import { gql } from '@apollo/client';

export const COMBINED_TIMESHEETS_TRIAL = gql`
  query combinedTimesheetsForTrials(
    $tz: String!
    $date: String!
    $mentorId: ID
  ) {
    combinedTimesheetsForTrials(tz: $tz, date: $date, mentorId: $mentorId) {
      id
      day
      from
      to
      reserved
      mentors
    }
  }
`;
