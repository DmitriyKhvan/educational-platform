import { createContext, useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, LOGIN_MUTATION, MUTATION_UPDATE_USER } from './graphql';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthInProgress, setIsAuthInProgress] = useState(false);
  const { data: user, userLoading, refetch: refetchUser } = useQuery(ME_QUERY);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [updateUserMutation, { loading: updateUserLoading }] = useMutation(MUTATION_UPDATE_USER);

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


  const updateUser = async (area) => {
    const {data} = await updateUserMutation({
      variables: {
        where: {
          id: parseInt(user?.me?.id),
          email: user?.me?.email
        },
        data: area
      }
    })

    return { data };
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
      updateUser,
      logout,
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
}
