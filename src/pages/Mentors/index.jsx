import React from 'react';
import EditMentorProfile from './Profile/EditMentorProfile';
import SubmitVideo from './Profile/SubmitVideo/SubmitVideo';
import Submited from './Profile/SubmitVideo/Submited';
import StudentsList from './StudentsList/StudentsList';
import AvailabilitySettings from './Availiability/AvailabilitySettings';
import TutorCalendar from './Calendar';
import LessonInfo from './LessonInfo';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import TutorDashboard from './MentorDashboard';
import AvailabilityLayout from './Availiability';
import Layout from 'src/layouts/DashboardLayout';
import MentorProfile from './Profile/MentorProfile';

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
        <TutorCalendar />
      </Route>

      <Route path={`${path}/availability`}>
        <AvailabilityLayout />
      </Route>

      <Route path={`${path}/avail/settings`}>
        <AvailabilitySettings />
      </Route>

      <Route exact path={`${path}/lesson-calendar/lesson/:lessonID`}>
        <LessonInfo />
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
    </Switch>
  );
}
