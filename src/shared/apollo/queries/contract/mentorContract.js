import { gql } from '@apollo/client';

export const MENTOR_CONTRACT = gql`
  query mentorContract {
    mentorContract {
      id
      startDate
      endDate
      isActive
      strikes
      penalties {
        id
        amount
        noShow
        reason
        createdAt
      }
      strikesWithLessons {
        id
        amount
        noShow
        reason
        createdAt
        lesson {
          id
          startAt
        }
      }
    }
  }
`;
