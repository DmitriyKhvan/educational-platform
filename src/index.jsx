import { createRoot } from 'react-dom/client';
import App from './app/App';
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
  onboardingEn,
  translationsEn,
  purchaseEn,
  trialEn,
  notificationsEn,
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
  onboardingKr,
  translationsKr,
  purchaseKr,
  trialKr,
  notificationsKr,
} from './assets/lang/kr';
import {
  availabilityCh,
  commonCh,
  dashboardCh,
  lessonsCh,
  modalsCh,
  onboardingCh,
  profileCh,
  purchaseCh,
  referCh,
  sidebarCh,
  studentMentorCh,
  translationsCh,
  trialCh,
  notificationsCh,
} from './assets/lang/ch';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  concat,
  split,
} from '@apollo/client';

import { AuthProvider } from './modules/auth';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import './index.css';
import { getMainDefinition } from '@apollo/client/utilities';
import { createWsLink } from './utils/subscriptions';
import { Language } from './constants/global';
import { NotificationsProvider } from './modules/notifications';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './app/providers/ErrorBoundary';

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
      authorization: 'Bearer ' + localStorage.getItem('token') || null,
    },
  }));

  return forward(operation);
});

const wsLink = createWsLink(process.env.REACT_APP_SERVER_WS_URL);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  concat(authMiddleware, httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng:
    localStorage.getItem('language') === Language.KR
      ? Language.KR
      : localStorage.getItem('language') === Language.CH
        ? Language.CH
        : Language.EN, // language to use
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
      onboarding: onboardingEn,
      translations: translationsEn,
      purchase: purchaseEn,
      trial: trialEn,
      notifications: notificationsEn,
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
      onboarding: onboardingKr,
      translations: translationsKr,
      purchase: purchaseKr,
      trial: trialKr,
      notifications: notificationsKr,
    },
    cn: {
      common: commonCh,
      sidebar: sidebarCh,
      lessons: lessonsCh,
      dashboard: dashboardCh,
      modals: modalsCh,
      studentMentor: studentMentorCh,
      availability: availabilityCh,
      refer: referCh,
      profile: profileCh,
      onboarding: onboardingCh,
      translations: translationsCh,
      purchase: purchaseCh,
      trial: trialCh,
      notifications: notificationsCh,
    },
  },
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <NotificationsProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </NotificationsProvider>
    </I18nextProvider>
  </ApolloProvider>,
);
