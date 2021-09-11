import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import translation_en from './assets/lang/en/translations.json'
import translation_kr from './assets/lang/kr/translations.json'

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
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
