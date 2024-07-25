import { gql } from '@apollo/client';

export const MATCHING_PROFILE = gql`
  query matchingProfile {
    matchingProfile {
      id
      interests {
        id
        interest
        icon
        translations {
          title
          language
        }
      }
      teachingStyles {
        id
        teachingStyle
        translations {
          title
        }
      }
      availabilities {
        id
        day
        from
        to
      }
      certifications {
        id
        certification
        shareLink
        issuedAt
      }
      energy
      gender
    }
  }
`;
