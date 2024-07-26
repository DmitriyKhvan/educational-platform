import { gql } from "@apollo/client";

export const ATTACH_TRIAL_STUDENT_TO_USER_RESOLVER = gql`
  mutation attachTrialStudentToUserResolver($data: AttachTrialStudentInput!) {
    attachTrialStudentToUserResolver(data: $data) {
      id
      firstName
      lastName
      gender
      parentName
      level
      langLevel
      birthday
      about
      pronouns
      isActive
      user {
        id
        email
        phoneNumber
        address
        timeZone
        country
        referalCode
        referalId
        # students
        # mentor
        # packageSubscriptions
        # activeSubscriptions
        # conversations
        # notifications
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
        canceledAt
        # mentor
        # student
        # packageSubscription
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
      activeSubscriptions {
        id
        periodStart
        periodEnd
        credits
        modifyCredits
        packageId
        # package
        paymentId
        # payment
        # promotionCodeStudentUsage
        # lessons
        # student
        active
      }
    }
  }
`;
