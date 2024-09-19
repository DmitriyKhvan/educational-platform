// import { Lessons, Feedback } from './Lessons';
// import { useAuth } from 'src/modules/auth';

import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TrialRoute } from 'src/app/providers/router';
import NotFoundPage from '../NotFoundPage';

const StudentDashboard = lazy(() => import('./StudentDashboard'));
const ScheduleLesson = lazy(() => import('./ScheduleLesson'));

const Mentors = lazy(() => import('./MentorsList/Mentors'));
const Subscriptions = lazy(() => import('./Subscriptions/Subscriptions'));
const Lessons = lazy(() => import('./Lessons'));
const Feedback = lazy(() => import('./Feedback'));
const StudentProfile = lazy(() => import('./Profile/profile/StudentProfile'));
const EditProfileStudent = lazy(
  () => import('./Profile/editInfo/EditStudentProfile'),
);

export default function StudentRoutes() {
  return (
    <Routes>
      {/* <Route path={`lesson-complete/:complete_appoint_id`}>
        <StudentListAppointments />
      </Route> */}

      <Route path={`manage-lessons`} element={<StudentDashboard />} />

      <Route
        path="schedule-lesson/select/:id?"
        element={
          // <TrialRoute>
          <ScheduleLesson />
          // </TrialRoute>
        }
      />

      <Route path={`lesson-calendar`} exact element={<Lessons />} />

      <Route path={`lesson-calendar/feedback/:id`} element={<Feedback />} />

      {/* </Route> */}

      <Route exact path={`profile`} element={<StudentProfile />} />
      <Route path={`profile/edit`} element={<EditProfileStudent />} />

      <Route
        path="mentors-list/:id?"
        element={
          <TrialRoute>
            <Mentors />
          </TrialRoute>
        }
      />

      <Route path={`subscriptions`} element={<Subscriptions />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
