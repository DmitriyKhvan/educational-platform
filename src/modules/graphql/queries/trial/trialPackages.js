import { gql } from '@apollo/client';

export const TRIAL_PACKAGES = gql`
  query trialPackages {
    trialPackages {
      id
      totalSessions
      sessionsPerWeek
      sessionTime
      price
      period
      discount
      courseId
      course {
        id
        title
        description
      }
    }
  }
`;
