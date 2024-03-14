import { Switch, useRouteMatch, Route } from 'react-router-dom';
// Student Path
// import StudentCalendar from './Calendar';
import ClassMaterials from './ClassMaterials';
// import GroupScheduleLesson from './GroupLessons';
import StudentListAppointments from './StudentDashboard';
import ScheduleLesson from './ScheduleLesson';
import Profile from './Profile';
import ScheduleLessonSteps from './ScheduleLesson/ScheduleLessonSteps';
import Referal from './Referal/Referal';
import Mentors from './MentorsList/Mentors';
import Subscriptions from './Subscriptions/Subscriptions';
import LessonsList from './LessonsList';

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

      <Route path={`${path}/schedule-lesson/select/:id?`}>
        <ScheduleLesson />
      </Route>

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
        {/* <StudentCalendar /> */}
        <LessonsList />
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

      <Route path={`${path}/mentors-list/:id?`}>
        <Mentors />
      </Route>

      <Route path={`${path}/subscriptions`}>
        <Subscriptions />
      </Route>
    </Switch>
  );
}
