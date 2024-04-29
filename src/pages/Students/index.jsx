import { Switch, useRouteMatch, Route, Redirect } from 'react-router-dom';
import ClassMaterials from './ClassMaterials';
import StudentListAppointments from './StudentDashboard';
import ScheduleLesson from './ScheduleLesson';
import Profile from './Profile';
import ScheduleLessonSteps from './ScheduleLesson/ScheduleLessonSteps';
import Referal from './Referal/Referal';
import Mentors from './MentorsList/Mentors';
import Subscriptions from './Subscriptions/Subscriptions';
import Lessons from './Lessons';
import { useAuth } from 'src/modules/auth';
import { ErrorPage } from '../ErrorPage';

function SubPrivateRoute({ component: Component, isTrial, ...rest }) {
  const { currentStudent } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentStudent?.isTrial !== isTrial ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '',
            }}
          />
        );
      }}
    />
  );
}

export default function StudentRoutes() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/lesson-complete/:complete_appoint_id`}>
        <StudentListAppointments />
      </Route>

      <Route path={`${path}/manage-lessons`}>
        <StudentListAppointments />
      </Route>

      <SubPrivateRoute
        // isTrial={true}
        exact
        path={`${path}/schedule-lesson/select/:id?`}
        component={ScheduleLesson}
      />

      {/* <Route path={`${path}/schedule-lesson/group-select`}>
        <GroupScheduleLesson />
      </Route> */}

      <Route exact path={`${path}/schedule-lesson`}>
        <ScheduleLessonSteps />
      </Route>

      <Route exact path={`${path}/appointments`}>
        <StudentListAppointments />
      </Route>

      <Route path={`${path}/lesson-calendar`}>
        <Lessons />
      </Route>

      <Route path={`${path}/class-materials`}>
        <ClassMaterials />
      </Route>

      <Route path={`${path}/profile`}>
        <Profile />
      </Route>

      <Route path={`${path}/referal`}>
        <Referal />
      </Route>

      <SubPrivateRoute
        isTrial={true}
        exact
        path={`${path}/mentors-list/:id?`}
        component={Mentors}
      />

      <Route path={`${path}/subscriptions`}>
        <Subscriptions />
      </Route>
      <Route component={ErrorPage} />
    </Switch>
  );
}
