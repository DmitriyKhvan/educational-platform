import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import NotificationManager from '../../components/NotificationManager'
import { emailVerify } from '../../actions/auth'
import AuthLayout from '../../components/AuthLayout'
import { useTranslation } from 'react-i18next'

const VerifyEmail = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    async function tokenVerify(token) {
      let resp = await dispatch(emailVerify(token))

      if (resp.type === 'AUTH_EMAIL_VERIFY_FAILURE') {
        setVerified(false)
        NotificationManager.error(t('email_verify_failed'), t)
        history.push('/signup')
      }

      if (resp.type === 'AUTH_EMAIL_VERIFY_SUCCESS') {
        setVerified(true)
        
        history.push('/')
      }
    }

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    tokenVerify(token)
  }, [dispatch, history])

  return (
    <AuthLayout>{!verified && <h4>{t('verifying_your_email')}</h4>}</AuthLayout>
  )
}

export default VerifyEmail
