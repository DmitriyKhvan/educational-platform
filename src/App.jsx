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

import Main from './pages/Admin/Main';
import StudentList from './pages/Admin/StudentList';
import TutorList from './pages/Admin/TutorList';
import EmailVerifyText from './newPages/Auth/EmailVerifyText';
import ForgotPassword from './newPages/Auth/ForgotPassword';
import ForgotPasswordText from './newPages/Auth/ForgotPasswordText';
import LessonInfo from './pages/Tutors/LessonInfo';
// Authentication Path
import Login from './newPages/Auth/Login';
import ResetPassword from './newPages/Auth/ResetPassword';
import VerifyEmail from './newPages/Auth/VerifyEmail';
// Common Dashboard
import Dashboard from './newPages/dashboard/Dashboard';
// import Messages from './pages/Messages';
import { ProfileLayout } from './newPages/profile/ProfileLayout';
import ApproveRequest from './pages/Tutors/ApproveRequest';
import AvailabilityLayout from './pages/Tutors/Availiability';
import AvailabilitySettings from './pages/Tutors/Availiability/AvailabilitySettings';
// Tutor Path
import TutorCalendar from './pages/Tutors/Calendar';
import TutorPastLessons from './pages/Tutors/PastLessons';
import { PaymentLayout } from './pages/Tutors/Payment';
import TutorStudentList from './pages/Tutors/StudentList';
import configureStore from './store';

import './App.scss';
import { ToastContainer } from 'react-toastify';

// TUTORS PAGES

import * as TutorsPages from './newPages/profile/Tutors/export';

// STUDENT PAGES

import { IsReferal } from './newPages/profile/student/export';
import Loader from './components/Loader/Loader';
import StudentsList from './newPages/students-list/StudentsList';

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

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized && user.isActive ? (
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
        <div className="App">
          <PrivateRoute path="/admin/main" component={Main} />
          <PrivateRoute path="/admin/tutor-list" component={TutorList} />
          <PrivateRoute path="/admin/student-list" component={StudentList} />
          {/* <PrivateRoute
            path="/admin/schedule-new-lesson"
            component={ScheduleLessonSteps}
          /> */}
          <PrivateRoute
            path="/admin/lesson-calendar"
            component={TutorCalendar}
          />
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
          <PrivateRoute path="/dashboard" component={Dashboard} />

          <PrivateRoute path="/approve-requests" component={ApproveRequest} />

          <PublicRoute path="/referral/:referalcode" component={IsReferal} />

          {/* PROFILE */}

          <PrivateRoute
            path="/:mode(student|tutor)/profile"
            component={ProfileLayout}
          />

          {/* STUDENT PAGES */}

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
          </Suspense>

          {/* TUTORS PAGES */}

          <PrivateRoute
            path="/tutor/manage-appointments"
            component={Dashboard}
          />

          <PrivateRoute
            exact
            path="/tutor/appointments-calendar"
            component={TutorCalendar}
          />

          <PrivateRoute
            path="/tutor/past-lessons"
            component={TutorPastLessons}
          />

          <PrivateRoute
            path="/tutor/availability"
            component={AvailabilityLayout}
          />

          <PrivateRoute
            path="/tutor/avail/settings"
            component={AvailabilitySettings}
          />

          <PrivateRoute path="/tutor/payment-page" component={PaymentLayout} />

          <PrivateRoute
            exact
            path="/tutor/students"
            component={TutorStudentList}
          />

          <PrivateRoute
            exact
            path="/tutor/appointments-calendar/lesson/:lessonID"
            component={LessonInfo}
          />

          <PrivateRoute
            path="/tutor/students-list/:id?"
            component={StudentsList}
          />

          <PrivateRoute
            path="/tutor/edit-profile"
            component={TutorsPages.EditTutorProfile}
          />

          <PrivateRoute
            path="/tutor/edit-profiles/submit-video"
            component={TutorsPages.SubmitVideo}
          />

          <PrivateRoute
            path="/tutor/edit-profiles/submit-videos/submited"
            component={TutorsPages.Submited}
          />

          {/* <PrivateRoute path="/messages" component={TutorsPages.Messanger} /> */}
        </div>
      </Router>
      <ToastContainer />
    </Provider>
  );
}

export default App;
