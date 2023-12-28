import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phoneNumber: String
  ) {
    signUp(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        phoneNumber: $phoneNumber
      }
    ) {
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
        zoomUserId
        zoomEmail
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

export const ME_QUERY = gql`
  query ME_QUERY($studentId: ID) {
    authenticatedUser(studentId: $studentId) {
      id
      firstName
      lastName
      gender
      email
      timeZone
      phoneNumber
      address
      country
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
        avatar {
          id
          url
        }
        newToken
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
        avatar {
          id
          url
        }
        # availabilities
        zoomUserId
        zoomEmail
      }
      avatarId
      avatar {
        id
        url
      }
      isActive
      role
      cardLast4
      newToken
    }
  }
`;

export const ATTACH_STUDENT_TO_USER = gql`
  mutation ATTACH_STUDENT_TO_USER(
    $userId: ID!
    $firstName: String!
    $lastName: String!
  ) {
    attachStudentToUser(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
    ) {
      id
    }
  }
`;

export const CREATE_NICE_PAYMENT = gql`
  mutation CREATE_NICE_PAYMENT(
    $studentId: ID!
    $packageId: ID!
    $amount: Int!
    $courseTitle: String!
    $cardNumber: String!
    $expiry: String!
    $birth: String!
    $pwd2Digit: String!
  ) {
    createNicePayment(
      studentId: $studentId
      packageId: $packageId
      amount: $amount
      courseTitle: $courseTitle
      cardNumber: $cardNumber
      expiry: $expiry
      birth: $birth
      pwd2Digit: $pwd2Digit
    ) {
      id
    }
  }
`;

export const CHECK_NICE_SUBSCRIPTION_STATUS = gql`
  mutation CHECK_NICE_SUBSCRIPTION_STATUS($userId: ID!) {
    checkNiceSubscriptionStatus(userId: $userId)
  }
`;

export const GET_MENTOR = gql`
  query GET_MENTOR($id: ID!) {
    mentor(id: $id) {
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
      user {
        id
        email
        phoneNumber
        address
        timeZone
        country
        referalCode
        referalId
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
      }
      videoUrl
      avatarId
      visibilityStatus
      avatar {
        id
        url
      }
      availabilities {
        id
        day
        from
        to
      }
      zoomUserId
      zoomEmail
    }
  }
`;

export const MENTORS_QUERY = gql`
  query Mentors($studentId: ID!) {
    mentors(visibilityStatus: public, studentId: $studentId) {
      id
      firstName
      lastName
      fullName
      acceptingStudents
      gender
      avatar {
        id
        url
      }
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
      user {
        id
        email

        phoneNumber
        address

        timeZone
        country

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
      availabilities {
        id
        day
        from
        to
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
        students {
          id
          firstName
          lastName
          parentName
        }
        role
      }
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation sendUserPasswordResetLink($email: String!, $locale: String) {
    sendUserPasswordResetLink(email: $email, locale: $locale)
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
  query packageSubscriptions($studentId: ID!) {
    packageSubscriptions: activePackageSubscriptions(studentId: $studentId) {
      id
      periodStart
      periodEnd
      credits
      modifyCredits
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
        buyPrice
        metadata
      }
      lessons {
        id
        startAt
        duration
        status
        cancelAction
        cancelReason
        canceledBy
      }
      active
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
      cancelReason
      canceledBy
      canceledAt
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
        avatar {
          id
          url
        }
        # availabilities
        zoomUserId
        zoomEmail
      }
      student {
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
          email
        }
        # lessons
        avatarId
        avatar {
          id
          url
        }
      }
      packageSubscription {
        id
        periodStart
        periodEnd
        credits
        modifyCredits
        package {
          course {
            title
          }
        }
        paymentId
      }
      zoom {
        id
        meetingId
        startUrl
        joinUrl
        recordingUrl
      }
    }
  }
`;

export const APPROVE_APPOINTMENT = gql`
  mutation APPROVE_LESSON($id: ID!, $mentorId: ID!) {
    approveLesson(id: $id, mentorId: $mentorId) {
      id
      startAt
      duration
      status
      cancelAction
    }
  }
`;

export const CANCEL_APPOINTMENT = gql`
  mutation CANCEL_LESSON($id: ID!, $cancelReason: String, $repeat: Boolean) {
    cancelLessons(id: $id, cancelReason: $cancelReason, repeat: $repeat) {
      id
      startAt
      duration
      status
      cancelAction
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
    $repeat: Boolean
  ) {
    lesson: createLessons(
      mentorId: $mentorId
      studentId: $studentId
      packageSubscriptionId: $subscriptionId
      startAt: $startAt
      duration: $duration
      repeat: $repeat
    ) {
      id
      startAt
      duration
      status
      cancelAction
      cancelReason
      #mentor
      #student
      packageSubscription {
        id
        periodStart
        periodEnd
        credits
        packageId
        modifyCredits
        package {
          course {
            title
          }
        }
        paymentId
        # payment
        # lessons
      }
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UPDATE_LESSON(
    $id: ID!
    $startAt: DateTime!
    $mentorId: ID!
    $repeat: Boolean
  ) {
    lesson: rescheduleLessons(
      id: $id
      startAt: $startAt
      mentorId: $mentorId
      repeat: $repeat
    ) {
      id
      startAt
      duration
      status
      cancelAction
      cancelReason
      packageSubscription {
        id
        periodStart
        periodEnd
        credits
        packageId
        modifyCredits
        package {
          course {
            title
          }
        }
        paymentId
        # payment
        # lessons
      }
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
        userId
        avatarId
        avatar {
          id
          url
        }
      }
      student {
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
        avatarId
        avatar {
          id
          url
        }
      }
      packageSubscription {
        id
        credits
        package {
          id
          period
          sessionTime
          course {
            id
            title
          }
        }
      }
    }
  }
`;

export const APPLY_PROMOTION_CODE_FOR_PACKAGE_RESOLVER = gql`
  mutation ApplyPromotionCodeForPackage($code: String!, $packageId: ID!) {
    applyPromotionCodeForPackage(code: $code, packageId: $packageId) {
      selectedPackage {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        courseId
      }
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
    }
  }
`;
