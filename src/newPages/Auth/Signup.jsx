import 'react-phone-input-2/lib/style.css'

import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'

import { signup } from '../../actions/auth'
import ImgStudent from '../../assets/images/student.svg'
import ImgTutor from '../../assets/images/tutor.svg'
import AuthLayout from '../../components/AuthLayout'
import NotificationManager from '../../components/NotificationManager'

const Signup = () => {
  const history = useHistory()
  const [t] = useTranslation('translation')
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_role: '',
    referal_code: ''
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
    const code = localStorage.getItem('referalcode')
    if (role === 'tutor') {
      setFormData({ ...formData, user_role: 'tutor' })
    } else if (role === 'admin') {
      setFormData({ ...formData, user_role: 'admin' })
    } else if (role === 'student') {
      setFormData({ ...formData, user_role: 'student', referal_code: code })
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
      invalid: "Passwords don't match",
      minChar: 'Max 8 characters',
      title:
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
    },
    confirm_password: {
      required: 'Password is required',
      invalid: "Passwords don't match",
      minChar: 'Max 8 characters'
    }
  }
  const validateInput = (value, stateName) => {
    if (!value && stateName !== 'referal_code') {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: errorMessage[stateName]?.required
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
            confirm_password:
              formData['confirm_password'].length < 7
                ? errorMessage[stateName].minChar
                : errorMessage[stateName].invalid,
            password:
              formData['password']?.length < 7
                ? errorMessage[stateName].minChar
                : errorMessage[stateName].invalid
          }))
          return false
        } else {
          if (formData['password']?.length < 7) {
            setFormDataError(formDataError => ({
              ...formDataError,
              confirm_password: errorMessage[stateName].minChar,
              password: errorMessage[stateName].minChar
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
        }
      case 'confirm_password':
        if (formData['password'] !== value) {
          setFormDataError(formDataError => ({
            ...formDataError,
            password:
              formData['password']?.length < 7
                ? errorMessage[stateName].minChar
                : errorMessage[stateName].invalid,
            confirm_password:
              formData['confirm_password']?.length < 7
                ? errorMessage[stateName].minChar
                : errorMessage[stateName].invalid
          }))
          return false
        } else {
          if (formData['confirm_password']?.length < 7) {
            setFormDataError(formDataError => ({
              ...formDataError,
              password: errorMessage[stateName].minChar,
              confirm_password: errorMessage[stateName].minChar
            }))
            return false
          } else {
            setFormDataError(formDataError => ({
              ...formDataError,
              password: '',
              confirm_password: ''
            }))
            return true
          }
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
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  const onChange = (value, stateName) => {
    validateInput(value, stateName)
    setFormData({ ...formData, [stateName]: value })
  }

  const handleSignup = async () => {
    if (formData['password']?.length < 8) {
      setFormDataError(formDataError => ({
        ...formDataError,
        password: errorMessage['password'].minChar
      }))
      return
    }

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
        formData.user_role,
        formData.referal_code
      )
    )

    if (resp.type === 'AUTH_SIGNUP_SUCCESS') {
      history.push('/')
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
      {!formData.user_role ? (
        <div className='auth-login'>
          <p className='title text-center m-5'>{t('student_or_tutor')}</p>
          <div className='welcome-body'>
            <div className='role-select'>
              <div className='role-card'>
                <img src={ImgStudent} alt='' />
                <p className='description'>{t('ima_student')}</p>
                <Link
                  href='/signup?role=student'
                  className='enter-btn btn btn-primary btn-lg'
                >
                  {t('enter_student')}
                </Link>
              </div>
              <div className='role-card'>
                <img src={ImgTutor} alt='' />
                <p className='description'>{t('ima_tutor')}</p>
                <Link
                  to='/signup?role=tutor'
                  // href='/'
                  className='enter-btn btn btn-primary btn-lg'
                >
                  {t('enter_tutor')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='auth-login'>
          <div className='text-centerpadding'>
            <p className='title text-center m-3'>{t('welcome_to_naonow')}</p>
          </div>
          <div className='form-section pt-2'>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='first_name' className='form-label'>
                  <div className='label'>{t('first_name')}</div>
                </label>
                <input
                  className='form-control'
                  type='text'
                  id='first_name'
                  name='first_name'
                  placeholder='First Name'
                  value={formData.first_name}
                  onChange={e => onChange(e.target.value, 'first_name')}
                />
              </div>
              {formDataError.first_name && (
                <p className='error-msg'>{formDataError.first_name}</p>
              )}
            </div>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='last_name' className='form-label'>
                  <div className='label'>{t('last_name')}</div>
                </label>
                <input
                  className='form-control'
                  type='text'
                  id='last_name'
                  name='last_name'
                  placeholder='Last Name'
                  value={formData.last_name}
                  onChange={e => onChange(e.target.value, 'last_name')}
                />
              </div>
              {formDataError.last_name && (
                <p className='error-msg'>{formDataError.last_name}</p>
              )}
            </div>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='email' className='form-label'>
                  <div className='label'>{t('email')}</div>
                </label>
                <input
                  className='form-control'
                  type='email'
                  id='email'
                  name='email'
                  placeholder='name@email.com'
                  value={formData.email}
                  onChange={e => onChange(e.target.value, 'email')}
                />
              </div>
              {formDataError.email && (
                <p className='error-msg'>{formDataError.email}</p>
              )}
            </div>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='phone_number' className='form-label'>
                  <div className='label'>
                    {t('phone_number', { ns: 'common' })}
                  </div>
                </label>
                <PhoneInput
                  className='form-controls'
                  specialLabel={t('phone_number', { ns: 'common' })}
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
                <p className='error-msg'>{formDataError.phone_number}</p>
              )}
            </div>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='password' className='form-label'>
                  <div className='label'>{t('password')}</div>
                </label>
                <input
                  className='form-control'
                  type='password'
                  id='password'
                  name='password'
                  placeholder='at least 8 characters'
                  value={formData.password}
                  onChange={e => onChange(e.target.value, 'password')}
                />
              </div>

              {formDataError.password && (
                <p className='error-msg'>{formDataError.password}</p>
              )}
            </div>
            <div className='mb-3'>
              <div className='form-item-inner sign-up-bottom'>
                <label htmlFor='confirm_password' className='form-label'>
                  <div className='label'>{t('confirm_password')}</div>
                </label>
                <input
                  className='form-control'
                  type='password'
                  id='confirm_password'
                  name='confirm_password'
                  placeholder='at least 8 characters'
                  value={formData.confirm_password}
                  onChange={e => onChange(e.target.value, 'confirm_password')}
                />
              </div>
              {formDataError.password && (
                <p className='error-msg'>{formDataError.password}</p>
              )}
            </div>
            {systemError && <p className='system-error-msg'>{systemError}</p>}
            <div className='d-grid gap-2 pt-4'>
              <button
                className='btn btn-primary btn-lg p-3'
                onClick={handleSignup}
              >
                {loading ? (
                  <ClipLoader loading={loading} size={20} color='white' />
                ) : (
                  t('signup')
                )}
              </button>
            </div>
            <div className='sign'>
              <p className='forgets'>
                {t('already_have_account')}{' '}
                <a href='/' className='forgot-passwords'>
                  {t('sign_in')}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}

export default Signup
