import { createRoot } from 'react-dom/client';
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
  onboardingEn,
  translationsEn,
  purchaseEn,
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
} from './assets/lang/kr';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  concat,
  split,
} from '@apollo/client';
import { AuthProvider } from './modules/auth';
import { createUploadLink } from 'apollo-upload-client';
import './index.css';
import { getMainDefinition } from '@apollo/client/utilities';
import { createWsLink } from './utils/subscriptions';
import { getItemToLocalStorage } from './constants/global';
import { NotificationsProvider } from './modules/notifications';

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
  lng: parseInt(getItemToLocalStorage('language', 1)) === 0 ? 'kr' : 'en', // language to use
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
    },
  },
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <AuthProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </AuthProvider>
    </I18nextProvider>
  </ApolloProvider>,
);
