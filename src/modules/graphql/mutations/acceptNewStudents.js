import { gql } from '@apollo/client';

export const ACCEPT_NEW_STUDENTS = gql`
  mutation acceptNewStudents($mentorId: String!, $accept: Boolean!) {
    acceptNewStudents(mentorId: $mentorId, accept: $accept)
  }
`;
