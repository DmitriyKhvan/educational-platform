import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { Roles, getItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';

export const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const { user } = useAuth();
  const history = useHistory();

  if (user) {
    window.Intercom('boot', {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'ohhixtgv',
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        return user?.role === Roles.MENTOR && user?.role === role ? (
          <Component {...props} />
        ) : (user?.role === Roles.STUDENT &&
            user?.role === role &&
            getItemToLocalStorage('studentId')) ||
          (user?.role === Roles.STUDENT && role === 'student_parent') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: history.location.pathname },
            }}
          />
        );
      }}
    />
  );
};
