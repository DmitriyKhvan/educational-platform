import { gql } from '@apollo/client';

export const ACCEPT_NEW_STUDENTS = gql`
  mutation acceptNewStudents(mentorId: string, accept: boolean) {
    acceptNewStudents(mentorId: $mentorId, accept: $accept)
  }
`;
