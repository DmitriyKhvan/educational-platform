import { useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { LESSON_QUERY } from "@/shared/apollo/graphql";
import SelectLesson from "@/pages/students/schedule-lesson/select-lesson";
import LessonConfirmation from "@/pages/students/schedule-lesson/lesson-confirmation";
import { ScheduleSelector } from "@/pages/students/schedule-lesson/schedule-selector";
import SelectMentorCards from "@/pages/students/schedule-lesson/select-mentor-cards";

import "@/app/styles/tutor.scss";
import { ScheduleProvider } from "@/pages/students/schedule-lesson/schedule-selector/schedule-provider"; 
import { AvailableTimes } from "@/pages/students/schedule-lesson/schedule-selector/available-times";

import { COMBINED_TIMESHEETS } from "@/shared/apollo/queries/combined-timesheets";
import { COMBINED_TIMESHEETS_TRIAL } from "@/shared/apollo/queries/trial/combined-time-sheets-for-trials";
import { useAuth } from "@/app/providers/auth-provider";
import ScheduleSuccess from "@/pages/students/schedule-lesson/schedule-success";
import type { Mentor } from "@/types/types.generated";

const ScheduleLesson = () => {
	const { currentStudent } = useAuth();
	const { id = null } = useParams();
	const location = useLocation();

	const { data, loading } = useQuery(LESSON_QUERY, {
		variables: { id },
		skip: !id,
	});

	const urlParams = new URLSearchParams(window.location.search);
	const [repeat, setRepeat] = useState<string>(
		JSON.parse(urlParams.get("repeatLessons") ?? "") ?? null,
	);

	const [clicked, setClicked] = useState(null);
	const [selectedPlan, setSelectedPlan] = useState({});
	const [schedule, setSchedule] = useState<string>("");
	const [tabIndex, setTabIndex] = useState(id ? 1 : 0);
	const [selectMentor, setSelectMentor] = useState<Mentor>();
	const [createdLessons, setCreatedLessons] = useState(null);

	const scheduledLesson = data?.lesson || null;

	useEffect(() => {
		if (data?.lesson) {
			setSelectedPlan(data?.lesson?.packageSubscription);
		}
	}, [data?.lesson]);

	if (loading) return null;

	return (
		<React.Fragment>
			{tabIndex === 0 && (
				<SelectLesson
					setSelectedPlan={setSelectedPlan}
					selectedPlan={selectedPlan}
					setTabIndex={setTabIndex}
					clicked={clicked}
					setClicked={setClicked}
				/>
			)}

			{(tabIndex === 1 || tabIndex === 2) && (
				<ScheduleProvider
					query={
						currentStudent?.isTrial
							? COMBINED_TIMESHEETS_TRIAL
							: COMBINED_TIMESHEETS
					}
					setTabIndex={setTabIndex}
					setSchedule={setSchedule}
					selectedMentor={location?.state?.mentor}
					setSelectMentor={  currentStudent?.isTrial ? setSelectMentor: undefined}
					duration={selectedPlan?.package?.sessionTime}
				>
					{tabIndex === 1 && <ScheduleSelector lesson={scheduledLesson} />}

					{tabIndex === 2 && <AvailableTimes />}
				</ScheduleProvider>
			)}

			{tabIndex === 3 &&
				!location?.state?.mentor &&
				!currentStudent?.isTrial && (
					<SelectMentorCards
						tabIndex={tabIndex}
						setTabIndex={setTabIndex}
						setSelectMentor={setSelectMentor}
						lesson={scheduledLesson}
						schedule={schedule}
						step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
					/>
				)}

			{(tabIndex === 4 ||
				(tabIndex === 3 && location?.state?.mentor) ||
				(tabIndex === 3 && currentStudent?.isTrial)) && (
				<LessonConfirmation
					plan={selectedPlan}
					time={schedule}
					mentor={selectMentor || location?.state?.mentor}
					isMentorScheduled={!!location?.state?.mentor}
					setTabIndex={setTabIndex}
					lesson={scheduledLesson}
					lessonId={id}
					setCreatedLessons={setCreatedLessons}
					setRepeat={setRepeat}
					repeat={repeat}
				/>
			)}

			{tabIndex === 5 && (
				<ScheduleSuccess
					repeat={repeat}
					setTabIndex={setTabIndex}
					lessons={createdLessons}
				/>
			)}
		</React.Fragment>
	);
};

export default ScheduleLesson;
