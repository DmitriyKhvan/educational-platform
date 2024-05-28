import { gql } from '@apollo/client';

export const COURSES = gql`
  query courses($trialFilter: GeneralTrialFilterType, $studentId: ID, $applyPersonalDiscountCode: Boolean) {
    courses(trialFilter: $trialFilter, studentId: $studentId, applyPersonalDiscountCode: $applyPersonalDiscountCode) {
      id
      title
      description
      active
      sequence
      packages {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        discountPrice
        promotionCode {
          id
          code
          value
          discountType
          isActive
          courseId
          period
          sessionsPerWeek
          sessionTime
          country
          createdAt
          updatedAt
        }
        courseId
      }
      translations {
        id
        title
        description
        language
      }
    }
  }
`;
