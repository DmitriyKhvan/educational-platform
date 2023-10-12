import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql';

import { useAuth } from '..';
// import { useHistory } from 'react-router-dom';

const useLogin = () => {
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  const { refetchUser } = useAuth();
  // const history = useHistory();

  const login = (email, password /*redirectPath = '/'*/) => {
    loginMutation({
      variables: { email, password },
      onCompleted: async (data) => {
        localStorage.setItem('token', data.authResult.sessionToken);
        await refetchUser();
        // localStorage.setItem('studentId', data.authResult.user.students[0].id);
        // if (data.authResult.user.role === 'student') {
        //   refetchUser(data.authResult.user.students[0].id);
        // } else {
        //   await refetchUser();
        // }

        // location.href = redirectPath;
        // history.push(redirectPath);
      },
    });
  };

  return { login, loading, error, data };
};

export default useLogin;
