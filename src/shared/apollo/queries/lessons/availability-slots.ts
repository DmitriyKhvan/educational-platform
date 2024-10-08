import { gql } from '@apollo/client';

export const AVAILABILITY_SLOTS = gql`
  query availabilitySlots($mentorId: ID!, $timezone: String!, $rangeStart: String!, $rangeEnd: String!, $duration: Int!) {
    availabilitySlots(
    mentorId: $mentorId
    timezone: $timezone
    rangeStart: $rangeStart
    rangeEnd: $rangeEnd
    duration: $duration
  ) {
    date
    timeSlots {
      date
      from
      to
    }
  }
  }
`;
