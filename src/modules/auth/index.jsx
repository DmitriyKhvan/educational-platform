import { createContext, useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, INVITE_SET_PASSWORD_MUTATION } from './graphql';
import { getItemToLocalStorage, Roles } from 'src/constants/global';
import { useNotifications } from '../notifications';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { getAllNotifications } = useNotifications();
  const [langLevel, setLangLevel] = useState(null);

  const {
    data: user,
    loading,
    refetch: refetchUser,
  } = useQuery(ME_QUERY, {
    // fetchPolicy: 'no-cache',
    variables: {
      studentId: getItemToLocalStorage('studentId'),
    },
    onCompleted: (data) => {
      if (
        getItemToLocalStorage('studentId') ||
        data.authenticatedUser.role === Roles.MENTOR
      ) {
        getAllNotifications();
      }
    },
  });

  const [redeemInvitePasswordSetToken] = useMutation(
    INVITE_SET_PASSWORD_MUTATION,
  );

  useEffect(() => {
    if (user) {
      const student = user.authenticatedUser.students.find(
        (student) => student.id === getItemToLocalStorage('studentId'),
      );
      setLangLevel(student?.langLevel || null);
    }
  }, [user]);

  const inviteSetPassword = async (email, token, password) => {
    const { data } = await redeemInvitePasswordSetToken({
      variables: { email, token, password },
    });

    return { data };
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
  };

  return (
    <AuthContext.Provider
      value={{
        user: user?.authenticatedUser || null,
        refetchUser,
        logout,
        inviteSetPassword,
        isLoading: loading,
        isAuthorized: !!user,
        langLevel,
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
