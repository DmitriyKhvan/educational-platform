import { ApolloProvider } from '@apollo/client';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { AuthProvider } from 'src/app/providers/AuthProvider';
import { NotificationProvider } from './app/providers/NotificationProvider';
import client from 'src/shared/config/apollo/client';
import i18next from 'src/shared/config/i18n/i18n';

import 'src/app/styles/global.scss';

const root = createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </I18nextProvider>
  </ApolloProvider>,
);
