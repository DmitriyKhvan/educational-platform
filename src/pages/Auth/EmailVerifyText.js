import AuthLayout from '../../components/AuthLayout'
import { useTranslation } from 'react-i18next'

const EmailVerifyText = () => {
  const [t, i18n] = useTranslation('translation')
  return (
    <AuthLayout>
      <div>
        <h4>{t('please_verify_email')}</h4>
        <p>{t('sent_verification_email')}</p>
      </div>
    </AuthLayout>
  )
}

export default EmailVerifyText
