import LessonInfoModal from "@/components/student-dashboard/lesson-info-modal";
import { cn } from "@/shared/utils/functions";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { useAuth } from "@/app/providers/auth-provider";
import { LessonsCalendarHeader } from "src/components/lessons-list";
import {
	COURSE_COLORS,
	CalendarView,
	Roles,
	courseColorsDict,
} from "@/shared/constants/global";

import { getTranslatedTitle } from "@/shared/utils/get-translated-title";
import { useCourseColors } from "@/shared/utils/use-course-colors";
import { Calendar } from "../calendar";
import Loader from "../loader/loader";

const LessonsCalendar = ({ calendarAppointments, getAppointments }) => {
	// eslint-disable-next-line no-unused-vars
	const [_, i18n] = useTranslation();
	const calendarRef = useRef();
	const { getColorByCourseId, colorsReady } = useCourseColors();
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [calendarEvent, setCalendarEvent] = useState({});

	const closeModal = () => {
		setCalendarEvent({});
		setIsOpen(false);
	};

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [calendarEvents, setCalendarEvents] = useState([]);

	useEffect(() => {
		if (calendarAppointments) {
			const tempEvents = calendarAppointments.map((ap, index) => {
				return {
					id: index,
					title: `${format(ap.startAt, "hh:mm a")} ${ap.student.firstName}`,
					start: ap.startAt,
					end: ap.end_at,
					resource: ap,
				};
			});
			setCalendarEvents([...tempEvents]);
		}
	}, [calendarAppointments]);

	const customStyles = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			zIndex: 20,
			background: "none",
			border: "none",
		},
		overlay: {
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			zIndex: 20,
		},
	};

	const CustomModal = () => {
		const [selectedEvent] =
			calendarEvents?.filter((x) => x.id === calendarEvent.id) ?? [];

		return (
			<div className="container">
				<Modal
					isOpen={isOpen}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div className="p-8 z-20 bg-white rounded-2xl">
						<LessonInfoModal
							date={selectedEvent?.resource?.eventDate?.startAt}
							data={selectedEvent?.resource?.eventDate}
							refetch={() => {
								getAppointments();
								closeModal();
							}}
							duration={selectedEvent.resource.eventDate.duration}
							userTimezone={userTimezone}
						/>
					</div>
				</Modal>
			</div>
		);
	};

	const onSelectEvent = (e) => {
		setCalendarEvent({ id: Number(e.event.id) });
		setIsOpen(true);
	};

	const renderEventContent = (eventInfo) => {
		const data = eventInfo.event.extendedProps.resource;

		let content = <></>;

		if (user.role === Roles.STUDENT) {
			content = (
				<p className="font-medium truncate">
					{getTranslatedTitle(
						data?.packageSubscription?.package?.course,
						i18n.language,
					)}
				</p>
			);
		} else if (
			eventInfo.view.type === CalendarView.MONTH_VIEW &&
			user.role === Roles.MENTOR
		) {
			content = (
				<p className="font-medium truncate">
					{data?.startAt && format(data.startAt, "hha")}{" "}
					{data?.student?.firstName} {data.student?.lastName}
				</p>
			);
		} else {
			content = (
				<div className="text-xs leading-4 truncate">
					<b className="block font-semibold truncate">
						{data?.student?.firstName} {data?.student?.lastName}
					</b>
					<p className="block truncate">
						{data?.eventDate.duration} min, {data?.student?.langLevel}
					</p>
				</div>
			);
		}
		return (
			<div
				className={cn(
					"flex items-center px-2 min-h-[28px] h-full w-full text-gray-800 bg-gray-800 bg-opacity-15 hover:bg-opacity-100 transition-all duration-150 ease-in-out hover:text-white rounded-[4px] border-l-4 border-l-gray-800 overflow-hidden truncate",
					data.isTrial
						? courseColorsDict[COURSE_COLORS.GREEN]?.event
						: getColorByCourseId(data.courseId)?.event,
				)}
			>
				{content}
			</div>
		);
	};

	if (!colorsReady) {
		return <Loader />;
	}

	return (
		<>
			<LessonsCalendarHeader calendarRef={calendarRef} />
			<Calendar
				ref={calendarRef}
				events={calendarEvents}
				eventContent={renderEventContent}
				eventClick={onSelectEvent}
			/>

			{isOpen && <CustomModal />}
		</>
	);
};

export default LessonsCalendar;
