import  { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "@/pages/not-found-page";

const MentorDashboard = lazy(() => import("@/pages/mentors/mentor-dashboard"));
const Lessons = lazy(() => import("@/pages/mentors/lessons"));
const Availability = lazy(() => import("@/pages/mentors/availability/availability"));
const StudentsList = lazy(() => import("@/pages/mentors/students-list/students-list"));
const MentorProfile = lazy(() => import("@/pages/mentors/profile/mentor-profile"));
const EditMentorProfile = lazy(() => import("@/pages/mentors/profile/edit-mentor-profile"));
const SubmitVideo = lazy(() => import("@/pages/mentors/profile/submit-video/submit-video"));
const Submited = lazy(() => import("@/pages/mentors/profile/submit-video/submited"));

export default function MentorPages() {
	return (
		<Routes>
			<Route path={`manage-appointments`} element={<MentorDashboard />} />

			<Route exact path={`lesson-calendar`} element={<Lessons />} />

			<Route path={`availability`} element={<Availability />} />

			<Route path={`students-list/:id?`} element={<StudentsList />} />

			<Route path={`profile`} element={<MentorProfile />} />

			<Route path={`profile/edit`} element={<EditMentorProfile />} />

			<Route path={`profile/edit/submit-video`} element={<SubmitVideo />} />

			<Route
				path={`profile/edit/submit-videos/submited`}
				element={<Submited />}
			/>
			<Route element={<NotFoundPage />} />
		</Routes>
	);
}
