import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation createStudentReview(
    $lessonId: ID!
    $studentId: ID!
    $rating: Int!
    $tags: [ID!]
  ) {
    createStudentReview(
      lessonId: $lessonId
      studentId: $studentId
      rating: $rating
      tags: $tags
    ) {
      id
    }
  }
`;
