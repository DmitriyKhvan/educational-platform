import { gql } from '@apollo/client';

export const CREATE_REVIEW = gql`
  mutation createReview(
    $lessonId: ID!
    $studentId: ID!
    $rating: Int!
    $tags: [ID!]
  ) {
    createReview(
      lessonId: $lessonId
      studentId: $studentId
      rating: $rating
      tags: $tags
    ) {
      id
    }
  }
`;
