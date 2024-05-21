import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Roles, getItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';

export const StudentRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === Roles.STUDENT && getItemToLocalStorage('studentId')) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} />;
};
