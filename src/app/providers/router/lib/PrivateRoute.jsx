import React from 'react';
import { Navigate, useNavigate, useMatch, useOutlet } from 'react-router-dom';
import { Roles, getItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';

// export const PrivateRoute = ({ element: Component, role, ...rest }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   if (user) {
//     window.Intercom('boot', {
//       api_base: 'https://api-iam.intercom.io',
//       app_id: 'ohhixtgv',
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.email,
//     });
//   }

//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         return user?.role === Roles.MENTOR && user?.role === role ? (
//           <Component {...props} />
//         ) : (user?.role === Roles.STUDENT &&
//             user?.role === role &&
//             getItemToLocalStorage('studentId')) ||
//           (user?.role === Roles.STUDENT && role === 'student_parent') ? (
//           <Component {...props} />
//         ) : (
//           <Navigate
//             to={{
//               pathname: '/',
//               state: { from: navigate.location.pathname },
//             }}
//           />
//         );
//       }}
//     />
//   );
// };

export const PrivateRoute = ({ children }) => {
  console.log('useOutlet', useOutlet());

  debugger;
  let { role } = useMatch();

  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    window.Intercom('boot', {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'ohhixtgv',
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  }

  if (user?.role === Roles.MENTOR && user?.role === role) {
    return children;
  } else if (
    (user?.role === Roles.STUDENT &&
      user?.role === role &&
      getItemToLocalStorage('studentId')) ||
    (user?.role === Roles.STUDENT && role === 'student_parent')
  ) {
    return children;
  } else {
    return (
      <Navigate
        to={{
          pathname: '/',
          state: { from: navigate.location.pathname },
        }}
      />
    );
  }
};
