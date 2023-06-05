import { Switch, useRouteMatch, Route } from 'react-router-dom';
import BookTrialLesson from './BookTrialLesson';
// Student Path
import StudentCalendar from './Calendar';
import ClassMaterials from './ClassMaterials';
import FavouriteTutors from './FavoriteTutors';
import GroupScheduleLesson from './GroupLessons';
import StudentListAppointments from './StudentDashboard';
import { Packages } from './Packages';
import ScheduleLesson from './ScheduleLesson';
import EditTopics from './Profile/editTopics/EditTopics';
import EditProflileStudent from './Profile/editInfo/EditStudentProfile';
import ScheduleLessonSteps from './ScheduleLesson/ScheduleLessonSteps';
import Referal from './Referal/Referal';
import Mentors from './MentorsList/Mentors';

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

      <Route path={`${path}/schedule-lesson/group-select`}>
        <GroupScheduleLesson />
      </Route>

      <Route exact path={`${path}/schedule-lesson`}>
        <ScheduleLessonSteps />
      </Route>

      <Route exact path={`${path}/appointments`}>
        <StudentListAppointments />
      </Route>

      <Route path={`${path}/packages`}>
        <Packages />
      </Route>

      <Route path={`${path}/lesson-calendar`}>
        <StudentCalendar />
      </Route>

      <Route path={`${path}/favorite-tutors`}>
        <FavouriteTutors />
      </Route>

      <Route path={`${path}/class-materials`}>
        <ClassMaterials />
      </Route>

      <Route path={`${path}/book-trial-lesson`}>
        <BookTrialLesson />
      </Route>

      <Route path={`${path}/profiles/edit-topics`}>
        <EditTopics />
      </Route>

      <Route path={`${path}/profiles/edit-information`}>
        <EditProflileStudent />
      </Route>

      <Route path={`${path}/referal`}>
        <Referal />
      </Route>

      <Route path={`${path}/mentors-list/:id?`}>
        <Mentors />
      </Route>
    </Switch>
  );
}
