import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import {
  commonEn,
  sidebarEn,
  lessonsEn,
  dashboardEn,
  modalsEn,
  studentMentorEn,
  availabilityEn,
  referEn,
  profileEn,
} from './assets/lang/en';
import {
  commonKr,
  sidebarKr,
  lessonsKr,
  dashboardKr,
  modalsKr,
  studentMentorKr,
  availabilityKr,
  referKr,
  profileKr,
} from './assets/lang/kr';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  concat,
} from '@apollo/client';
import { AuthProvider } from './modules/auth';
import { createUploadLink } from 'apollo-upload-client';
import './index.css';

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
      authorization: localStorage.getItem('token') || null,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      common: commonEn,
      sidebar: sidebarEn,
      lessons: lessonsEn,
      dashboard: dashboardEn,
      modals: modalsEn,
      studentMentor: studentMentorEn,
      availability: availabilityEn,
      refer: referEn,
      profile: profileEn,
    },
    kr: {
      common: commonKr,
      sidebar: sidebarKr,
      lessons: lessonsKr,
      dashboard: dashboardKr,
      modals: modalsKr,
      studentMentor: studentMentorKr,
      availability: availabilityKr,
      refer: referKr,
      profile: profileKr,
    },
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
