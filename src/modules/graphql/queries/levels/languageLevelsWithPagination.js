import { gql } from '@apollo/client';

export const LANGUAGE_LEVELS_WITH_PAGINATION = gql`
  query ($search: String, $page: Int, $limit: Int) {
    languageLevelsWithPagination(search: $search, page: $page, limit: $limit) {
      languageLevels {
        id
        title
        isActive
        sortOrder
        description
        # topics
        # courses
        translations {
          id
          title
          language
        }
        createdAt
        updatedAt
      }
      count
    }
  }
`;
