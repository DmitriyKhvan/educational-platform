import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/loader/loader';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoginRoute } from '@/app/providers/router/lib/login-route';
import { MentorRoute } from '@/app/providers/router/lib/mentor-route';
import { StudentRoute } from '@/app/providers/router/lib/student-route';
import NotFoundPage from '@/pages/not-found-page';
import { Layout, OnboardingLayout } from '@/shared/layouts';

const Login = lazy(() => import('@/pages/auth/login'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));

const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));
const Onboarding = lazy(() => import('@/pages/students/on-boarding'));
const TrialMarketingChannel = lazy(() => import('@/pages/trial-marketing-channel'));
const Trial = lazy(() => import('@/pages/students/trial'));
const IsReferal = lazy(() => import('@/pages/students/referal'));

const AddStudentProfile = lazy(() => import('@/pages/auth/select-profile/add-profile'));
const BuyPackage = lazy(() => import('@/pages/students/buy-package'));
const ConfirmPayment = lazy(() => import('@/pages/confirm-payment'));
const StripePayment = lazy(() => import('@/pages/students/stripe-payment'));
const SelectProfile = lazy(() => import('@/components/select-profile'));
const StudentPages = lazy(() => import('@/pages/students'));
const MentorPages = lazy(() => import('@/pages/mentors'));

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
      <Route path="/" element={<OnboardingLayout />}>
        <Route
          index
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/welcome-set-password" element={<ResetPassword />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/trial/thank-you" element={<TrialMarketingChannel />} />
      </Route>

      <Route
        path="/referral/:referralcode"
        element={
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen w-full">
                <Loader height="100vh" />
              </div>
            }
          >
            <IsReferal />
          </Suspense>
        }
      />

      <Route
        path="/"
        element={
          <StudentRoute>
            <OnboardingLayout />
          </StudentRoute>
        }
      >
        <Route path="/add-student-profile" element={<AddStudentProfile />} />

        <Route path="/purchase" element={<BuyPackage />} />

        <Route path="/purchase/:packageId/complete" element={<ConfirmPayment />} />

        <Route path="/purchase/:packageId/payment/:clientSecret" element={<StripePayment />} />

        <Route path="/select-profile" element={<SelectProfile />} />
      </Route>

      <Route
        path="/"
        element={
          <StudentRoute>
            <Layout />
          </StudentRoute>
        }
      >
        <Route path="student/*" element={<StudentPages />} />
      </Route>

      <Route
        path="/"
        element={
          <MentorRoute>
            <Layout />
          </MentorRoute>
        }
      >
        <Route path="mentor/*" element={<MentorPages />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
