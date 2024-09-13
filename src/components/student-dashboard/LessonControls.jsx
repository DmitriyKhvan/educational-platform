import { addMinutes, isAfter } from "date-fns";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaPlay, FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/app/providers/AuthProvider";
import { MentorFeedbackModal } from "src/entities/MentorFeedbackModal";
import {
	LessonsStatusType,
	ModalType,
	Roles,
} from "src/shared/constants/global";
import { AdaptiveDialog } from "src/shared/ui/AdaptiveDialog";
import { cn } from "src/shared/utils/functions";
import { isBetween } from "src/shared/utils/isBetween";
import { isWithinHours } from "src/shared/utils/isWithinHours";
import Button from "../Form/Button";
import { CancelTrialLessonModal } from "./CancelTrialLessonModal";
import LessonInfoModal from "./LessonInfoModal";
import PlaygroundWarningModal from "./PlaygroundWarningModal";
import RescheduleAndCancelModal from "./RescheduleAndCancelModalRebranding";

const LessonControls = ({
	date,
	data,
	refetch,
	duration,
	pattern = "card", // card, table, info
}) => {
	const dateLesson = new Date(date);
	const navigate = useNavigate();

	const { user } = useAuth();

	const [t] = useTranslation(["modals", "common", "feedback"]);
	const [isWarningOpen, setIsWarningOpen] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [controls, setControls] = useState([]);

	const [mentorReviewOpen, setMentorReviewOpen] = useState(false);

	const isAfterLesson = isAfter(
		new Date(),
		addMinutes(new Date(date), data.duration),
	);

	const gridStyle =
		pattern === "table" && isAfterLesson
			? { display: "flex" }
			: {
					gridTemplateColumns: `repeat(${controls.length}, minmax(0, 1fr))`,
					display: "grid",
				};

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	const joinLesson = () => {
		//Time period when you can go to the lesson
		if (
			isBetween({
				dateStart: dateLesson,
				duration: data.duration,
				userTimezone,
			})
		) {
			window.open(
				user.role === Roles.MENTOR
					? data?.playground?.startUrl
					: data?.playground?.joinUrl,
				"_blank",
			);
		} else {
			setIsWarningOpen(true);
		}
	};

	const isWithin24Hours = isWithinHours({
		dateStart: new Date(),
		dateEnd: dateLesson,
		hours: 24,
		userTimezone,
	});

	const rescheduleAndCancelModal = (modalType) => (
		<RescheduleAndCancelModal
			data={data}
			setTabIndex={setTabIndex}
			fetchAppointments={refetch}
			tabIndex={tabIndex}
			type={modalType}
			duration={duration}
		/>
	);

	const cancelTrialLessonModal = (
		<CancelTrialLessonModal data={data} fetchAppointments={refetch} />
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const controls = [];

		if (
			!isAfterLesson &&
			isWithin24Hours &&
			data.status === LessonsStatusType.APPROVED
		) {
			controls.push(
				<Button className="w-full text-xs sm:text-sm px-2" onClick={joinLesson}>
					{t("join_lesson")}
				</Button>,
			);
		}
		if (pattern === "info" && !isAfterLesson) {
			controls.push(
				<AdaptiveDialog
					button={
						<Button
							className="grow text-xs sm:text-sm px-2"
							theme="dark_purple"
						>
							{t("info")}
						</Button>
					}
				>
					<LessonInfoModal
						date={date}
						data={data}
						refetch={refetch}
						duration={duration}
						userTimezone={userTimezone}
					/>
				</AdaptiveDialog>,
			);
		}
		if (
			!isAfterLesson &&
			!isWithin24Hours &&
			!data.isTrial &&
			user.role !== Roles.MENTOR
		) {
			controls.push(
				<AdaptiveDialog
					button={
						<Button
							theme="dark_purple"
							className="grow text-xs sm:text-sm px-2"
						>
							{t("reschedule")}
						</Button>
					}
				>
					{rescheduleAndCancelModal(ModalType.RESCHEDULE)}
				</AdaptiveDialog>,
			);
		}

		if (isAfterLesson) {
			controls.push(
				<AdaptiveDialog
					button={
						<Button
							disabled={!data?.playground?.recordingUrl}
							className="grow gap-1 sm:gap-2 text-xs sm:text-sm min-w-10 min-h-10"
						>
							<FaPlay />
							{pattern !== "table" && t("watch_recording")}
						</Button>
					}
				>
					<LessonInfoModal
						date={date}
						data={data}
						playground={data?.playground}
						refetch={refetch}
						duration={duration}
						userTimezone={userTimezone}
					/>
				</AdaptiveDialog>,
			);
		}

		if (isAfterLesson && user.role === Roles.STUDENT) {
			controls.push(
				<Button
					disabled={!data?.mentorReview}
					className={cn("grow text-xs sm:text-sm px-2 gap-2")}
					theme="purple"
					onClick={() =>
						navigate(`/student/lesson-calendar/feedback/${data.id}`)
					}
				>
					<FaStar className="min-w-5 min-h-5" />{" "}
					<span className="text-[13px] truncate">
						{t("feedback", { ns: "feedback" })}
					</span>
				</Button>,
			);
		}

		if (isAfterLesson && user.role === Roles.MENTOR) {
			controls.push(
				<AdaptiveDialog
					open={mentorReviewOpen}
					setOpen={setMentorReviewOpen}
					classNameDrawer="h-[95%]"
					button={
						<Button
							disabled={data?.mentorReview || data?.noShow}
							// theme={data?.noShow ? "red" : "purple"}
							className={cn(
								"grow text-xs min-w-[108px] sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]",
								data?.noShow
									? "disabled:bg-color-red disabled:text-color-red"
									: "disabled:bg-[#039855] disabled:text-[#0EC541]",
							)}
						>
							{!data?.noShow && !data?.mentorReview && (
								<>
									<FaStar className="min-w-5 min-h-5" />
									<span className="truncate">Feedback</span>
								</>
							)}
							{!data?.noShow && data?.mentorReview && (
								<>
									<FaCheck className="" />
									<span className="truncate">Submitted</span>
								</>
							)}
							{data?.noShow && (
								<>
									{/* <FaXmark className="" /> */}
									<span className="truncate">No Show</span>
								</>
							)}
						</Button>
					}
				>
					<MentorFeedbackModal
						data={data}
						closeModal={() => {
							setMentorReviewOpen(false);
							refetch();
						}}
					/>
				</AdaptiveDialog>,
			);
		}

		if (
			data.status !== LessonsStatusType.CANCELED &&
			data.status !== LessonsStatusType.COMPLETED &&
			!(user.role === Roles.MENTOR && data.isTrial)
		) {
			controls.push(
				<AdaptiveDialog
					button={
						<Button theme="red" className="grow text-xs sm:text-sm px-2">
							{t("cancel", { ns: "common" })}
						</Button>
					}
				>
					{data.isTrial
						? cancelTrialLessonModal
						: rescheduleAndCancelModal(ModalType.CANCEL)}
				</AdaptiveDialog>,
			);
		}

		setControls(controls);
	}, [data, tabIndex, mentorReviewOpen, t]);

	return (
		<>
			<div style={gridStyle} className={cn("gap-2 xl:gap-3 h-[52px]")}>
				{controls.map((control, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={index} className="flex">
						{control}
					</div>
				))}
			</div>

			<AdaptiveDialog open={isWarningOpen} setOpen={setIsWarningOpen}>
				<PlaygroundWarningModal />
			</AdaptiveDialog>
		</>
	);
};

export default LessonControls;
