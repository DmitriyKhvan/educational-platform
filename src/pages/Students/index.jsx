import { lazy } from 'react';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import { SubPrivateRoute } from 'src/app/providers/router/lib/SubPrivateRoute';

const StudentListAppointments = lazy(() => import('./StudentDashboard'));
const ScheduleLesson = lazy(() => import('./ScheduleLesson'));
const Profile = lazy(() => import('./Profile'));
const Referal = lazy(() => import('./Referal/Referal'));
const Mentors = lazy(() => import('./MentorsList/Mentors'));
const Subscriptions = lazy(() => import('./Subscriptions/Subscriptions'));
const Lessons = lazy(() => import('./Lessons'));
const ErrorPage = lazy(() => import('../ErrorPage'));

export default function StudentRoutes() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      {/* <Route path={`${path}/lesson-complete/:complete_appoint_id`}>
        <StudentListAppointments />
      </Route> */}

      <Route
        path={`${path}/manage-lessons`}
        component={StudentListAppointments}
      />

      <SubPrivateRoute
        exact
        path={`${path}/schedule-lesson/select/:id?`}
        component={ScheduleLesson}
      />

      <Route
        exact
        path={`${path}/appointments`}
        component={StudentListAppointments}
      />

      <Route path={`${path}/lesson-calendar`} component={Lessons} />

      <Route path={`${path}/profile`} component={Profile} />

      <Route path={`${path}/referal`} component={Referal} />

      <SubPrivateRoute
        isTrial={true}
        exact
        path={`${path}/mentors-list/:id?`}
        component={Mentors}
      />

      <Route path={`${path}/subscriptions`} component={Subscriptions} />
      <Route component={ErrorPage} />
    </Switch>
  );
}
