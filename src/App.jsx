import 'react-notifications-component/dist/theme.css'
import './assets/styles/global.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css'

/* eslint-disable import/first */
import React from 'react'

import { ReactNotifications } from 'react-notifications-component'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  useHistory
} from 'react-router-dom'

import { useAuth } from './modules/auth'

import Main from './pages/Admin/Main'
import StudentList from './pages/Admin/StudentList'
import TutorList from './pages/Admin/TutorList'
import EmailVerifyText from './newPages/Auth/EmailVerifyText'
import ForgotPassword from './newPages/Auth/ForgotPassword'
import ForgotPasswordText from './newPages/Auth/ForgotPasswordText'
import LessonInfo from './pages/Tutors/LessonInfo'
// Authentication Path
import Login from './newPages/Auth/Login'
import ResetPassword from './newPages/Auth/ResetPassword'
import Signup from './newPages/Auth/Signup'
import VerifyEmail from './newPages/Auth/VerifyEmail'
// Common Dashboard
import Dashboard from './newPages/dashboard/Dashboard'
// import Messages from './pages/Messages';
import { ProfileLayout } from './newPages/profile/ProfileLayout'
import BookTrialLesson from './pages/Students/BookTrialLesson'
// Student Path
import StudentCalendar from './pages/Students/Calendar'
import ClassMaterials from './pages/Students/ClassMaterials'
import FavouriteTutors from './pages/Students/FavoriteTutors'
import GroupLessons from './pages/Students/GroupLessons'
import GroupScheduleLesson from './pages/Students/GroupLessons'
import StudentListAppointments from './newPages/dashboard/student/StudentDashboard'
import { Packages } from './pages/Students/Packages'
import ScheduleLesson from './pages/Students/ScheduleLesson'
import ScheduleLessonSteps from './pages/Students/ScheduleLesson/ScheduleLessonSteps'
import ApproveRequest from './pages/Tutors/ApproveRequest'
import AvailabilityLayout from './pages/Tutors/Availiability'
import AvailabilitySettings from './pages/Tutors/Availiability/AvailabilitySettings'
// Tutor Path
import TutorCalendar from './pages/Tutors/Calendar'
import TutorPastLessons from './pages/Tutors/PastLessons'
import { PaymentLayout } from './pages/Tutors/Payment'
import TutorStudentList from './pages/Tutors/StudentList'
import configureStore from './store'

import './App.scss'
import { ToastContainer } from 'react-toastify'

// TUTORS PAGES

import * as TutorsPages from './newPages/profile/Tutors/export'

// STUDENT PAGES

import * as StudentPages from './newPages/profile/student/export'
import Loader from './components/Loader/Loader'
import StudentsList from './newPages/students-list/StudentsList'

const store = configureStore({})

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthorized } = useAuth()
  const history = useHistory()

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized ? (
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
  const { isAuthorized } = useAuth()

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized ? <Redirect to={`/dashboard`} /> : <Component {...props} />
      }
    />
  )
}

function App() {
  const { isAuthInProgress, isAuthorized, isLoading, user } = useAuth()

  React.useEffect(() => {
    window.scrollTo({
      top: 0
    })
  })

  if (isLoading || isAuthInProgress) return <Loader height={'100vh'} />

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

          <PrivateRoute path='/approve-requests' component={ApproveRequest} />
          <PrivateRoute
            path='/tutor/manage-appointments'
            component={Dashboard}
          />
          <PrivateRoute
            exact
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
          {/* <PrivateRoute path='/tutor/students/:id' component={StudentProfile} /> */}
          {/* <PrivateRoute path='/tutor/profile' component={ProfileLayout} /> */}
          {/* <PrivateRoute
            path='/tutor/new-profile-page'
            component={NewTutorProfile}
          /> */}

          <PrivateRoute
            exact
            path='/tutor/appointments-calendar/lesson/:lessonID'
            component={LessonInfo}
          />

          {/* PROFILE */}

          <PrivateRoute
            path='/:mode(student|tutor)/profile'
            component={ProfileLayout}
          />

          {/* STUDENT PAGES */}

          <PrivateRoute
            path='/student/profiles/edit-topics'
            component={StudentPages.EditTopics}
          />

          <PrivateRoute
            path='/student/profiles/edit-information'
            component={StudentPages.EditProflileStudent}
          />

          <PublicRoute
            path='/referral/:referalcode'
            component={StudentPages.IsReferal}
          />

          <PrivateRoute
            path='/student/referal'
            component={StudentPages.Referal}
          />

          <PrivateRoute
            path='/student/mentors-list/:id?'
            component={StudentPages.Mentors}
          />

          <PrivateRoute
            path='/tutor/students-list/:id?'
            component={StudentsList}
          />

          {/* TUTORS PAGES */}

          <PrivateRoute
            path='/tutor/edit-profile'
            component={TutorsPages.EditTutorProfile}
          />
          <PrivateRoute
            path='/tutor/edit-profiles/submit-video'
            component={TutorsPages.SubmitVideo}
          />
          <PrivateRoute
            path='/tutor/edit-profiles/submit-videos/submited'
            component={TutorsPages.Submited}
          />
          <PrivateRoute path='/messages' component={TutorsPages.Messanger} />
        </div>
      </Router>
      <ToastContainer />
    </Provider>
  )
}

export default App
