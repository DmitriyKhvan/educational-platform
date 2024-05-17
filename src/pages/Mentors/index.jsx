import React, { lazy } from 'react';
import { Switch, useRouteMatch, Route } from 'react-router-dom';

const MentorDashboard = lazy(() => import('./MentorDashboard'));
const Lessons = lazy(() => import('./Lessons'));
const Availability = lazy(() => import('./Availiability'));
const StudentsList = lazy(() => import('./StudentsList/StudentsList'));
const MentorProfile = lazy(() => import('./Profile/MentorProfile'));
const EditMentorProfile = lazy(() => import('./Profile/EditMentorProfile'));
const SubmitVideo = lazy(() => import('./Profile/SubmitVideo/SubmitVideo'));
const Submited = lazy(() => import('./Profile/SubmitVideo/Submited'));
const ErrorPage = lazy(() => import('../ErrorPage'));

export default function MentorPages() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/manage-appointments`} component={MentorDashboard} />

      <Route exact path={`${path}/lesson-calendar`} component={Lessons} />

      <Route path={`${path}/availability`} component={Availability} />

      <Route path={`${path}/students-list/:id?`} component={StudentsList} />

      <Route path={`${path}/profile`} component={MentorProfile} />

      <Route path={`${path}/edit-profile`} component={EditMentorProfile} />

      <Route
        path={`${path}/edit-profiles/submit-video`}
        component={SubmitVideo}
      />

      <Route
        path={`${path}/edit-profiles/submit-videos/submited`}
        component={Submited}
      />
      <Route component={ErrorPage} />
    </Switch>
  );
}
