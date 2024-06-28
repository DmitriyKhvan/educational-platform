import { gql } from '@apollo/client';

export const CREATE_MATCHING_PROFILE_FOR_MENTOR = gql`
  mutation createMatchingProfileForMentor(
    $mentorId: ID!
    $interests: [ID!]!
    $teachingStyles: [ID!]!
    $availabilities: [ID!]!
    $energy: MentorEnergy!
    $gender: GenderType!
  ) {
    createMatchingProfileForMentor(
      mentorId: $mentorId
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
