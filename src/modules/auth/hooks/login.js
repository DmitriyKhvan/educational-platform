import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql';

import { useTranslation } from 'react-i18next';
import NotificationManager from '../../../components/NotificationManager';
import { useAuth } from '..';

const useLogin = () => {
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);
  const [t] = useTranslation('common');
  const { refetchUser } = useAuth();

  const login = (email, password) => {
    loginMutation({
      variables: { email, password },
      onCompleted: (data) => {
        localStorage.setItem('token', data.authResult.sessionToken);
        refetchUser();
      },
      onError: () => {
        NotificationManager.error(t('login_failed'), t);
      },
    });
  };

  return { login, loading };
};

export default useLogin;
