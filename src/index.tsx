import App from '@/app/app';
import '@/shared/utils/sentry';
import { ApolloProvider } from '@apollo/client';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from '@/app/providers/auth-provider';
import { ErrorBoundary } from '@/app/providers/error-boundary';
import { NotificationProvider } from '@/app/providers/notification-provider';
import client from '@/shared/config/apollo/client';
import i18next from '@/shared/config/i18n/i18n';
import { BrowserRouter } from 'react-router-dom';

import '@/app/styles/global.scss';
import { CurrencyProvider } from '@/app/providers/currency-provider';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <NotificationProvider>
        <AuthProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </BrowserRouter>
          </CurrencyProvider>
        </AuthProvider>
      </NotificationProvider>
    </I18nextProvider>
  </ApolloProvider>,
);
