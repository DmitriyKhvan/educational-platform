import { gql } from '@apollo/client';

export const FIND_MATCHES = gql`
  query findMatches($matchingProfileId: ID!) {
    findMatches(matchingProfileId: $matchingProfileId) {
      id
      firstName
      lastName
      gender
      major
      university
      degree
      introduction
      about
      relevantExperience
      isActive
      hourlyRate
      uniqueFacts
      fullName
      userId

      videoUrl
      avatarId
      visibilityStatus
      avatar {
        id
        name
        mimetype
        url
        path
        width
        height
        createdAt
        updatedAt
      }
      availabilities {
        regular {
          id
          day
          from
          to
        }
        trial {
          id
          day
          from
          to
        }
      }
      playgroundId
      acceptingStudents
      sortOrder
      mentorAvailability
      certifications {
        id
        certification
        shareLink
        issuedAt
      }
      matchingProfile {
        id
        interests {
          icon
          interest
          translations {
            title
            language
          }
        }
        teachingStyles {
          teachingStyle
          translations {
            title
            language
          }
        }
        #       availabilities
        certifications {
          certification
        }
        energy
      }
    }
  }
`;
