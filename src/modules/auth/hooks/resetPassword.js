import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { RESET_PASSWORD_MUTATION } from '../graphql';

import { toast } from 'react-toastify';
import NotificationManager from '../../../components/NotificationManager';

const useResetPassword = () => {
  const [sendUserPasswordResetLink, { loading }] = useMutation(
    RESET_PASSWORD_MUTATION,
  );
  const [t] = useTranslation('common');

  const notify = () =>
    toast(
      'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
    );

  const resetPassword = (email) => {
    sendUserPasswordResetLink({
      variables: { email },
      onCompleted: () => {
        notify();
      },
      onError: () => {
        NotificationManager.error(t('login_failed'), t);
      },
    });
  };

  return { resetPassword, loading };
};

export default useResetPassword;
