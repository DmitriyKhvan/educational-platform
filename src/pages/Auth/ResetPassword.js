import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import NotificationManager from '../../components/NotificationManager'
import { resetPassword } from '../../actions/auth'
import AuthLayout from '../../components/AuthLayout'
import ClipLoader from 'react-spinners/ClipLoader'
import { useTranslation } from 'react-i18next'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [t] = useTranslation('translation')
  const [token, setToken] = useState()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setToken(urlParams.get('token'))
  }, [token])

  const loading = useSelector(state => state.auth.loading)
  const errorMsg = useSelector(state => state.auth.error)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const { password, confirmPassword } = formData

  const onChange = e => {
    if (!e.target.value) {
      setError(t('error_field_not_empty'))
    } else {
      setError('')
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleResetPassword = async () => {
    if (!password) {
      setError(t('error_field_not_empty'))
      return false
    }

    if (password !== confirmPassword) {
      setError(t('confirm_password_error'))
      return false
    }

    const resp = await dispatch(resetPassword(password, token))

    if (resp.type === 'AUTH_RESET_PASSWORD_SUCCESS') {
      NotificationManager.success(t('reset_password_success'), t)
      history.push('/')
    }

    if (resp.type === 'AUTH_RESET_PASSWORD_FAILURE') {
      if (errorMsg) {
        NotificationManager.error(t('reset_password_failure'), t)
        history.push('/forgot-password')
      }
    }
  }

  return (
    <AuthLayout>
      <div className="auth-login">
        <p className="title text-center mb-3">{t('reset_password')}</p>
        <div className="form-section">
          <div className="mb-3">
            <div className="form-item-inner">
              <label htmlFor="password" className="form-label">
                <strong>{t('new_password')}</strong>
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-item-inner">
            <label htmlFor="confirmPassword" className="form-label">
              <strong>{t('confirm_new_password')}</strong>
            </label>
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {errorMsg && <p className="system-error-msg">{errorMsg}</p>}

          <div className="d-grid gap-2 pt-4">
            <button
              className="btn btn-primary btn-lg p-3"
              onClick={handleResetPassword}
            >
              {loading ? (
                <ClipLoader loading={loading} size={20} color="white" />
              ) : (
                t('reset_password')
              )}
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

export default ResetPassword
