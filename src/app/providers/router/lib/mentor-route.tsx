import { useAuth } from '@/app/providers/auth-provider';
import { Roles } from '@/shared/constants/global';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const MentorRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === Roles.MENTOR) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} />;
};
