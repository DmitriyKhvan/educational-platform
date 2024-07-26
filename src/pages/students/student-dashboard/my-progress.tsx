import ScheduleCard from "@/components/student-dashboard/schedule-card-rebranding";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LessonsStatusType } from "src/shared/constants/global";
import DashboardCard from "./dashboard-card";

const MyProgress = ({ appointments, fetchAppointments }) => {
	const [t] = useTranslation(["dashboard", "lessons"]);

	const lastCompleted = useMemo(
		() =>
			appointments
				?.filter((a) => a.status === LessonsStatusType.COMPLETED)
				?.sort((a, b) => new Date(b.startAt) - new Date(a.startAt))[0],
		[appointments],
	);

	return (
		<DashboardCard
			title={t("my_progress", { ns: "dashboard" })}
			subtitle={t("my_progress_subtitle", { ns: "dashboard" })}
			hrefTo="/student/lesson-calendar"
		>
			{lastCompleted ? (
				<ScheduleCard
					duration={lastCompleted.duration}
					lesson={lastCompleted?.packageSubscription?.package?.course?.title}
					mentor={lastCompleted.mentor}
					playground={lastCompleted?.playground}
					date={new Date(lastCompleted.startAt)}
					data={lastCompleted}
					fetchAppointments={fetchAppointments}
				/>
			) : (
				<div className="flex justify-center items-center gap-4 md:gap-[30px] w-full bg-gray-50 h-72 rounded-lg">
					<p className="text-[15px] text-gray-300 tracking-tight mb-6">
						{t("no_completed_lessons", { ns: "lessons" })}
					</p>
				</div>
			)}
		</DashboardCard>
	);
};

export default MyProgress;
