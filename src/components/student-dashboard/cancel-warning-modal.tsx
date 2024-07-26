import { isWithinHours } from "@/shared/utils/is-within-hours";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import  { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaXmark } from "react-icons/fa6";
import { useAuth } from "@/app/providers/auth-provider";
import {
	MAX_MODIFY_COUNT,
	ModalType,
	Roles,
} from "../../shared/constants/global";
import Button from "../form/button/Button";
import CheckboxField from "../form/checkbox-field";

const CancelWarningModal = ({
	data,
	setTabIndex,
	type,
	modifyCredits,
	setRepeatLessons,
	repeatLessons,
}) => {
	const [t] = useTranslation("modals");
	const { user } = useAuth();

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [cancellationDots, setCancellationDots] = useState([]);
	const [cancellationCount, setCancellationCount] = useState(MAX_MODIFY_COUNT);

	const isLate = isWithinHours({
		dateEnd: new Date(data?.startAt ?? new Date()),
		dateStart: new Date(),
		hours: 24,
		userTimezone,
	});

	useEffect(() => {
		if (modifyCredits !== undefined) {
			const cancellationDots = [];
			for (let i = 0; i < MAX_MODIFY_COUNT; i++) {
				if (i < modifyCredits) {
					cancellationDots.unshift(
						<span
							className="w-7 h-7 mr-[6px] rounded-[4px] bg-color-purple bg-opacity-30"
							key={i}
						></span>,
					);
				} else {
					setCancellationCount((v) => v - 1);
					cancellationDots.unshift(
						<span
							className="w-7 h-7 mr-[6px] flex justify-center items-center rounded-[4px] bg-color-red"
							key={i}
						>
							<FaXmark className="text-white" />
						</span>,
					);
				}
			}
			setCancellationDots(cancellationDots);
		}
	}, [modifyCredits]);

	const onClick = () => {
		if (type === "reschedule") {
			//We need exactly window.location, so that the page with this id is reloaded
			window.location.replace(
				`/student/schedule-lesson/select/${data.id}/?repeatLessons=${repeatLessons}`,
			);
		}

		if (type === "cancel") {
			setTabIndex(1);
		}
	};

	const disableCancelLesson =
		user.role === Roles.MENTOR || modifyCredits !== 0 ? false : true;
	return (
		<div className="w-[336px] mx-auto">
			<div className="mb-5 text-2xl font-bold text-center">
				{type === ModalType.CANCEL
					? t("cancel_lesson")
					: t("reschedule_lesson")}
			</div>
			<p className="text-base text-center mb-4">
				<Trans
					t={t}
					i18nKey="are_you_sure_reschedule_cancel"
					values={{
						cancelReschedule:
							type === "cancel"
								? t("swal_cancel_Button_Text").toLowerCase()
								: t("reschedule").toLowerCase(),
						date: format(
							toZonedTime(new Date(data?.startAt ?? new Date()), userTimezone),
							"eee, MMM do",
							{ timeZone: userTimezone },
						),
					}}
					components={{
						strong: <span className="font-semibold" />,
					}}
				/>
			</p>
			{user.role !== Roles.MENTOR && (
				<div className="space-y-3">
					{(type === ModalType.CANCEL || isLate) && (
						<div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
							<span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
								!
							</span>
							<div className="max-w-[300px] space-y-3 font-medium text-color-dark-purple leading-5">
								{type === "cancel" ? (
									isLate ? (
										<>
											<p>{t("cancel_modal_desc3")}</p>
											<p>{t("cancel_modal_desc2")}</p>
										</>
									) : (
										<p>{t("cancel_modal_desc4")}</p>
									)
								) : (
									<p>You cannot reschedule within 24 hours.</p>
								)}
							</div>
						</div>
					)}

					<div className="w-full p-4 flex items-center justify-between mt-5 rounded-lg bg-color-purple bg-opacity-20">
						<div>
							<Trans
								t={t}
								i18nKey="n_cancelations_left"
								values={{
									count: cancellationCount,
								}}
								components={{
									primary: (
										<p className="font-semibold text-[15px] text-color-purple" />
									),
									secondary: <span className="text-[14px] text-color-purple" />,
								}}
							/>
						</div>
						<div className="flex">{cancellationDots}</div>
					</div>
				</div>
			)}

			<Button
				className="h-[56px] px-[10px] w-full mt-6"
				theme="purple"
				onClick={
					disableCancelLesson || (isLate && type === ModalType.RESCHEDULE)
						? undefined
						: onClick
				}
				disabled={
					disableCancelLesson || (isLate && type === ModalType.RESCHEDULE)
				}
			>
				{t("continue_cancel")}
			</Button>

			{user.role === Roles.STUDENT && (
				<div className="mt-6 flex justify-center">
					<CheckboxField
						label={
							type === ModalType.CANCEL
								? t("cancel_lessons")
								: t("reschedule_lessons")
						}
						id="cancel"
						value="cancel"
						onChange={() => setRepeatLessons((v) => !v)}
						checked={repeatLessons}
						disabled={disableCancelLesson}
						name="lesson"
						square
					/>
				</div>
			)}

			<div className="flex items-center justify-center gap-x-8 mt-4">
				{type !== ModalType.RESCHEDULE && (
					<button
						className="h-[38px] px-[10px] text-color-purple text-sm hover:underline"
						onClick={() => setTabIndex(10)}
					>
						{t("review_cancellation_policy")}
					</button>
				)}
			</div>
		</div>
	);
};

export default CancelWarningModal;
