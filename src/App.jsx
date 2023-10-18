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
// Common Dashboard
// import Dashboard from './components/Dashboard';
// import { ProfileLayout } from './components/profile/ProfileLayout';
import ApproveRequest from './pages/Mentors/ApproveRequest';
import './App.scss';

import { Toaster } from 'react-hot-toast';

import IsReferal from './pages/Students/Referal/isReferal';
import Loader from './components/Loader/Loader';
import Onboarding from './pages/Students/Onboarding';
import BuyPackage from './pages/Students/BuyPackage';
import StripePayment from './pages/Students/StripePayment';
import ConfirmPayment from './pages/ConfirmPayment';
import BuyPackageTest from './pages/Students/BuyPackageTest';
import { NicePayment } from './pages/Students/NicePayment';
import { SelectProfile } from './pages/Auth/SelectProfile/SelectProfile';
import { getItemToLocalStorage } from './constants/global';
import { AddStudentProfile } from './pages/Auth/SelectProfile/AddProfile';
import { ErrorPage } from './pages/ErrorPage';

function PrivateRoute({ component: Component, role, ...rest }) {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <Route
      {...rest}
      render={(props) => {
        return user?.role === 'mentor' && user?.role === role ? (
          <Component {...props} />
        ) : (user?.role === 'student' &&
            user?.role === role &&
            getItemToLocalStorage('studentId')) ||
          (user?.role === 'student' && role === 'student_parent') ? (
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
        <Switch>
          <PublicRoute exact path="/" component={Login} />
          <PublicRoute path="/forgot-password" component={ForgotPassword} />
          <PublicRoute
            path="/forgot-password-guide"
            component={ForgotPasswordText}
          />
          <PublicRoute path="/reset-password" component={ResetPassword} />
          <PublicRoute path="/welcome-set-password" component={ResetPassword} />
          <PublicRoute path="/email-verify-guide" component={EmailVerifyText} />
          <PublicRoute path="/onboarding" component={Onboarding} />

          <PublicRoute path="/d3gKtqEEDhJE5Z" component={BuyPackageTest} />

          <PublicRoute path="/referral/:referalcode" component={IsReferal} />
          {/* <PrivateRoute
          path="/:mode(stud|mentor)/profile"
          component={ProfileLayout}
        /> */}

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
            component={BuyPackage}
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

          <Suspense
            fallback={
              <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                <Loader />
              </div>
            }
          >
            <PrivateRoute
              role="student"
              path="/student"
              component={lazy(() => import('./pages/Students'))}
            />
            <PrivateRoute
              role="mentor"
              path="/mentor"
              component={lazy(() => import('./pages/Mentors'))}
            />
          </Suspense>

          <Route exact={true} path="/404">
            <ErrorPage />
          </Route>
          <Redirect to="/404" />
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
