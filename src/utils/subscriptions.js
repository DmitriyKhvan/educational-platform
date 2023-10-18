import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { gql, useSubscription } from '@apollo/client';

export const MESSAGE_SUBSCRIPTIONS = gql`subscription OnNewMessages {
    newMessages {
        id
        body
        meta
        sender {
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
            referalCode
            referalId
            isActive
            role
            createdAt
            updatedAt
        }
    }
}`
export const createWsLink = function (url) {
  const client = new GraphQLWsLink(
    createClient({
      url: url,
      connectionParams: {
        authToken: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  );
  return client;
};
