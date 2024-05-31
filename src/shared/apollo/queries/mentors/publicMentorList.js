import { gql } from '@apollo/client';

export const PUBLIC_MENTOR_LIST = gql`
  query publicMentorList {
    publicMentorList {
      id
      firstName
      lastName
    }
  }
`;
