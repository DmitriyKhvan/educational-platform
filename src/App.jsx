import 'react-notifications-component/dist/theme.css';
import './assets/styles/global.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
/* eslint-disable import/first */
import React, { Suspense, lazy } from 'react';

import { ReactNotifications } from 'react-notifications-component';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';

import { useAuth } from './modules/auth';

import EmailVerifyText from './pages/Auth/EmailVerifyText';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ForgotPasswordText from './pages/Auth/ForgotPasswordText';
// Authentication Path
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import ApproveRequest from './pages/Mentors/ApproveRequest/ApproveRequest';
import './App.scss';

import { Toaster } from 'react-hot-toast';

import IsReferal from './pages/Students/Referal/isReferal';
import Loader from './components/Loader/Loader';
import Onboarding from './pages/Students/Onboarding';
import StripePayment from './pages/Students/StripePayment';
import ConfirmPayment from './pages/ConfirmPayment';
import { NicePayment } from './pages/Students/NicePayment';
import { SelectProfile } from './pages/Auth/SelectProfile/SelectProfile';
import { getItemToLocalStorage, Roles } from './constants/global';
import { AddStudentProfile } from './pages/Auth/SelectProfile/AddProfile';
import { ErrorPage } from './pages/ErrorPage';

function PrivateRoute({ component: Component, role, ...rest }) {
  const { user } = useAuth();
  const history = useHistory();

  if (user && process.env.REACT_APP_PRODUCTION === 'false') {
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
}

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
}

function App() {
  const { isAuthInProgress } = useAuth();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  if (isAuthInProgress) return <Loader height={'100vh'} />;

  return (
    <>
      <Router>
        <ReactNotifications />
        <div className="App"></div>
        <Suspense
          fallback={
            <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
              <Loader />
            </div>
          }
        >
          <Switch>
            <PublicRoute exact path="/" component={Login} />
            <PublicRoute path="/forgot-password" component={ForgotPassword} />
            <PublicRoute
              path="/forgot-password-guide"
              component={ForgotPasswordText}
            />
            <PublicRoute path="/reset-password" component={ResetPassword} />
            <PublicRoute
              path="/welcome-set-password"
              component={ResetPassword}
            />
            <PublicRoute
              path="/email-verify-guide"
              component={EmailVerifyText}
            />
            <PublicRoute path="/onboarding" component={Onboarding} />

            <PublicRoute path="/referral/:referalcode" component={IsReferal} />

            <PrivateRoute
              role="student_parent"
              exact
              path="/add-student-profile"
              component={AddStudentProfile}
            />

            <PrivateRoute
              role="student_parent"
              exact
              path="/purchase/nice-payment"
              component={NicePayment}
            />

            <PrivateRoute
              role="student_parent"
              exact
              path="/purchase"
              // component={BuyPackage}
              component={lazy(() => import('./pages/Students/BuyPackage'))}
            />

            <PrivateRoute
              role="student_parent"
              exact
              path="/purchase/:packageId/complete"
              component={ConfirmPayment}
            />

            <PrivateRoute
              role="student_parent"
              exact
              path="/purchase/:packageId/payment/:clientSecret"
              component={StripePayment}
            />

            <PrivateRoute
              role="student_parent"
              path="/select-profile"
              component={SelectProfile}
            />

            <PrivateRoute
              role="mentor"
              path="/approve-requests"
              component={ApproveRequest}
            />

            <PrivateRoute
              role={Roles.STUDENT}
              path="/student"
              component={lazy(() => import('./pages/Students'))}
            />
            <PrivateRoute
              role="mentor"
              path="/mentor"
              component={lazy(() => import('./pages/Mentors'))}
            />

            <Route component={ErrorPage} />
          </Switch>
        </Suspense>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
