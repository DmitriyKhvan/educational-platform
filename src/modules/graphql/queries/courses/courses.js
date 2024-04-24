import { gql } from '@apollo/client';

export const COURSES = gql`
  query courses {
    courses(trialFilter: only_regular) {
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

export const COURSES_TRANSLATIONS = gql`
  query courses {
    courses {
      id
      title
      translations {
        id
        title
        description
        language
      }
    }
  }
`;
