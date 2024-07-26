import { gql } from "@apollo/client";

export const GET_VOCABULARY = gql`
  query vocabulary($topicId: ID) {
    vocabulary(topicId: $topicId) {
      id
      word
    }
  }
`;
