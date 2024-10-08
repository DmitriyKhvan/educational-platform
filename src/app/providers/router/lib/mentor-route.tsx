import { useAuth } from '@/app/providers/auth-provider';
import { UserRoleType } from '@/types/types.generated';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const MentorRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === UserRoleType.Mentor) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} />;
};
