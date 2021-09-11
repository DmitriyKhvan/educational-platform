import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
import NotificationManager from '../../components/NotificationManager'
import { login } from '../../actions/auth'
import { getUserInfo } from '../../actions/user'
import AuthLayout from '../../components/AuthLayout'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const errorMessage = {
    email: {
      required: t('required_email'),
      invalid: t('error_invalid_email')
    },
    password: {
      required: t('required_password')
    }
  }
  const [formDataError, setFormDataError] = useState({
    email: '',
    password: ''
  })

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)

  const validateInput = (value, stateName) => {
    if (!value) {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: errorMessage[stateName].required
      }))
      return false
    } else {
      if (stateName === 'email') {
        const emailValid = validateEmail(value)
        if (!emailValid) {
          setFormDataError(formDataError => ({
            ...formDataError,
            [stateName]: errorMessage[stateName].invalid
          }))
          return false
        } else {
          setFormDataError(formDataError => ({
            ...formDataError,
            [stateName]: ''
          }))
          return true
        }
      } else {
        setFormDataError(formDataError => ({
          ...formDataError,
          [stateName]: ''
        }))
        return true
      }
    }
  }

  const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }

  const onChange = (value, stateName) => {
    validateInput(value, stateName)
    setFormData({ ...formData, [stateName]: value })
  }

  const handleLogin = async () => {
    const result = Object.keys(formData).map(key => {
      return validateInput(formData[key], key)
    })

    const isInvalid = result.filter(r => !r).length > 0

    if (isInvalid) {
      return
    }
    const from = history.location.state?.from
    let resp = await dispatch(login(formData.email, formData.password))

    if (resp.type === 'AUTH_LOGIN_SUCCESS') {
      NotificationManager.success(t('login_success'), t)
      dispatch(getUserInfo())
      history.push('/')
    } else {
      if (error) {
        NotificationManager.error(t('login_failed'), t)
        history.push('/')
      }
    }
  }

  return (
    <AuthLayout>
      <div className="auth-login">
        <h4>{t('login')}</h4>
        <div className="form-section">
          <div className="form-item">
            <div className="form-item-inner">
              <label htmlFor="email">{t('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={e => onChange(e.target.value, 'email')}
              />
            </div>
            {formDataError.email && (
              <p className="error-msg">{formDataError.email}</p>
            )}
          </div>
          <div className="form-item">
            <div className="form-item-inner">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={e => onChange(e.target.value, 'password')}
              />
            </div>
            {formDataError.password && (
              <p className="error-msg">{formDataError.password}</p>
            )}
          </div>
          {error && <p className="system-error-msg">{error}</p>}
          <div className="submit-action">
            <button className="auth-button" onClick={handleLogin}>
              {loading ? (
                <ClipLoader loading={loading} size={20} color="white" />
              ) : (
                t('login')
              )}
            </button>
          </div>
          <p>
            {t('not_registered')} <a href="/signup">{t('signup')}</a> /{' '}
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
