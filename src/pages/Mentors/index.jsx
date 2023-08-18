import React from 'react';
import EditMentorProfile from './Profile/EditMentorProfile';
import SubmitVideo from './Profile/SubmitVideo/SubmitVideo';
import Submited from './Profile/SubmitVideo/Submited';
import StudentsList from './StudentsList/StudentsList';
import AvailabilityLayout from './Availiability';
import AvailabilitySettings from './Availiability/AvailabilitySettings';
import TutorCalendar from './Calendar';
import LessonInfo from './LessonInfo';
import Dashboard from '../../components/Dashboard.jsx';
import { Switch, useRouteMatch, Route } from 'react-router-dom';

export default function TutorPages() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/manage-appointments`}>
        <Dashboard />
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
