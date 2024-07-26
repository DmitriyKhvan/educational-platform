// import { Lessons, Feedback } from './Lessons';
// import { useAuth } from 'src/modules/auth';

import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { TrialRoute } from "src/app/providers/router";
import NotFoundPage from "../not-found-page";

const StudentDashboard = lazy(() => import("./student-dashboard"));
const ScheduleLesson = lazy(() => import("./ScheduleLesson"));

const Mentors = lazy(() => import("./mentors-list/mentors"));
const Subscriptions = lazy(() => import("./subscriptions/subscriptions"));
const Lessons = lazy(() => import("./lessons"));
const Feedback = lazy(() => import("./feedback"));
const StudentProfile = lazy(() => import("./profile/profile/student-profile"));
const EditProfileStudent = lazy(
	() => import("./profile/editInfo/EditStudentProfile"),
);

export default function StudentRoutes() {
	return (
		<Routes>
			{/* <Route path={`lesson-complete/:complete_appoint_id`}>
        <StudentListAppointments />
      </Route> */}

			<Route path={`manage-lessons`} element={<StudentDashboard />} />

			<Route
				path="schedule-lesson/select/:id?"
				element={
					<TrialRoute>
						<ScheduleLesson />
					</TrialRoute>
				}
			/>

			<Route path={`lesson-calendar`} exact element={<Lessons />} />

			<Route path={`lesson-calendar/feedback/:id`} element={<Feedback />} />

			{/* </Route> */}

			<Route exact path={`profile`} element={<StudentProfile />} />
			<Route path={`profile/edit`} element={<EditProfileStudent />} />

			<Route
				path="mentors-list/:id?"
				element={
					<TrialRoute>
						<Mentors />
					</TrialRoute>
				}
			/>

			<Route path={`subscriptions`} element={<Subscriptions />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}
