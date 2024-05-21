import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const MentorDashboard = lazy(() => import('./MentorDashboard'));
const Lessons = lazy(() => import('./Lessons'));
const Availability = lazy(() => import('./Availiability'));
const StudentsList = lazy(() => import('./StudentsList/StudentsList'));
const MentorProfile = lazy(() => import('./Profile/MentorProfile'));
const EditMentorProfile = lazy(() => import('./Profile/EditMentorProfile'));
const SubmitVideo = lazy(() => import('./Profile/SubmitVideo/SubmitVideo'));
const Submited = lazy(() => import('./Profile/SubmitVideo/Submited'));
// const ErrorPage = lazy(() => import('../ErrorPage'));

export default function MentorPages() {
  return (
    <Routes>
      <Route path={`manage-appointments`} element={<MentorDashboard />} />

      <Route exact path={`lesson-calendar`} element={<Lessons />} />

      <Route path={`availability`} element={<Availability />} />

      <Route path={`students-list/:id?`} element={<StudentsList />} />

      <Route path={`profile`} element={<MentorProfile />} />

      <Route path={`edit-profile`} element={<EditMentorProfile />} />

      <Route path={`edit-profiles/submit-video`} element={<SubmitVideo />} />

      <Route
        path={`edit-profiles/submit-videos/submited`}
        element={<Submited />}
      />
      {/* <Route element={<ErrorPage />} /> */}
    </Routes>
  );
}
