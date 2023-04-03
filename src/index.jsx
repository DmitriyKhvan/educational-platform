import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import translation_en from './assets/lang/en/translations.json'
import translation_kr from './assets/lang/kr/translations.json'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  concat
} from '@apollo/client'
import { AuthProvider } from './modules/auth'
import { createUploadLink } from 'apollo-upload-client'
import './index.css'

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/api/graphql`,
  headers: {
    'Apollo-Require-Preflight': 'true'
  }
})

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null
    }
  }))

  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

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
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
