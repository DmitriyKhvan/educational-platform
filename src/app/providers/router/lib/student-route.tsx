import { useAuth } from '@/app/providers/auth-provider';
import { getItemToLocalStorage } from '@/shared/constants/global';
import { UserRoleType } from '@/types/types.generated';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const StudentRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === UserRoleType.Student && getItemToLocalStorage('studentId', '')) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} />;
};
