import { gql } from "@apollo/client";

export const MARK_MESSAGE_AS_READ = gql`
  mutation markMessageAsRead($id: [ID!]!) {
    markMessageAsRead(id: $id) {
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
