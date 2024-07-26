import { gql } from "@apollo/client";

export const MENTORS = gql`
  query mentors($studentId: ID) {
    mentors(visibilityStatus: public, studentId: $studentId) {
      id
      firstName
      lastName
      fullName
      acceptingStudents
      gender
      avatar {
        id
        url
      }
      major
      language
      university
      graduatingYear
      degree
      introduction
      about
      experience
      relevantExperience
      isActive
      hourlyRate
      facts
      uniqueFacts
      videoUrl
      user {
        id
        email
        phoneNumber
        address
        timeZone
        country
        role
        referalCode
        referalId
        isActive
        createdAt
        updatedAt
      }
      lessons {
        id
        startAt
        duration
        status
        cancelAction
      }
      avatarId
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
      sortOrder
    }
  }
`;
