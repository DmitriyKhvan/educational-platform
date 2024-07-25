import { gql } from '@apollo/client';

export const CREATE_MATCHING_PROFILE_FOR_MENTOR = gql`
  mutation createMatchingProfileForMentor(
    $mentorId: ID!
    $interests: [ID!]!
    $teachingStyles: [ID!]!
    $specializations: [ID!]!
    $energy: MentorEnergy!
    $certifications: [ID!]!
  ) {
    createMatchingProfileForMentor(
      mentorId: $mentorId
      interests: $interests
      teachingStyles: $teachingStyles
      specializations: $specializations
      energy: $energy
      certifications: $certifications
    ) {
      id
    }
  }
`;
