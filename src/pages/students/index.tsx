import { TrialRoute } from '@/app/providers/router';
import NotFoundPage from '@/pages/not-found-page';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const StudentDashboard = lazy(() => import('@/pages/students/student-dashboard'));
const ScheduleLesson = lazy(() => import('@/pages/students/schedule-lesson'));

const Mentors = lazy(() => import('@/pages/students/mentors-list'));
const Subscriptions = lazy(() => import('@/pages/students/subscriptions/subscriptions'));
const Lessons = lazy(() => import('@/pages/students/lessons'));
const Feedback = lazy(() => import('@/pages/students/feedback'));
const StudentProfile = lazy(() => import('@/pages/students/profile/profile/student-profile'));
const EditProfileStudent = lazy(
  () => import('@/pages/students/profile/edit-info/edit-student-profile'),
);
export default function StudentRoutes() {
  return (
    <Routes>
      <Route path={'manage-lessons'} element={<StudentDashboard />} />
      <Route
        path="schedule-lesson/select/:id?"
        element={
          <TrialRoute>
            <ScheduleLesson />
          </TrialRoute>
        }
      />
      <Route path={'lesson-calendar'} element={<Lessons />} />

      <Route path={'lesson-calendar/feedback/:id'} element={<Feedback />} />

      <Route path={'profile'} element={<StudentProfile />} />
      <Route path={'profile/edit'} element={<EditProfileStudent />} />

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
