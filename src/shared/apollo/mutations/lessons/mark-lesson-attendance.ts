import { gql } from '@apollo/client';

export const MARK_LESSON_ATTENDANCE = gql`
  mutation MARK_LESSON_ATTENDANCE($lessonId: ID!) {
    markLessonAttendance(lessonId: $lessonId) {
      id
      startAt
      duration
      status
      cancelAction
      cancelReason
      canceledBy
      canceledAt
      noShow
    }
  }
`;
