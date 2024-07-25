import { gql } from '@apollo/client';

export const UPDATE_MATCHING_PROFILE = gql`
  mutation updateMatchingProfile(
    $id: ID!
    $interests: [ID!]
    $teachingStyles: [ID!]
    $availabilities: [ID!]
    $energy: MentorEnergy!
    $specializations: [ID!]
    $certifications: [ID!]
  ) {
    updateMatchingProfile(
      id: $id
      interests: $interests
      teachingStyles: $teachingStyles
      availabilities: $availabilities
      energy: $energy
      specializations: $specializations
      certifications: $certifications
    ) {
      id
    }
  }
`;
