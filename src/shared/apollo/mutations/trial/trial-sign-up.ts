import { gql } from "@apollo/client";

export const TRIAL_SIGN_UP = gql`
  mutation trialSignUp($data: TrialSignUpInput!) {
    trialSignUp(data: $data) {
      id
      email
      phoneNumber
      address
      timeZone
      country
      referalCode
      referalId
      students {
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
        # user
        # lessons
        avatarId
        # avatar
      }
      mentor {
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
        # avatar
        # availabilities
        playgroundId
      }
      packageSubscriptions {
        id
        periodStart
        periodEnd
        credits
        modifyCredits
        packageId
        # package
        paymentId
        # payment
        # lessons
        active
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
        # lessons
        active
      }
      isActive
      role
      cardLast4
      createdAt
      updatedAt
    }
  }
`;
