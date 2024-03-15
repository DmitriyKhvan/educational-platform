import { gql } from '@apollo/client';

export const COURSES = gql`
  query courses {
    courses {
      id
      title
      description
      active
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
