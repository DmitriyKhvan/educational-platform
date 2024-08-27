import { gql } from '@apollo/client';

export const MENTOR = gql`
  query MENTOR($id: ID!) {
    mentor(id: $id) {
      id
      firstName
      lastName
      gender
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
      fullName
      userId
      user {
        id
        email
        phoneNumber
        address
        timeZone
        country
        referalCode
        referalId
        isActive
        role
        cardLast4
        createdAt
        updatedAt
      }
      lessons {
        id
        startAt
        duration
        status
        cancelAction
        cancelReason
        canceledBy
      }
      videoUrl
      avatarId
      visibilityStatus
      avatar {
        id
        url
      }
      availabilities {
        id
        day
        from
        to
        isTrial
      }
      exceptionDates {
        id
        date
        from
        to
      }
      playgroundId
      mentorAvailability
    }
  }
`;
