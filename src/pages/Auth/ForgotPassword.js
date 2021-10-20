import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import NotificationManager from '../../components/NotificationManager'
import AuthLayout from '../../components/AuthLayout'
import { forgotPassword } from '../../actions/auth'
import { useTranslation } from 'react-i18next'

const ForgotPassword = () => {
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const errorMsg = useSelector(state => state.auth.error)

  const validateEmail = email => {
    if (!email) {
      setError(t('error_empty_field'))
      return false
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const emailValid = re.test(email)
      if (!emailValid) {
        setError(t('error_invalid_email'))
        return false
      } else {
        setError('')
        return true
      }
    }
  }

  const onChange = e => {
    validateEmail(e.target.value)
    setEmail(e.target.value)
  }

  const handleForgotPassword = async () => {
    validateEmail(email)

    let resp = await dispatch(forgotPassword(email))

    if (resp.type === 'AUTH_FORGOT_PASSWORD_SUCCESS') {
      NotificationManager.success(t('forgot_password_success'), t)
      history.push('/forgot-password-guide')
    }

    if (resp.type === 'AUTH_FORGOT_PASSWORD_FAILURE') {
      if (errorMsg) {
        NotificationManager.error(t('forgot_password_failure'), t)
      }
    }
  }

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="text-center title mb-3">{t('forgot_password')}?</p>
        <div className="form-section">
          <div className="mb-3">
            <div className="form-item-inner">
              <label htmlFor="email" className="form-label">
                <strong>{t('email')}</strong>
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            {errorMsg && <p className="system-error-msg">{errorMsg}</p>}
          </div>
          <div className="d-grid gap-2 pt-4">
            <button
              className="btn btn-primary btn-lg p-3"
              onClick={handleForgotPassword}
            >
              {t('reset_password')}
            </button>
          </div>
          <p className="mt-5">
            {t('already_have_account')}{' '}
            <a href="/" className="forgot-password">
              {t('sign_in')}
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
