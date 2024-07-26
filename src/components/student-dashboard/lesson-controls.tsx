import { cn } from "@/shared/utils/functions";
import { isBetween } from "@/shared/utils/is-between";
import { isWithinHours } from "@/shared/utils/is-within-hours";
import { addMinutes, isAfter } from "date-fns";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaPlay, FaRegClock, FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/app/providers/auth-provider";
import { MentorFeedbackModal } from "src/entities/mentor-feedback-modal";
import { StudentReviewModal } from "src/entities/student-review-modal";
import {
	LessonsStatusType,
	ModalType,
	Roles,
} from "src/shared/constants/global";
import { AdaptiveDialog } from "src/shared/ui/adaptive-dialog";
import Button from "../form/button";
import { CancelTrialLessonModal } from "./cancel-trial-lesson-modal";
import LessonInfoModal from "./lesson-info-modal";
import PlaygroundWarningModal from "./playground-warning-modal";
import RescheduleAndCancelModal from "./reschedule-and-cancel-modal-rebranding";

const LessonControls = ({
	date,
	data,
	refetch,
	duration,
	setCanceledLessons,
	pattern = "card", // card, table, info
}) => {
	const dateLesson = new Date(date);
	const navigate = useNavigate();

	const { user } = useAuth();

	const [t] = useTranslation(["modals", "common", "feedback"]);
	const [isWarningOpen, setIsWarningOpen] = useState(false);
	const [modalType, setModalType] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [controls, setControls] = useState([]);

	const [mentorReviewOpen, setMentorReviewOpen] = useState(false);
	const [openStudentReview, setOpenStudentReview] = useState(false);
	const [openCancel, setOpenCancel] = useState(false);
	const [openReschedule, setOpenReschedule] = useState(false);
	const [openInfo, setOpenInfo] = useState(false);

	// НЕ ЗАБЫТЬ УДАЛИТЬ!!!
	// const isAfterLesson = true;
	const isAfterLesson = isAfter(
		new Date(),
		addMinutes(new Date(date), data.duration),
	);

	const gridStyle = {
		gridTemplateColumns: `repeat(${pattern === "table" && user.role === Roles.STUDENT && isAfterLesson && process.env.REACT_APP_PRODUCTION === "false" ? 3 : controls}, minmax(0, 1fr))`,
		// gridTemplateColumns: `repeat(${controls}, minmax(0, 1fr))`,
	};

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	function onSelect() {
		setIsOpen(true);
		setModalType(ModalType.RESCHEDULE);
	}

	const closeModal = () => {
		setIsOpen(false);
		setIsWarningOpen(false);
		setTabIndex(0);
	};

	const onCancel = () => {
		setIsOpen(true);
		setModalType(ModalType.CANCEL);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <effect must be triggered on isOpen change>
	useEffect(() => {
		setTabIndex(0);
	}, [isOpen]);

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

	const rescheduleAndCancelModal = (
		<RescheduleAndCancelModal
			data={data}
			setTabIndex={setTabIndex}
			setIsOpen={setIsOpen}
			fetchAppointments={refetch}
			tabIndex={tabIndex}
			type={modalType}
			setCanceledLessons={setCanceledLessons}
			duration={duration}
		/>
	);

	const cancelTrialLessonModal = (
		<CancelTrialLessonModal
			data={data}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			fetchAppointments={refetch}
		/>
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let controls = 0;

		if (
			!isAfterLesson &&
			isWithin24Hours &&
			data.status === LessonsStatusType.APPROVED
		) {
			controls++;
		}
		if (pattern === "info" && !isAfterLesson) {
			controls++;
		}
		if (
			!isAfterLesson &&
			!isWithin24Hours &&
			!data.isTrial &&
			user.role !== Roles.MENTOR
		) {
			controls++;
		}
		if (isAfterLesson && user.role === Roles.MENTOR) {
			controls++;
		}
		if (
			isAfterLesson &&
			user.role === Roles.STUDENT &&
			process.env.REACT_APP_PRODUCTION === "false"
		) {
			controls += 2;
		}
		if (!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial)) {
			controls++;
		}

		setControls(controls);
	}, [modalType, tabIndex, isOpen, t]);

	return (
		<>
			<div style={gridStyle} className={cn("gap-2 xl:gap-3 h-[52px] grid")}>
				{!isAfterLesson &&
					isWithin24Hours &&
					data.status === LessonsStatusType.APPROVED && (
						<Button
							className="w-full text-xs sm:text-sm px-2"
							onClick={joinLesson}
						>
							{t("join_lesson")}
						</Button>
					)}
				{pattern === "info" && !isAfterLesson && (
					<AdaptiveDialog
						button={
							<Button
								className="grow text-xs sm:text-sm px-2"
								theme="dark_purple"
							>
								{t("info")}
							</Button>
						}
						open={openInfo}
						setOpen={setOpenInfo}
					>
						<LessonInfoModal
							date={date}
							data={data}
							refetch={refetch}
							duration={duration}
							setCanceledLessons={setCanceledLessons}
							userTimezone={userTimezone}
						/>
					</AdaptiveDialog>
				)}
				{!isAfterLesson &&
					!isWithin24Hours &&
					!data.isTrial &&
					user.role !== Roles.MENTOR && (
						<AdaptiveDialog
							open={openReschedule}
							setOpen={setOpenReschedule}
							button={
								<Button
									theme="dark_purple"
									className="grow text-xs sm:text-sm px-2"
									onClick={onSelect}
								>
									{t("reschedule")}
								</Button>
							}
						>
							{rescheduleAndCancelModal}
						</AdaptiveDialog>
					)}
				{isAfterLesson &&
					user.role === Roles.STUDENT &&
					process.env.REACT_APP_PRODUCTION === "false" && (
						<>
							<Button
								disabled={!data?.mentorReview}
								className={cn(
									"grow text-xs sm:text-sm px-2 gap-2",
									pattern === "table" && "col-span-2",
								)}
								theme="dark_purple"
								onClick={() =>
									navigate(`/student/lesson-calendar/feedback/${data.id}`)
								}
							>
								{data?.mentorReview ? (
									t("lesson_feedback", { ns: "feedback" })
								) : (
									<>
										<FaRegClock /> {t("feedback_pending", { ns: "feedback" })}
									</>
								)}
							</Button>
							<AdaptiveDialog
								button={
									<Button
										// disabled={true}
										disabled={data?.studentReview}
										className={cn(
											"grow text-xs sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]",
											pattern === "table" && "col-span-1",
										)}
									>
										{data?.studentReview ? <FaCheck /> : <FaStar />}{" "}
										{pattern !== "table" &&
											(data?.studentReview
												? t("review_submitted", { ns: "feedback" })
												: t("submit_review", { ns: "feedback" }))}
									</Button>
								}
								open={openStudentReview}
								setOpen={setOpenStudentReview}
							>
								<StudentReviewModal
									studentId={data?.student?.id}
									lessonId={data?.id}
									closeModal={() => {
										setOpenStudentReview(false);
										refetch();
									}}
								/>
							</AdaptiveDialog>
						</>
					)}
				{!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial) && (
					<AdaptiveDialog
						open={openCancel}
						setOpen={setOpenCancel}
						button={
							<Button
								theme="red"
								className="grow text-xs sm:text-sm px-2"
								onClick={onCancel}
							>
								{t("cancel", { ns: "common" })}
							</Button>
						}
					>
						{data.isTrial ? cancelTrialLessonModal : rescheduleAndCancelModal}
					</AdaptiveDialog>
				)}
				{isAfterLesson &&
					user.role === Roles.MENTOR &&
					process.env.REACT_APP_PRODUCTION === "false" && (
						<AdaptiveDialog
							open={mentorReviewOpen}
							setOpen={setMentorReviewOpen}
							classNameDrawer="h-[95%]"
							button={
								<Button
									disabled={data?.mentorReview}
									className={cn(
										"grow text-xs sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]",
									)}
								>
									{!data?.mentorReview && <FaStar />}{" "}
									{data?.mentorReview
										? "Feedback submitted"
										: "Submit feedback"}
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
						</AdaptiveDialog>
					)}

				{/* Удалить process.env.REACT_APP_PRODUCTION после активации feedback */}

				{/* Удалить кнопку watching после активации feedback */}
				{isAfterLesson && process.env.REACT_APP_PRODUCTION === "true" && (
					<AdaptiveDialog
						button={
							<Button
								disabled={!data?.playground?.recordingUrl}
								className="grow gap-1 sm:gap-2 text-xs sm:text-sm px-2"
							>
								<FaPlay />
								{t("watch_recording")}
							</Button>
						}
					>
						<LessonInfoModal
							date={date}
							data={data}
							playground={data?.playground}
							refetch={refetch}
							duration={duration}
							setCanceledLessons={setCanceledLessons}
							userTimezone={userTimezone}
						/>
					</AdaptiveDialog>
				)}
			</div>

			{isWarningOpen && (
				<PlaygroundWarningModal
					isWarningOpen={isWarningOpen}
					closeModal={closeModal}
					setIsWarningOpen={setIsWarningOpen}
				/>
			)}
		</>
	);
};

export default LessonControls;
