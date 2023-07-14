import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  {
    authenticatedUser {
      id
      firstName
      lastName
      fullName
      role
      email
      gender
      address
      referalCode
      referalId
      isActive
      country
      timeZone
      phoneNumber
      koreanEquivalent
      students {
        id
        about
      }
      mentor {
        id
        introduction
        relevantExperience
        uniqueFacts
        degree
        isActive
        university
        graduatingYear
        degree
        major
      }
    }
  }
`;

export const GET_MENTOR = gql`
  query GET_MENTOR($id: Int!) {
    mentor(id: $id) {
      id
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
      user {
        id
        email
        firstName
        lastName
        fullName
        koreanEquivalent
        phoneNumber
        address
        gender
        timeZone
        country
        avatar
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
        cancelActionType
        zoomlinkId
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
    }
  }
`;

export const MENTORS_QUERY = gql`
  query mentors {
    # $skip: Int # $take: Int # $orderBy: [TutorOrderByInput!]! # # $where: TutorWhereInput!
    mentors(take: null, where: { user: { isActive: { equals: true } } }) {
      id
      user {
        id
        firstName
        lastName
        gender
        isActive
      }
      major
      language
      university
      acceptanceRate
      checked
      userName
      # videoUrl
      totalRequests
      graduatingYear
      degree
      certificates
      introduction
      relevantExperience
      uniqueFacts
      about
      isActive
      experience
      facts
      createdAt
      updatedAt
      # avatar {
      #   id
      #   filesize
      #   width
      #   height
      #   extension
      #   url
      # }
      # picture {
      #   id
      #   filesize
      #   width
      #   height
      #   extension
      #   url
      # }
    }
  }
`;

export const USERS_QUERY = gql`
  query users {
    users {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    authResult: signIn(email: $email, password: $password) {
      sessionToken
      user {
        id
      }
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation sendUserPasswordResetLink($email: String!) {
    sendUserPasswordResetLink(email: $email)
  }
`;

export const NEW_PASSWORD_MUTATION = gql`
  mutation redeemUserPasswordResetToken(
    $email: String!
    $token: String!
    $password: String!
  ) {
    resetResult: redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export const INVITE_SET_PASSWORD_MUTATION = gql`
  mutation redeemInvitePasswordSetToken(
    $email: String!
    $token: String!
    $password: String!
  ) {
    resetResult: redeemInvitePasswordSetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export const MUTATION_UPDATE_USER = gql`
  mutation updateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(id: $id, data: $data) {
      id
      firstName
    }
  }
`;

export const MUTATION_UPDATE_MENTOR = gql`
  mutation updateMentor($id: ID!, $data: MentorUpdateInput!) {
    updateMentor(id: $id, data: $data) {
      id
    }
  }
`;

export const MUTATION_UPDATE_STUDENT = gql`
  mutation updateStudent($id: ID!, $data: StudentUpdateInput!) {
    updateStudent(id: $id, data: $data) {
      id
    }
  }
`;

export const GROUPS_QUERY = gql`
  query groups {
    groups {
      id
      tutorId
      lessonId
      lessonType
      lessonTitle
      lessonDesc
      seatCount
      startAt
      duration
      completed
      cancelAction
      lessonTopic
      lastPartLesson
      zoomlinkId
    }
  }
`;

export const STUDENTS_QUERY = gql`
  query students($where: StudentWhereInput) {
    students(where: $where) {
      id
      userName
      parentId
      parentName
      level
      langLevel
      courseType
      payment
      birthday
      stripeCustomer
      about
      pronouns
      avatar {
        id
        filesize
        width
        height
        extension
        url
      }
      picture {
        id
        filesize
        width
        height
        extension
        url
      }
      user {
        id
        firstName
        lastName
        koreanEquivalent
        phoneNumber
        address
        gender
        timeZone
        country
        avatar
        emailVerificationToken
        resetPasswordExpires
        resetPasswordToken
        referalId
        referalConfirmed
        fullName
        role
        email
        isActive
        createdAt
        updatedAt
        passwordResetIssuedAt
        passwordResetRedeemedAt
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const PACKAGE_QUERY = gql`
  query LESSON_INFO {
    packageSubscriptions(userId: 1) {
      id
      periodStart
      periodEnd
      credits
      package {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        course {
          id
          title
          description
        }
      }
      payment {
        id
        status
        provider
        cancelReason
        metadata
      }
    }
  }
`;
