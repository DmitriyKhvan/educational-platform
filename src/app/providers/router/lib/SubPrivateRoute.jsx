import { Redirect, Route } from 'react-router-dom';
import { useAuth } from 'src/modules/auth';

export const SubPrivateRoute = ({ component: Component, isTrial, ...rest }) => {
  const { currentStudent } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentStudent?.isTrial !== isTrial ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '',
            }}
          />
        );
      }}
    />
  );
};
