import { gql } from "@apollo/client";

export const REVIEW_TAGS_BY_TYPE = gql`
  query studentReviewTagsByType($type: StudentReviewTagType!) {
    studentReviewTagsByType(type: $type) {
      id
      type
      title
      translations {
        id
        title
        language
      }
    }
  }
`;
