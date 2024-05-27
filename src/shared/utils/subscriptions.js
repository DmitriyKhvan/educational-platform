import { gql } from '@apollo/client';

export const MESSAGE_SUBSCRIPTIONS = gql`
  subscription OnNewMessages {
    newMessages {
      id
      body
      meta
      createdAt
      sender {
        id
        email
        #firstName
        #lastName
        #fullName
        #koreanEquivalent
        phoneNumber
        address
        #gender
        timeZone
        country
        #avatar
        referalCode
        referalId
        isActive
        role
        createdAt
        updatedAt
      }
    }
  }
`;
