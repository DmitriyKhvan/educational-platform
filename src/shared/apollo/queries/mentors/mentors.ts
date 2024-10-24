import { gql } from '@apollo/client';

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
      university
      degree
      introduction
      about
      relevantExperience
      isActive
      hourlyRate
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
        id
        day
        from
        to
        isTrial
      }
      sortOrder
    }
  }
`;
