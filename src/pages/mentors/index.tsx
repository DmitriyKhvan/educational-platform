import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../not-found-page";

const MentorDashboard = lazy(() => import("./mentor-dashboard"));
const Lessons = lazy(() => import("./lessons"));
const Availability = lazy(() => import("./availiability"));
const StudentsList = lazy(() => import("./students-list/students-list"));
const MentorProfile = lazy(() => import("./profile/mentor-profile"));
const EditMentorProfile = lazy(() => import("./profile/edit-mentor-profile"));
const SubmitVideo = lazy(() => import("./profile/submit-video/submit-video"));
const Submited = lazy(() => import("./profile/submit-video/submited"));

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
