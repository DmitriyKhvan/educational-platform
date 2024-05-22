import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from 'src/components/Loader/Loader';
import { useAuth } from 'src/modules/auth';

import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import Layout from 'src/layouts/DashboardLayout';

import 'src/assets/styles/global.scss';
import { MentorRoute, StudentRoute } from '../../router';

const Login = lazy(() => import('src/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('src/pages/Auth/ForgotPassword'));

const ResetPassword = lazy(() => import('src/pages/Auth/ResetPassword'));
const Onboarding = lazy(() => import('src/pages/Students/Onboarding'));
const TrialMarketingChannel = lazy(
  () => import('src/pages/TrialMarketingChannel'),
);
const Trial = lazy(() => import('src/pages/Students/Trial'));

const AddStudentProfile = lazy(
  () => import('src/pages/Auth/SelectProfile/AddProfile'),
);
const NicePayment = lazy(() => import('src/pages/Students/NicePayment'));
const BuyPackage = lazy(() => import('src/pages/Students/BuyPackage'));
const ConfirmPayment = lazy(() => import('src/pages/ConfirmPayment'));
const StripePayment = lazy(() => import('src/pages/Students/StripePayment'));
const SelectProfile = lazy(() => import('src/components/SelectProfile'));
const IsReferal = lazy(() => import('src/pages/Students/Referal/isReferal'));
const StudentPages = lazy(() => import('src/pages/Students'));
const MentorPages = lazy(() => import('src/pages/Mentors'));
const ErrorPage = lazy(() => import('src/pages/ErrorPage'));

export const AppRouter = () => {
  const { isLoading } = useAuth();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  if (isLoading) return <Loader height={'100vh'} />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={
              <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                <Loader />
              </div>
            }
          >
            <OnboardingLayout />
          </Suspense>
        }
      >
        {/* <Route exact path="/" element={Login} /> */}
        <Route index element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/welcome-set-password" element={<ResetPassword />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route exact path="/trial" element={<Trial />} />
        <Route
          exact
          path="/trial/thank-you"
          element={<TrialMarketingChannel />}
        />
      </Route>

      <Route
        path="/"
        element={
          <StudentRoute>
            <Suspense
              fallback={
                <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                  <Loader />
                </div>
              }
            >
              <OnboardingLayout />
            </Suspense>
          </StudentRoute>
        }
      >
        <Route
          exact
          path="/add-student-profile"
          element={<AddStudentProfile />}
        />

        <Route exact path="/purchase/nice-payment" element={<NicePayment />} />

        <Route exact path="/purchase" element={<BuyPackage />} />

        <Route
          exact
          path="/purchase/:packageId/complete"
          element={<ConfirmPayment />}
        />

        <Route
          exact
          path="/purchase/:packageId/payment/:clientSecret"
          element={<StripePayment />}
        />

        <Route path="/select-profile" element={<SelectProfile />} />
      </Route>

      <Route
        path="/"
        element={
          <StudentRoute>
            <Suspense
              fallback={
                <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                  <Loader />
                </div>
              }
            >
              <Layout />
            </Suspense>
          </StudentRoute>
        }
      >
        <Route path="student/*" element={<StudentPages />} />
        <Route path="/referral/:referalcode" element={<IsReferal />} />
      </Route>

      <Route
        path="/"
        element={
          <MentorRoute>
            <Suspense
              fallback={
                <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                  <Loader />
                </div>
              }
            >
              <Layout />
            </Suspense>
          </MentorRoute>
        }
      >
        <Route path="mentor/*" element={<MentorPages />} />
      </Route>

      <Route
        path="*"
        element={
          <Suspense
            fallback={
              <div className="absolute z-10 top-0 left-0 flex justify-center items-center h-screen w-screen">
                <Loader />
              </div>
            }
          >
            <ErrorPage />
          </Suspense>
        }
      />
    </Routes>
  );
};
