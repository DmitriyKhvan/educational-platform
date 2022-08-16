/* eslint-disable import/first */
import React from 'react'
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  useHistory
} from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import configureStore from './store'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './assets/styles/global.scss'
// Authentication Path
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ForgotPasswordText from './pages/Auth/ForgotPasswordText'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'
import EmailVerifyText from './pages/Auth/EmailVerifyText'

// Common Dashboard
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'

// Tutor Path
import TutorCalendar from './pages/Tutors/Calendar'
import TutorPastLessons from './pages/Tutors/PastLessons'
import TutorStudentList from './pages/Tutors/StudentList'
import ApproveRequest from './pages/Tutors/ApproveRequest'
import StudentProfile from './pages/Profile/Tutors/Student'
import AvailabilityLayout from './pages/Tutors/Availiability'
import { PaymentLayout } from './pages/Tutors/Payment'
import TutorProfile from './pages/Profile/Tutors/Profile'

// Student Path
import StudentCalendar from './pages/Students/Calendar'
// import StudentMakeAppointments from './pages/Students/ScheduleLesson/ScheduleLessonSteps'
import ProfileLayout from './pages/Profile'
import StudentListAppointments from './pages/Students/ListAppointments'
import GroupLessons from './pages/Students/GroupLessons'
import FavouriteTutors from './pages/Students/FavoriteTutors'
import ClassMaterials from './pages/Students/ClassMaterials'
import ScheduleLesson from './pages/Students/ScheduleLesson'
import GroupScheduleLesson from './pages/Students/GroupLessons'
import ScheduleLessonSteps from './pages/Students/ScheduleLesson/ScheduleLessonSteps.js'
import { Packages } from './pages/Students/Packages'
import FAQ from './pages/FAQ'
import Support from './pages/Support'
import Feedback from './pages/Feedback'
import SubmitRequest from './pages/SubmitRequest'
import BookTrialLesson from './pages/Students/BookTrialLesson'
import TutorList from './pages/Admin/TutorList'
import StudentList from './pages/Admin/StudentList'
import Main from './pages/Admin/Main'
import AvailabilitySettings from './pages/Tutors/Availiability/AvailabilitySettings'

import NewTutorProfile from './pages/Profile/EditProfile'
const store = configureStore({})

require('react-big-calendar/lib/css/react-big-calendar.css')

function PrivateRoute({ component: Component, ...rest }) {
  const authed = useSelector(state => state.auth.authenticated)
  const history = useHistory()
  return (
    <Route
      {...rest}
      render={props =>
        authed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: history.location.pathname }
            }}
          />
        )
      }
    />
  )
}

function PublicRoute({ component: Component, ...rest }) {
  const authed = useSelector(state => state.auth.authenticated)

  return (
    <Route
      {...rest}
      render={props =>
        authed ? <Redirect to={`/dashboard`} /> : <Component {...props} />
      }
    />
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ReactNotifications />
        <div className='App'>
          <PrivateRoute path='/admin/main' component={Main} />
          <PrivateRoute path='/admin/tutor-list' component={TutorList} />
          <PrivateRoute path='/admin/student-list' component={StudentList} />
          <PrivateRoute
            path='/admin/schedule-new-lesson'
            component={ScheduleLessonSteps}
          />
          <PrivateRoute
            path='/admin/lesson-calendar'
            component={TutorCalendar}
          />

          <PublicRoute exact path='/' component={Login} />
          <PublicRoute path='/login' component={Login} />
          <PublicRoute path='/signup' component={Signup} />
          <PublicRoute path='/forgot-password' component={ForgotPassword} />
          <PublicRoute
            path='/forgot-password-guide'
            component={ForgotPasswordText}
          />
          <PublicRoute path='/reset-password' component={ResetPassword} />
          <PublicRoute path='/verify-email' component={VerifyEmail} />
          <PublicRoute path='/email-verify-guide' component={EmailVerifyText} />

          <PrivateRoute path='/dashboard' component={Dashboard} />

          <PrivateRoute
            path='/student/lesson-complete/:complete_appoint_id'
            component={StudentListAppointments}
          />
          <PrivateRoute
            path='/student/manage-lessons'
            component={StudentListAppointments}
          />
          <PrivateRoute
            path='/student/schedule-lesson/select/:id?'
            component={ScheduleLesson}
          />
          <PrivateRoute
            path='/student/schedule-lesson/group-select'
            component={GroupScheduleLesson}
          />
          <PrivateRoute
            exact
            path='/student/schedule-lesson'
            component={ScheduleLessonSteps}
          />
          <PrivateRoute
            exact
            path='/student/appointments'
            component={StudentListAppointments}
          />
          <PrivateRoute path='/student/packages' component={Packages} />
          <PrivateRoute
            path='/student/lesson-calendar'
            component={StudentCalendar}
          />
          <PrivateRoute path='/student/profile' component={ProfileLayout} />
          <PrivateRoute
            path='/student/group-lessons'
            component={GroupLessons}
          />
          <PrivateRoute
            path='/student/favorite-tutors'
            component={FavouriteTutors}
          />
          <PrivateRoute
            path='/student/class-materials'
            component={ClassMaterials}
          />
          <PrivateRoute
            path='/student/book-trial-lesson'
            component={BookTrialLesson}
          />
          <PrivateRoute path='/faq' component={FAQ} />
          <PrivateRoute path='/support' component={Support} />
          <PrivateRoute path='/feedback' component={Feedback} />
          <PrivateRoute path='/submit-request' component={SubmitRequest} />

          <PrivateRoute path='/approve-requests' component={ApproveRequest} />
          <PrivateRoute
            path='/tutor/manage-appointments'
            component={Dashboard}
          />
          <PrivateRoute
            path='/tutor/appointments-calendar'
            component={TutorCalendar}
          />
          <PrivateRoute
            path='/tutor/past-lessons'
            component={TutorPastLessons}
          />
          <PrivateRoute
            path='/tutor/availability'
            component={AvailabilityLayout}
          />
          <PrivateRoute
            path='/tutor/avail/settings'
            component={AvailabilitySettings}
          />
          <PrivateRoute path='/tutor/payment-page' component={PaymentLayout} />
          <PrivateRoute
            exact
            path='/tutor/students'
            component={TutorStudentList}
          />
          <PrivateRoute path='/tutor/students/:id' component={StudentProfile} />
          {/* <PrivateRoute path='/tutor/profile' component={ProfileLayout} /> */}
          <PrivateRoute
            path='/tutor/new-profile-page'
            component={NewTutorProfile}
          />
          <PrivateRoute path='/tutor/profile' component={TutorProfile} />
          <PrivateRoute path='/messages' component={Messages} />
        </div>
      </Router>
    </Provider>
  )
}

export default App
