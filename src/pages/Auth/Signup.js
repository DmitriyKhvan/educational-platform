import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ClipLoader from 'react-spinners/ClipLoader'
import NotificationManager from '../../components/NotificationManager'
import { signup } from '../../actions/auth'
import AuthLayout from '../../components/AuthLayout'
import { useTranslation } from 'react-i18next'
import ImgStudent from '../../assets/images/student.svg'
import ImgTutor from '../../assets/images/tutor.svg'

const Signup = () => {
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_role: ''
  })

  const [formDataError, setFormDataError] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const role = urlParams.get('role')

    if (role === 'tutor') {
      setFormData({ ...formData, user_role: 'tutor' })
    } else if (role === 'admin') {
      setFormData({ ...formData, user_role: 'admin' })
    } else if (role === 'student') {
      setFormData({ ...formData, user_role: 'student' })
    }
  }, [])

  const loading = useSelector(state => state.auth.loading)
  const [systemError, setSystemError] = useState('')
  const errorMessage = {
    first_name: {
      required: 'First name is required'
    },
    last_name: {
      required: 'Last name is required'
    },
    phone_number: {
      required: 'Phone number is required'
    },
    email: {
      required: 'Email is required',
      invalid: 'Invalid e-mail address'
    },
    password: {
      required: 'Password is required',
      invalid: "Passwords don't match"
    },
    confirm_password: {
      required: 'Password is required',
      invalid: "Passwords don't match"
    }
  }
  const validateInput = (value, stateName) => {
    if (!value) {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: errorMessage[stateName].required
      }))
      return false
    }

    switch (stateName) {
      case 'email':
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
      case 'password':
        if (formData['confirm_password'] !== value) {
          setFormDataError(formDataError => ({
            ...formDataError,
            confirm_password: errorMessage[stateName].invalid,
            password: errorMessage[stateName].invalid
          }))
          return false
        } else {
          setFormDataError(formDataError => ({
            ...formDataError,
            confirm_password: '',
            password: ''
          }))
          return true
        }
      case 'confirm_password':
        if (formData['password'] !== value) {
          setFormDataError(formDataError => ({
            ...formDataError,
            confirm_password: errorMessage[stateName].invalid,
            password: errorMessage[stateName].invalid
          }))
          return false
        } else {
          setFormDataError(formDataError => ({
            ...formDataError,
            confirm_password: '',
            password: ''
          }))
          return true
        }
      default:
        setFormDataError(formDataError => ({
          ...formDataError,
          [stateName]: ''
        }))
        return true
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

  const handleSignup = async () => {
    const result = Object.keys(formData).map(key => {
      return validateInput(formData[key], key)
    })

    const isInvalid = result.filter(r => !r).length > 0

    if (isInvalid) {
      return
    }

    setSystemError('')

    let resp = await dispatch(
      signup(
        formData.first_name,
        formData.last_name,
        formData.phone_number,
        formData.email,
        formData.password,
        formData.user_role
      )
    )

    if (resp.type === 'AUTH_SIGNUP_SUCCESS') {
      NotificationManager.success(t('signup_success'), t)
      history.push('/email-verify-guide')
    }

    if (resp.type === 'AUTH_SIGNUP_FAILURE') {
      NotificationManager.error(t('signup_failed'), t)
      if (typeof resp.payload.error.messages === 'object') {
        const errorMsgs = resp.payload.error.messages

        // eslint-disable-next-line array-callback-return
        Object.keys(formDataError).map(key => {
          // eslint-disable-next-line array-callback-return
          errorMsgs.map(item => {
            if (item.param === key) {
              setFormDataError(formDataError => ({
                ...formDataError,
                [key]: item.title
              }))
            }
          })
        })
      }

      if (typeof resp.payload.error.message === 'string') {
        setSystemError(resp.payload.error.message)
      }
    }
  }

  return (
    <AuthLayout>
      {formData['user_role'] === '' ? (
        <div className="auth-welcome">
          <h4>{t('welcome_to_naonow')}</h4>
          <div className="welcome-body">
            <p className="question">{t('are_you_student_or_tutor')}</p>
            <div className="role-select">
              <div className="role-card">
                <img src={ImgStudent} alt="" />
                <p className="description">{t('ima_student')}</p>
                <a href="/signup?role=student" className="enter-btn">
                  {t('enter_student')}
                </a>
              </div>
              <div className="role-card">
                <img src={ImgTutor} alt="" />
                <p className="description">{t('ima_tutor')}</p>
                <a href="/signup?role=tutor" className="enter-btn">
                  {t('enter_tutor')}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-signup">
          <h4>{t('signup')}</h4>
          <div className="form-section">
            <div className="name-input">
              <div className="form-item">
                <div className="form-item-inner">
                  <label htmlFor="first_name">{t('first_name')}</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={e => onChange(e.target.value, 'first_name')}
                  />
                </div>
                {formDataError.first_name && (
                  <p className="error-msg">{formDataError.first_name}</p>
                )}
              </div>
              <div className="form-item">
                <div className="form-item-inner">
                  <label htmlFor="last_name">{t('last_name')}</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={e => onChange(e.target.value, 'last_name')}
                  />
                </div>
                {formDataError.last_name && (
                  <p className="error-msg">{formDataError.last_name}</p>
                )}
              </div>
            </div>
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
                <label htmlFor="phone_number">{t('phone_number')}</label>
                <PhoneInput
                  specialLabel={t('phone_number')}
                  country={'us'}
                  value={formData.phone_number}
                  onChange={phone => onChange(`+${phone}`, 'phone_number')}
                  inputProps={{
                    name: 'phone_number',
                    required: true
                  }}
                />
              </div>
              {formDataError.phone_number && (
                <p className="error-msg">{formDataError.phone_number}</p>
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
            <div className="form-item">
              <div className="form-item-inner">
                <label htmlFor="confirm_password">
                  {t('confirm_password')}
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={e => onChange(e.target.value, 'confirm_password')}
                />
              </div>
              {formDataError.password && (
                <p className="error-msg">{formDataError.password}</p>
              )}
            </div>
            {systemError && <p className="system-error-msg">{systemError}</p>}
            <div className="submit-action">
              <button className="auth-button" onClick={() => handleSignup()}>
                {loading ? (
                  <ClipLoader loading={loading} size={20} color="white" />
                ) : (
                  t('signup')
                )}
              </button>
            </div>
            <p>
              {t('already_have_account')} <a href="/">{t('login')}</a>
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}

export default Signup
