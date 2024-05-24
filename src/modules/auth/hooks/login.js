import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql';

const useLogin = () => {
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  const login = (email, password) => {
    loginMutation({
      variables: { email, password },
      onCompleted: async (data) => {
        localStorage.setItem('token', data.authResult.sessionToken);
        localStorage.setItem(
          'studentId',
          data?.authResult?.user?.students[0]?.id,
        );
      },
    });
  };

  return { login, loading, error, data };
};

export default useLogin;
