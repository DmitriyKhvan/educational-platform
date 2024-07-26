import { gql } from "@apollo/client";

export const NEW_MESSAGES = gql`
  subscription newMessages {
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
