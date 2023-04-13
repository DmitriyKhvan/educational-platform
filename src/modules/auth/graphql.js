import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  {
    me {
      id
      firstName
      lastName
      fullName
      role
      email
      gender
      address

      country
      timeZone
      phoneNumber
      koreanEquivalent
      student {
        id
        about
        avatar {
          id
          filesize
          width
          height
          extension
          url
        }
      }
      tutor {
        videoUrl
        id
        introduction
        relevantExperience
        uniqueFacts
        degree
        university
        graduatingYear
        degree
        major
        avatar {
          id
          filesize
          width
          height
          extension
          url
        }
      }
    }
  }
`

export const MENTORS_QUERY = gql`
  query tutors($where: TutorWhereInput) {
    tutors(where: $where) {
      id
      user {
        id
        firstName
        lastName
      }
      major
      language
      university
      acceptanceRate
      checked
      userName
      videoUrl
      totalRequests
      graduatingYear
      degree
      certificates
      introduction
      relevantExperience
      uniqueFacts
      about
      experience
      facts
      createdAt
      updatedAt
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
    }
  }
`

export const USERS_QUERY = gql`
  query users {
    users {
      id
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    authResult: authenticateUserWithPassword(
      email: $email
      password: $password
    ) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation sendUserPasswordResetLink($email: String!) {
    sendUserPasswordResetLink(email: $email)
  }
`

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
`

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
`

export const MUTATION_UPDATE_USER = gql`
  mutation updateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      id
      firstName
    }
  }
`

export const MUTATION_UPDATE_TUTOR = gql`
  mutation updateTutor(
    $data: TutorUpdateInput!
    $where: TutorWhereUniqueInput!
  ) {
    updateTutor(data: $data, where: $where) {
      id
    }
  }
`

export const MUTATION_UPDATE_STUDENT = gql`
  mutation updateStudent(
    $data: StudentUpdateInput!
    $where: StudentWhereUniqueInput!
  ) {
    updateStudent(data: $data, where: $where) {
      id
    }
  }
`

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
`

export const STUDENTS_QUERY = gql`
  query students($where: StudentWhereInput) {
    students(where: $where) {
      id
      userName(something: 1)
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
        fullName(something: 1)
        role(something: 1)
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
`
