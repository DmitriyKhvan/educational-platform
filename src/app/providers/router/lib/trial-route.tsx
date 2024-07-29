import { useAuth } from '@/app/providers/auth-provider';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const TrialRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { currentStudent } = useAuth();

  if (currentStudent?.isTrial) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};
