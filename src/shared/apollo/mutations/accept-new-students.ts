import { gql } from "@apollo/client";

export const ACCEPT_NEW_STUDENTS = gql`
  mutation acceptNewStudents($mentorId: ID!, $accept: Boolean!) {
    acceptNewStudents(mentorId: $mentorId, accept: $accept)
  }
`;
