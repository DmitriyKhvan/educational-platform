import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  concat,
  split,
} from '@apollo/client';
import i18next from 'i18next';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import {
  availabilityCh,
  commonCh,
  dashboardCh,
  lessonsCh,
  modalsCh,
  notificationsCh,
  onboardingCh,
  profileCh,
  purchaseCh,
  referCh,
  sidebarCh,
  studentMentorCh,
  translationsCh,
  trialCh,
} from './assets/lang/ch';
import {
  availabilityEn,
  commonEn,
  dashboardEn,
  lessonsEn,
  modalsEn,
  notificationsEn,
  onboardingEn,
  profileEn,
  purchaseEn,
  referEn,
  sidebarEn,
  studentMentorEn,
  translationsEn,
  trialEn,
} from './assets/lang/en';
import {
  availabilityKr,
  commonKr,
  dashboardKr,
  lessonsKr,
  modalsKr,
  notificationsKr,
  onboardingKr,
  profileKr,
  purchaseKr,
  referKr,
  sidebarKr,
  studentMentorKr,
  translationsKr,
  trialKr,
} from './assets/lang/kr';

import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { Language } from './constants/global';
import './index.css';
import { AuthProvider } from './modules/auth';
import { NotificationsProvider } from './modules/notifications';
import { getReferralCodeCookie } from './utils/referralCodeCookie';
import { createWsLink } from './utils/subscriptions';

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const referralCode = getReferralCodeCookie(document);
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(referralCode? { referralCode } : {}),
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
          <App />
        </AuthProvider>
      </NotificationsProvider>
    </I18nextProvider>
  </ApolloProvider>,
);
