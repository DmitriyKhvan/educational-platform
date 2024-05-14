import { gql } from '@apollo/client';

export const LANGUAGE_LEVELS = gql`
  query languageLevels {
    languageLevels {
      id
      title
      description
      topics {
        id
        title
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
