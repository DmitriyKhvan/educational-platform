import { LessonTable } from "@/components/student-dashboard/lesson-table";
import { LessonTableMobile } from "@/components/student-dashboard/lesson-table-mobile";
import { isWithinHours } from "@/shared/utils/is-within-hours";
import { addMinutes, isAfter } from "date-fns";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "src/app/providers/auth-provider";
import { NoLessonsMessage } from "src/components/lessons-list";
import { LessonsStatusType, Roles } from "src/shared/constants/global";

const Table = ({
	tableAppointments,
	getAppointments,
	selectedTab,
	planStatus,
	handleOpenFeedbackModal,
	handleFeedback,
}) => {
	const [displayTableData, setDisplayTableData] = useState([]);
	const isDesktop = useMediaQuery({ minWidth: 1307 });

	const [pastLessons, setPastLessons] = useState([]);
	const [upcomingLessons, setUpcomingLessons] = useState([]);

	const { user } = useAuth();

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	useEffect(() => {
		if (tableAppointments) {
			const tempUpcomingLessons = [];
			const tempPastLessons = [];

			tableAppointments.map((each) => {
				const isWithin24hour = isWithinHours({
					dateEnd: new Date(each.resource.startAt),
					dateStart: new Date(each.resource.canceledAt),
					hours: 24,
					userTimezone,
				});

				const endLesson = addMinutes(
					new Date(each.resource.startAt),
					each.resource.duration,
				);

				if (
					(isAfter(new Date(), endLesson) &&
						each.resource.status !== LessonsStatusType.CANCELED) ||
					(isWithin24hour && each.resource.canceledBy === Roles.STUDENT)
				) {
					tempPastLessons.push(each);
				} else if (
					each.resource.status === LessonsStatusType.APPROVED ||
					each.resource.status === LessonsStatusType.SCHEDULED ||
					each.resource.status === LessonsStatusType.RESCHEDULED
				) {
					tempUpcomingLessons.push(each);
				}
			});

			const sortPastLessons = [...tempPastLessons].sort(
				(a, b) => new Date(b.resource.startAt) - new Date(a.resource.startAt),
			);

			const sortUpcomingLessons = [...tempUpcomingLessons].sort(
				(a, b) => new Date(a.resource.startAt) - new Date(b.resource.startAt),
			);

			setUpcomingLessons(sortUpcomingLessons);
			setPastLessons(sortPastLessons);
		}
	}, [tableAppointments]);

	useEffect(() => {
		if (upcomingLessons && pastLessons) {
			setDisplayTableData(
				selectedTab === "upcomingLessons"
					? [...upcomingLessons]
					: [...pastLessons],
			);
		}
	}, [selectedTab, upcomingLessons, pastLessons]);

	return displayTableData?.length ? (
		isDesktop ? (
			<LessonTable
				displayTableData={displayTableData}
				userTimezone={userTimezone}
				getAppointments={getAppointments}
				handleOpenFeedbackModal={handleOpenFeedbackModal}
				handleFeedback={handleFeedback}
			/>
		) : (
			<LessonTableMobile
				displayTableData={displayTableData}
				getAppointments={getAppointments}
				userTimezone={userTimezone}
				handleOpenFeedbackModal={handleOpenFeedbackModal}
				handleFeedback={handleFeedback}
			/>
		)
	) : (
		<NoLessonsMessage
			selectedTab={selectedTab}
			availableCredits={planStatus?.reduce(
				(prev, curr) => prev + curr.credits,
				0,
			)}
		/>
	);
};

export default Table;
