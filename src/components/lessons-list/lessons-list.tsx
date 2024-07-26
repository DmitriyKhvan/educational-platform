import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/badge";
import Button from "@/components/form/button";
import Loader from "@/components/loader/loader";
import { sortCalendarEvents } from "@/shared/utils/sort-calendar-events";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useNotifications } from "@/app/providers/notification-provider";
import { LessonsCalendar, LessonsTable } from "src/components/lessons-list";
import { LessonsStatusType } from "@/shared/constants/global";

const LessonsList = ({
	getAppointments,
	appointments,
	loadingAppointments,
	planStatus,
}) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams({
		selectedTab: "upcomingLessons",
	});

	const isMobile = useMediaQuery({ maxWidth: 640 });

	const [t] = useTranslation(["lessons"]);
	const { user } = useAuth();

	const { notifications, getCountNotification, removeNotifications } =
		useNotifications();

	useEffect(() => {
		getAppointments();
		if (searchParams.get("selectedTab") === "upcomingLessons") {
			setTimeout(() => {
				removeNotifications(LessonsStatusType.APPROVED);
			}, 300);
		}
	}, [notifications]);

	const [calendarAppointments, setCalendarAppointments] = useState([]);
	const [tableAppointments, setTableAppointments] = useState([]);

	useEffect(() => {
		if (appointments) {
			const { calendarEvents, tablularEventData } = sortCalendarEvents(
				appointments?.lessons,
				user.timeZone,
			);

			setCalendarAppointments(
				calendarEvents.filter(
					(event) => event.status !== LessonsStatusType.CANCELED,
				),
			);
			setTableAppointments(tablularEventData);
		}
	}, [appointments]);

	const onClickPastLessons = () => {
		navigate("?selectedTab=pastLessons");
	};

	const onClickUpcomingLessons = () => {
		navigate("?selectedTab=upcomingLessons");
		removeNotifications(LessonsStatusType.APPROVED);
	};

	const onCalendarClick = () => {
		navigate("?selectedTab=calendar");
	};

	useEffect(() => {
		if (isMobile && searchParams.get("selectedTab") === "calendar") {
			navigate("?selectedTab=upcomingLessons");
		}
	}, [isMobile]);

	return (
		<>
			{loadingAppointments ? (
				<Loader height="100%" />
			) : (
				<div className="h-full">
					<div>
						<h1 className="mb-4 text-[32px] font-bold">
							{t("lessons", { ns: "lessons" })}
						</h1>
						<div className="row container-fluid m-0 p-0">
							<div className="flex flex-wrap gap-4 mb-4 sm:mb-6 md:mb-8">
								<div className="grid grid-cols-2 w-full sm:flex sm:w-auto">
									<Button
										theme="outline"
										className={`relative ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
											searchParams.get("selectedTab") === "upcomingLessons" &&
											"bg-color-dark-purple text-white"
										}`}
										onClick={onClickUpcomingLessons}
									>
										<span>{t("upcoming_lessons", { ns: "lessons" })}</span>
										{getCountNotification(LessonsStatusType.APPROVED) > 0 && (
											<Badge
												count={getCountNotification(LessonsStatusType.APPROVED)}
											/>
										)}
									</Button>
									<Button
										theme="outline"
										className={`ml-[-4px] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
											searchParams.get("selectedTab") === "pastLessons" &&
											"bg-color-dark-purple text-white"
										}`}
										onClick={onClickPastLessons}
									>
										<span>{t("past_lessons", { ns: "lessons" })}</span>
									</Button>
								</div>

								<Button
									theme="outline"
									className={`focus:shadow-none hidden sm:block hover:bg-color-dark-purple hover:text-white ${
										searchParams.get("selectedTab") === "calendar" &&
										"bg-color-dark-purple text-white"
									}`}
									onClick={onCalendarClick}
								>
									<span>{t("calendar_view", { ns: "lessons" })}</span>
								</Button>
							</div>
						</div>
					</div>

					<div>
						{!loadingAppointments &&
							searchParams.get("selectedTab") !== "calendar" && (
								<LessonsTable
									tableAppointments={tableAppointments}
									planStatus={planStatus}
									selectedTab={searchParams.get("selectedTab")}
									getAppointments={getAppointments}
								/>
							)}
						{!isMobile &&
							!loadingAppointments &&
							searchParams.get("selectedTab") === "calendar" && (
								<div className="mt-4">
									<LessonsCalendar
										calendarAppointments={calendarAppointments}
										getAppointments={getAppointments}
									/>
								</div>
							)}
					</div>
				</div>
			)}
		</>
	);
};

export default LessonsList;
