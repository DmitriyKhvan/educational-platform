import { useMutation } from '@apollo/client';
import { NEW_PASSWORD_MUTATION } from '../graphql';

const useNewPassword = () => {
  const [redeemUserPasswordResetToken, { loading, error, data }] = useMutation(
    NEW_PASSWORD_MUTATION,
  );

  const newPassword = (token, password) => {
    redeemUserPasswordResetToken({
      variables: { token, password },
    });
  };

  return { newPassword, loading, error, data };
};

export default useNewPassword;
