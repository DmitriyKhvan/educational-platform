import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import translation_en from './assets/lang/en/translations.json'
import translation_kr from './assets/lang/kr/translations.json'
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, ApolloProvider, concat } from '@apollo/client';
import { AuthProvider } from './modules/auth';

const httpLink = new HttpLink({ uri: `${process.env.REACT_APP_SERVER_URL}/api/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    }
  }));

  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      translation: translation_en // 'common' is our custom namespace
    },
    kr: {
      translation: translation_kr // 'common' is our custom namespace
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18next}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nextProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
