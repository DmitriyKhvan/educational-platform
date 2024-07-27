import { gql } from '@apollo/client';

export const AVAILABLE_MENTORS = gql`
  query availableMentors($time: String!, $duration: Int!, $studentId: String!) {
    availableMentors(time: $time, duration: $duration, studentId: $studentId) {
      filterSlot {
        day
        from
        to
        # fromSeconds
        # toSeconds
      }
      mentors {
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
        # user
        # lessons
        videoUrl
        avatarId
        visibilityStatus
        avatar {
          id
          url
        }
        #availabilities {
        #  id
        #}
        playgroundId
      }
    }
  }
`;
