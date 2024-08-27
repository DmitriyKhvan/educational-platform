import { AuthContext } from '@/app/providers/auth-provider/lib/auth-context';
import { useNotifications } from '@/app/providers/notification-provider';
import { INVITE_SET_PASSWORD_MUTATION, ME_QUERY } from '@/shared/apollo/graphql';
import { Roles } from '@/shared/constants/global';
// import useLocalStorage from '@/shared/utils/use-local-storage';
import type { AuthStudent, AuthenticatedUser } from '@/types/types.generated';
import { useMutation, useQuery } from '@apollo/client';
import { type ReactNode, useState } from 'react';

interface MeQueryData {
  authenticatedUser: AuthenticatedUser;
}

export interface InviteSetPasswordMutationData {
  redeemInvitePasswordSetToken: { [key: string]: unknown };
}

interface InviteSetPasswordMutationVars {
  email: string;
  token: string;
  password: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getAllNotifications } = useNotifications();
  const [currentStudent, setCurrentStudent] = useState<AuthStudent | null>(null);
  // const [studentId, setStudentId] = useLocalStorage('studentId', null);

  const {
    data: user,
    loading,
    refetch: refetchUser,
  } = useQuery<MeQueryData>(ME_QUERY, {
    variables: {
      studentId: localStorage.getItem('studentId') || '',
    },
    onCompleted: (data) => {
      const student = data?.authenticatedUser?.students?.find(
        (student) => student?.id === localStorage.getItem('studentId') || '',
      );

      setCurrentStudent(student || null);

      if (localStorage.getItem('studentId') || data.authenticatedUser.role === Roles.MENTOR) {
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

  const [redeemInvitePasswordSetToken] = useMutation<
    InviteSetPasswordMutationData,
    InviteSetPasswordMutationVars
  >(INVITE_SET_PASSWORD_MUTATION);

  const inviteSetPassword = async (
    email: string,
    token: string,
    password: string,
  ): Promise<{ data: InviteSetPasswordMutationData | null | undefined }> => {
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
