import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/modules/auth';

export const TrialRoute = ({ children }) => {
  const location = useLocation();
  const { currentStudent } = useAuth();

  if (currentStudent?.isTrial) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};
