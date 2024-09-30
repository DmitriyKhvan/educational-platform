import { gql } from '@apollo/client';

export const GET_HOMEWORK = gql`
  query homework($topicId: ID) {
    homework(topicId: $topicId) {
      id
      title
      description
    }
  }
`;
