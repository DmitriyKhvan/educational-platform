import 'react-notifications-component/dist/theme.css';
import './assets/styles/global.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
/* eslint-disable import/first */
import React, { lazy, Suspense } from 'react';

import { ReactNotifications } from 'react-notifications-component';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
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
import VerifyEmail from './pages/Auth/VerifyEmail';
// Common Dashboard
import Dashboard from './components/Dashboard';
import { ProfileLayout } from './components/profile/ProfileLayout';
import ApproveRequest from './pages/Mentors/ApproveRequest';
import configureStore from './store';
import './App.scss';
import { ToastContainer } from 'react-toastify';

import IsReferal from './pages/Students/Referal/isReferal';
import Loader from './components/Loader/Loader';
import Onboarding from './pages/Students/Onboarding';
import BuyPackage from './pages/Students/BuyPackage';
import StripePayment from './pages/Students/StripePayment';
import ConfirmPayment from './pages/ConfirmPayment';

const store = configureStore({});

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthorized } = useAuth();
  const history = useHistory();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: history.location.pathname },
            }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, ...rest }) {
  const { isAuthorized, user } = useAuth();

  function isSide() {
    return user?.mentor ? user?.mentor?.isActive : user?.isActive;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized && isSide() ? (
          <Redirect to={`/dashboard`} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

function App() {
  const { isAuthInProgress, isLoading } = useAuth();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  if (isLoading || isAuthInProgress) return <Loader height={'100vh'} />;

  return (
    <Provider store={store}>
      <Router>
        <ReactNotifications />
        <div className="App"></div>
        <PublicRoute exact path="/" component={Login} />
        <PublicRoute path="/forgot-password" component={ForgotPassword} />
        <PublicRoute
          path="/forgot-password-guide"
          component={ForgotPasswordText}
        />
        <PublicRoute path="/reset-password" component={ResetPassword} />
        <PublicRoute path="/welcome-set-password" component={ResetPassword} />
        <PublicRoute path="/verify-email" component={VerifyEmail} />
        <PublicRoute path="/email-verify-guide" component={EmailVerifyText} />
        <PublicRoute path="/onboarding" component={Onboarding} />
        <PrivateRoute
          path="/purchase/:packageId/payment/:clientSecret"
          exact
          component={StripePayment}
        />
        <PrivateRoute
          path="/purchase/:packageId/complete"
          exact
          component={ConfirmPayment}
        />
        <PrivateRoute exact path="/purchase/:packageId" component={BuyPackage} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/approve-requests" component={ApproveRequest} />

        <PublicRoute path="/referral/:referalcode" component={IsReferal} />
        <PrivateRoute
          path="/:mode(stud|mentor)/profile"
          component={ProfileLayout}
        />

        <Suspense
          fallback={
            <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
              <Loader />
            </div>
          }
        >
          <PrivateRoute
            path="/student"
            component={lazy(() => import('./pages/Students'))}
          />
          <PrivateRoute
            path="/mentor"
            component={lazy(() => import('./pages/Mentors'))}
          />
        </Suspense>
      </Router>
      <ToastContainer />
    </Provider>
  );
}

export default App;
