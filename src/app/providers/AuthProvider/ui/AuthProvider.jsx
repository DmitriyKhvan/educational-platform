import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNotifications } from 'src/app/providers/NotificationProvider';
import {
  INVITE_SET_PASSWORD_MUTATION,
  ME_QUERY,
} from 'src/shared/apollo/graphql';
import { Roles, getItemToLocalStorage } from 'src/shared/constants/global';
import { AuthContext } from '../lib/AuthContext';

export const AuthProvider = ({ children }) => {
  const { getAllNotifications } = useNotifications();
  const [currentStudent, setCurrentStudent] = useState(null);

  const {
    data: user,
    loading,
    refetch: refetchUser,
  } = useQuery(ME_QUERY, {
    // fetchPolicy: 'network-only',
    variables: {
      studentId: getItemToLocalStorage('studentId'),
    },
    onCompleted: (data) => {
      const student = data.authenticatedUser.students.find(
        (student) => student.id === getItemToLocalStorage('studentId'),
      );

      setCurrentStudent(student);

      if (
        getItemToLocalStorage('studentId') ||
        data.authenticatedUser.role === Roles.MENTOR
      ) {
        getAllNotifications();
      }
    },
  });

  if (user) {
    window.Intercom('boot', {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'ohhixtgv',
      name: `${user?.authenticatedUser?.firstName} ${user?.authenticatedUser?.lastName}`,
      email: user?.authenticatedUser?.email,
    });
  }

  const [redeemInvitePasswordSetToken] = useMutation(
    INVITE_SET_PASSWORD_MUTATION,
  );

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
        currentStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
