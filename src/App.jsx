import './assets/styles/global.scss';
/* eslint-disable import/first */
import React, { Suspense, lazy } from 'react';

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from 'react-router-dom';

import { useAuth } from './modules/auth';

import ForgotPassword from './pages/Auth/ForgotPassword';
import ForgotPasswordText from './pages/Auth/ForgotPasswordText';
// Authentication Path
import './App.scss';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';

import { Toaster } from 'react-hot-toast';

import Loader from './components/Loader/Loader';
import { Roles, getItemToLocalStorage } from './constants/global';
import { AddStudentProfile } from './pages/Auth/SelectProfile/AddProfile';
import { SelectProfile } from './pages/Auth/SelectProfile/SelectProfile';
import ConfirmPayment from './pages/ConfirmPayment';
import { ErrorPage } from './pages/ErrorPage';
import { NicePayment } from './pages/Students/NicePayment';
import Onboarding from './pages/Students/Onboarding';
import IsReferal from './pages/Students/Referal/isReferal';
import StripePayment from './pages/Students/StripePayment';
import Trial from './pages/Students/Trial';

const TrialMarketingChannel = lazy(() =>
  import('src/pages/TrialMarketingChannel'),
);
const BuyPackage = lazy(() => import('src/pages/Students/BuyPackage'));

function PrivateRoute({ component: Component, role, ...rest }) {
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
  const { isLoading } = useAuth();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  if (isLoading) return <Loader height={'100vh'} />;
  return (
    <>
      <Router>
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

            <PublicRoute path="/onboarding" component={Onboarding} />
            <PublicRoute exact path="/trial" component={Trial} />
            <PublicRoute
              exact
              path="/trial/thank-you"
              component={TrialMarketingChannel}
            />

            <PublicRoute path="/referral/:referralcode" component={IsReferal} />

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
