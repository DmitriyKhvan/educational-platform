import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '../graphql';

const useResetPassword = () => {
  const [sendUserPasswordResetLink, { loading, error, data }] = useMutation(
    RESET_PASSWORD_MUTATION,
  );

  const resetPassword = (email) => {
    sendUserPasswordResetLink({
      variables: { email },
    });
  };

  return { resetPassword, loading, error, data };
};

export default useResetPassword;
