import { gql } from '@apollo/client';

export const CREATE_MENTOR_REVIEW = gql`
  mutation createMentorReview($data: MentorReviewInput!) {
    createMentorReview(data: $data) {
      id
    }
  }
`;
