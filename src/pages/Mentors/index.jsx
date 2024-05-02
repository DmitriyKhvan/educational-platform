import React from 'react';
import EditMentorProfile from './Profile/EditMentorProfile';
import SubmitVideo from './Profile/SubmitVideo/SubmitVideo';
import Submited from './Profile/SubmitVideo/Submited';
import StudentsList from './StudentsList/StudentsList';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import TutorDashboard from './MentorDashboard';
import Availability from './Availiability';
import Layout from 'src/layouts/DashboardLayout';
import MentorProfile from './Profile/MentorProfile';
import { ErrorPage } from '../ErrorPage';
import Lessons from './Lessons';

export default function TutorPages() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/manage-appointments`}>
        <Layout>
          <TutorDashboard />
        </Layout>
      </Route>

      <Route exact path={`${path}/lesson-calendar`}>
        <Lessons />
      </Route>

      <Route path={`${path}/availability`}>
        <Availability />
      </Route>

      <Route path={`${path}/students-list/:id?`}>
        <StudentsList />
      </Route>

      <Route path={`${path}/profile`}>
        <MentorProfile />
      </Route>

      <Route path={`${path}/edit-profile`}>
        <EditMentorProfile />
      </Route>

      <Route path={`${path}/edit-profiles/submit-video`}>
        <SubmitVideo />
      </Route>

      <Route path={`${path}/edit-profiles/submit-videos/submited`}>
        <Submited />
      </Route>
      <Route component={ErrorPage} />
    </Switch>
  );
}
