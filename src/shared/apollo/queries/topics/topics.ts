import { gql } from "@apollo/client";

export const GET_TOPICS = gql`
  query {
    topics {
      id
      title
      isActive
      sortOrder
      description
      languageLevels {
        id
        title
        isActive
        sortOrder
        description
        createdAt
        updatedAt
      }
      translations {
        id
        title
        description
        language
      }
      createdAt
      updatedAt
    }
  }
`;
