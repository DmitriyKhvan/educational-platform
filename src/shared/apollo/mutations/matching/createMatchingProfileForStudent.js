import { gql } from '@apollo/client';

export const CREATE_MATCHING_PROFILE_FOR_STUDENT = gql`
  mutation createMatchingProfileForStudent(
    $studentId: ID!
    $interests: [ID!]!
    $teachingStyles: [ID!]!
    $availabilities: [ID!]!
    $energy: MentorEnergy!
    $gender: GenderType!
  ) {
    createMatchingProfileForStudent(
      studentId: $studentId
      interests: $interests
      teachingStyles: $teachingStyles
      availabilities: $availabilities
      energy: $energy
      gender: $gender
    ) {
      id
    }
  }
`;
