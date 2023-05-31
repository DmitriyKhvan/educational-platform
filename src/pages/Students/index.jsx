import { Switch, useRouteMatch, Route } from 'react-router-dom';
import BookTrialLesson from './BookTrialLesson';
// Student Path
import StudentCalendar from './Calendar';
import ClassMaterials from './ClassMaterials';
import FavouriteTutors from './FavoriteTutors';
import GroupLessons from './GroupLessons';
import GroupScheduleLesson from './GroupLessons';
import StudentListAppointments from '../../newPages/dashboard/student/StudentDashboard';
import { Packages } from './Packages';
import ScheduleLesson from './ScheduleLesson';
import * as StudentPages from '../../newPages/profile/student/export';
import ScheduleLessonSteps from './ScheduleLesson/ScheduleLessonSteps';

export default function StudentRoutes() {
  let { path, url } = useRouteMatch();

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

      <Route path={`${path}/group-lessons`}>
        <GroupLessons />
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
        <StudentPages.EditTopics />
      </Route>

      <Route path={`${path}/profiles/edit-information`}>
        <StudentPages.EditProflileStudent />
      </Route>

      <Route path={`${path}/referal`}>
        <StudentPages.Referal />
      </Route>

      <Route path={`${path}/mentors-list/:id?`}>
        <StudentPages.Mentors />
      </Route>
    </Switch>
  );
}
