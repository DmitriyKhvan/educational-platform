import { gql } from '@apollo/client';

export const CREATE_MATCHING_PROFILE_FOR_MENTOR = gql`
  mutation createMatchingProfileForMentor(
    $mentorId: ID!
    $interests: [ID!]!
    $teachingStyles: [ID!]!
    $energy: MentorEnergy!
  ) {
    createMatchingProfileForMentor(
      mentorId: $mentorId
      interests: $interests
      teachingStyles: $teachingStyles
      energy: $energy
    ) {
      id
    }
  }
`;
