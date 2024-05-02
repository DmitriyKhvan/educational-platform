import { gql } from '@apollo/client';

export const COURSES = gql`
  query courses($trialFilter: GeneralTrialFilterType) {
    courses(trialFilter: $trialFilter) {
      id
      title
      description
      active
      sequence
      packages {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        courseId
      }
      translations {
        id
        title
        description
        language
      }
    }
  }
`;
