import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from 'src/components/Loader/Loader';
import { useAuth } from 'src/modules/auth';
import { PrivateRoute, PublicRoute } from '../../router';
import { Roles } from 'src/constants/global';

import 'src/assets/styles/global.scss';

const Login = lazy(() => import('src/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('src/pages/Auth/ForgotPassword'));
const ForgotPasswordText = lazy(
  () => import('src/pages/Auth/ForgotPasswordText'),
);
const ResetPassword = lazy(() => import('src/pages/Auth/ResetPassword'));
const Onboarding = lazy(() => import('src/pages/Students/Onboarding'));
const TrialMarketingChannel = lazy(
  () => import('src/pages/TrialMarketingChannel'),
);
const Trial = lazy(() => import('src/pages/Students/Trial'));
const IsReferal = lazy(() => import('src/pages/Students/Referal/isReferal'));
const AddStudentProfile = lazy(
  () => import('src/pages/Auth/SelectProfile/AddProfile'),
);
const NicePayment = lazy(() => import('src/pages/Students/NicePayment'));
const BuyPackage = lazy(() => import('src/pages/Students/BuyPackage'));
const ConfirmPayment = lazy(() => import('src/pages/ConfirmPayment'));
const StripePayment = lazy(() => import('src/pages/Students/StripePayment'));
const SelectProfile = lazy(() => import('src/components/SelectProfile'));
const ErrorPage = lazy(() => import('src/pages/ErrorPage'));
const StudentPages = lazy(() => import('src/pages/Students'));
const MentorPages = lazy(() => import('src/pages/Mentors'));

export const AppRouter = () => {
  const { isLoading } = useAuth();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  if (isLoading) return <Loader height={'100vh'} />;

  return (
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
        <PublicRoute path="/welcome-set-password" component={ResetPassword} />

        <PublicRoute path="/onboarding" component={Onboarding} />
        <PublicRoute exact path="/trial" component={Trial} />
        <PublicRoute
          exact
          path="/trial/thank-you"
          component={TrialMarketingChannel}
        />

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
          component={StudentPages}
        />
        <PrivateRoute
          role={Roles.MENTOR}
          path="/mentor"
          component={MentorPages}
        />

        <Route component={ErrorPage} />
      </Switch>
    </Suspense>
  );
};
