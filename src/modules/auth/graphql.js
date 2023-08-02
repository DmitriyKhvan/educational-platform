import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $gender: String
    $marketingChannel: String
  ) {
    signUp(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        gender: $gender
        marketingChannel: $marketingChannel
      }
    ) {
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
      students {
        id
        parentName
        level
        langLevel
        birthday
        about
        pronouns
        isActive
        avatarId
      }
      mentor {
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
      }
      isActive
      createdAt
      updatedAt
    }
  }
`;

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
        avatar {
          id
          url
        }
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
        videoUrl
        avatar {
          id
          url
        }
      }
    }
  }
`;

export const GET_MENTOR = gql`
  query GET_MENTOR($id: ID!) {
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
      videoUrl
      availabilities {
        id
        day
        from
        to
      }
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
        cancelAction
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
  query Mentors {
    mentors {
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
        cancelAction
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
  mutation redeemUserPasswordResetToken($token: String!, $password: String!) {
    resetResult: redeemUserPasswordResetToken(
      token: $token
      password: $password
    )
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
  query packageSubscriptions($userId: ID!) {
    packageSubscriptions: activePackageSubscriptions(userId: $userId) {
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

export const APPOINTMENTS_QUERY = gql`
  query GET_APPOINTMENTS($studentId: ID, $mentorId: ID, $status: String) {
    lessons(status: $status, studentId: $studentId, mentorId: $mentorId) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
      mentor {
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
      }
      student {
        id
        parentName
        level
        langLevel
        birthday
        about
        pronouns
        isActive
      }
      packageSubscription {
        id
        periodStart
        periodEnd
        credits
        package {
          course {
            title
          }
        }
      }
    }
  }
`;

export const APPROVE_APPOINTMENT = gql`
  mutation APPROVE_LESSON($id: Int!, $mentorId: Int!) {
    approveLesson(id: $id, mentorId: $mentorId) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
    }
  }
`;

export const CANCEL_APPOINTMENT = gql`
  mutation CANCEL_LESSON($id: ID!) {
    cancelLesson(id: $id) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
    }
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation CREATE_LESSON(
    $mentorId: ID!
    $studentId: ID!
    $subscriptionId: ID!
    $startAt: DateTime!
    $duration: Int!
  ) {
    lesson: createLesson(
      mentorId: $mentorId
      studentId: $studentId
      packageSubscriptionId: $subscriptionId
      startAt: $startAt
      duration: $duration
    ) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UPDATE_LESSON($id: ID!, $startAt: DateTime!, $mentorId: ID!) {
    lesson: rescheduleLesson(id: $id, startAt: $startAt, mentorId: $mentorId) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
    }
  }
`;

export const LESSON_QUERY = gql`
  query GET_LESSON($id: ID!) {
    lesson(id: $id) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
      mentor {
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
        userId
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
      student {
        id
        parentName
        level
        langLevel
        birthday
        about
        pronouns
        isActive
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
  }
`;
