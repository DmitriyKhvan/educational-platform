import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { useAuth } from 'src/app/providers/AuthProvider';
import Loader from 'src/components/Loader/Loader';

import { useTranslation } from 'react-i18next';
import { useCurrentLang } from 'src/entities/LangSwitcher';
import NotFoundPage from 'src/pages/NotFoundPage';
import {
  languagesDic,
  setItemToLocalStorage,
} from 'src/shared/constants/global';
import { Layout, OnboardingLayout } from 'src/shared/layouts';
import { MentorRoute, StudentRoute } from '..';
import { LoginRoute } from '../lib/LoginRoute';

const Login = lazy(() => import('src/pages/Auth/Login'));
const ForgotPassword = lazy(() => import('src/pages/Auth/ForgotPassword'));

const ResetPassword = lazy(() => import('src/pages/Auth/ResetPassword'));
const Onboarding = lazy(() => import('src/pages/Students/Onboarding'));
const TrialMarketingChannel = lazy(
  () => import('src/pages/TrialMarketingChannel'),
);
const Trial = lazy(() => import('src/pages/Students/Trial'));
const IsReferal = lazy(() => import('src/pages/Students/Referal'));

const AddStudentProfile = lazy(
  () => import('src/pages/Auth/SelectProfile/AddProfile'),
);
const BuyPackage = lazy(() => import('src/pages/Students/BuyPackage'));
const ConfirmPayment = lazy(() => import('src/pages/ConfirmPayment'));
const StripePayment = lazy(() => import('src/pages/Students/StripePayment'));
const SelectProfile = lazy(() => import('src/components/SelectProfile'));
const StudentPages = lazy(() => import('src/pages/Students'));
const MentorPages = lazy(() => import('src/pages/Mentors'));

export const AppRouter = () => {
  const { isLoading } = useAuth();

  // eslint-disable-next-line no-unused-vars
  const [_, i18n] = useTranslation('common');
  const currLang = useCurrentLang();
  console.log('🚀 ~ AppRouter ~ currLang:', currLang);

  const [searchParams] = useSearchParams();
  console.log('🚀 ~ AppRouter ~ searchParams:', searchParams);
  console.log('🚀 ~ AppRouter ~ searchParams:', searchParams.get('lang'));

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <should trigger only on searchParam>
  useEffect(() => {
    if (languagesDic.find((ld) => searchParams.get('lang') === ld.value)) {
      setItemToLocalStorage('language', searchParams.get('lang'));
      i18n.changeLanguage(searchParams.get('lang'));
    }
  }, [searchParams]);

  if (isLoading) return <Loader height={'100vh'} />;

  return (
    <Routes>
      <Route path="/" element={<OnboardingLayout />}>
        {/* <Route exact path="/" element={Login} /> */}
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
        <Route exact path="/trial" element={<Trial />} />
        <Route
          exact
          path="/trial/thank-you"
          element={<TrialMarketingChannel />}
        />
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
        <Route
          exact
          path="/add-student-profile"
          element={<AddStudentProfile />}
        />

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
