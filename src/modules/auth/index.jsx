import { createContext, useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ME_QUERY,
  NEW_PASSWORD_MUTATION,
  INVITE_SET_PASSWORD_MUTATION,
} from './graphql';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthInProgress, setIsAuthInProgress] = useState(true);
  const { data: user, loading, refetch: refetchUser } = useQuery(ME_QUERY);

  const [redeemUserPasswordResetToken] = useMutation(NEW_PASSWORD_MUTATION);
  const [redeemInvitePasswordSetToken] = useMutation(
    INVITE_SET_PASSWORD_MUTATION,
  );
  const me = {
    ...user?.authenticatedUser,
    student: user?.authenticatedUser?.students?.[0] ?? null,
  };

  useEffect(() => {
    if (!loading && isAuthInProgress) {
      setIsAuthInProgress(false);
    }
  }, [loading, isAuthInProgress]);

  const newPassword = async (email, token, password) => {
    const { data } = await redeemUserPasswordResetToken({
      variables: { email, token, password },
    });

    return { data };
  };

  const inviteSetPassword = async (email, token, password) => {
    const { data } = await redeemInvitePasswordSetToken({
      variables: { email, token, password },
    });

    return { data };
  };

  const logout = async () => {
    localStorage.removeItem('token');
    await refetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user: me || null,
        refetchUser,
        logout,
        newPassword,
        inviteSetPassword,
        isLoading: loading,
        isAuthorized: !!user,
        isAuthInProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValues = useContext(AuthContext);
  return contextValues;
};
