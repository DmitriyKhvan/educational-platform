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
    redeemUserPasswordResetToken(
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
