import { gql } from '@apollo/client';

export const REVIEW_TAGS_BY_TYPE = gql`
  query reviewTagsByType($type: LessonReviewTagType!) {
    reviewTagsByType(type: $type) {
      id
      type
      title
    }
  }
`;
