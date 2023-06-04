import AuthLayout from '../../components/AuthLayout';
import { useTranslation } from 'react-i18next';

const ForgotPasswordText = () => {
  const [t] = useTranslation('translation');
  return (
    <AuthLayout>
      <div className="auth-sent-email">
        <h4>{t('please_check_email')}</h4>
        <p>{t('sent_reset_password_link')}</p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordText;
