import { ApolloClient, ApolloLink, InMemoryCache, concat, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { createClient } from 'graphql-ws';

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem('token')}` || null,
    },
  }));

  return forward(operation);
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_SERVER_WS_URL ?? '',
    retryAttempts: Number.POSITIVE_INFINITY,
    connectionParams: {
      authToken: `Bearer ${localStorage.getItem('token')}`,
    },
    shouldRetry: () => {
      return true;
    },
    retryWait: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 3000));
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  concat(authMiddleware, httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

export default client;
