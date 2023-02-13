import { createContext, useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, LOGIN_MUTATION, MUTATION_UPDATE_USER, RESET_PASSWORD_MUTATION, NEW_PASSWORD_MUTATION } from './graphql';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthInProgress, setIsAuthInProgress] = useState(true);
  const { data: user, userLoading, refetch: refetchUser } = useQuery(ME_QUERY);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [sendUserPasswordResetLink] = useMutation(RESET_PASSWORD_MUTATION);
  const [redeemUserPasswordResetToken] = useMutation(NEW_PASSWORD_MUTATION);

  useEffect(() => {
    if (!userLoading && isAuthInProgress) {
      setIsAuthInProgress(false);
    }
  }, [userLoading, isAuthInProgress])

  const login = async (email, password) => {
    const { data, errors, loading } = await loginMutation({
      variables: { email, password },
    });

    if (data.authResult) {
      localStorage.setItem('token', data.authResult.sessionToken);
      await refetchUser();
    }

    return { data, errors, loading };
  }

  const resetPassword = async (email) => {
    const { data } = await sendUserPasswordResetLink({
      variables: {email}
    })


    return {data}
  }

  const newPassword = async (email, token , password) => {
    const { data } = await redeemUserPasswordResetToken({
      variables: {email, token , password}
    })


    return {data}
  }


  const logout = async () => {
    localStorage.removeItem('token');
    await refetchUser();
  }

  return (
    <AuthContext.Provider value={{
      user: user?.me || null,
      refetchUser,
      login,
      logout,
      resetPassword,
      newPassword,
      isLoading: userLoading || loginLoading,
      isAuthorized: !!user?.me,
      isAuthInProgress,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValues = useContext(AuthContext);
  return contextValues;
};
