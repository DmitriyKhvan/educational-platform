import { useMutation } from '@apollo/client';
import { NEW_PASSWORD_MUTATION } from '../../../../shared/apollo/graphql';

export const useNewPassword = () => {
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
