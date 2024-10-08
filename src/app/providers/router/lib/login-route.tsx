import { useAuth } from '@/app/providers/auth-provider/lib/use-auth';
import { UserRoleType } from '@/types/types.generated';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const LoginRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (user?.role === UserRoleType.Student) {
    return <Navigate to="/student/manage-lessons" />;
  }

  if (user?.role === UserRoleType.Mentor) {
    return <Navigate to="/mentor/manage-appointments" />;
  }

  return children;
};
