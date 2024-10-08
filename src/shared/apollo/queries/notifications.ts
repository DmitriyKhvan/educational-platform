import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query getUserNotifications {
    getUserNotifications {
      id
      body
      meta
      sender {
        id
        email
        phoneNumber
        address
        timeZone
        country
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
      recipients {
        id
        readAt
        # recipient
        # message
      }
      createdAt
      updatedAt
    }
  }
`;
