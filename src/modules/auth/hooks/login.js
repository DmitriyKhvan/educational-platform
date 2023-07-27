import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql';

import { useAuth } from '..';

const useLogin = () => {
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  const { refetchUser } = useAuth();

  const login = (email, password, redirectPath = '/') => {
    loginMutation({
      variables: { email, password },
      onCompleted: (data) => {
        localStorage.setItem('token', data.authResult.sessionToken);
        refetchUser();
        location.href = redirectPath;
      },
    });
  };

  return { login, loading, error, data };
};

export default useLogin;
