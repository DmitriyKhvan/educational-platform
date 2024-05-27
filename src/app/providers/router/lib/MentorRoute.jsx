import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Roles } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';

export const MentorRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === Roles.MENTOR) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} />;
};
