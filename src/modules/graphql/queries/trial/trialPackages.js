import { gql } from '@apollo/client';

export const TRIAL_PACKAGES = gql`
  query trialPackages {
    trialPackages {
      id
      totalSessions
      sessionsPerWeek
      sessionTime
      period
      courseId
      course {
        id
        title
        description
        sequence
        active
        # packages
        translations {
          id
          title
          description
          language
        }
        languageLevels {
          id
          title
          description
          translations {
            id
            title
            description
            language
          }
          topics {
            id
            title
            description
            createdAt
            updatedAt
            translations {
              id
              title
              language
            }
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;
