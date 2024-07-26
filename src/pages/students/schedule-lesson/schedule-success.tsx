import Button from "@/components/form/button";
import Indicator from "@/components/indicator";
import ScheduleCard from "@/components/student-dashboard/schedule-card-rebranding";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { localeDic } from "@/shared/constants/global";

const ScheduleSuccess = ({ lessons }) => {
	const { user } = useAuth;
	const [t, i18n] = useTranslation(["lessons", "modals"]);
	const navigate = useNavigate();

	const userTimezone =
		user?.timeZone?.split(" ")[0] ||
		Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<div className="max-w-[488px] mx-auto">
			<div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-8 sm:justify-center">
				{lessons?.find((l) => l.status) ? (
					<>
						<FaCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
						<h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
							{t("lesson_approved")}
						</h1>
					</>
				) : (
					<>
						<FaCircleXmark className="w-6 h-6 sm:w-9 sm:h-9 text-red-500" />
						<h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
							{t("lesson_scheduling_failed")}
						</h1>
					</>
				)}
			</div>
			{lessons?.map((l) =>
				l.status ? (
					<ScheduleCard
						key={l?.id}
						duration={l?.duration}
						lesson={l?.packageSubscription?.package?.course?.title}
						mentor={l?.mentor}
						date={l?.startAt}
						data={l}
						// repeat={repeat}
						fetchAppointments={() => navigate("/student/manage-lessons")}
					/>
				) : (
					<div
						key={l.id}
						className="flex mb-5 justify-between items-center text-color-dark-violet font-bold text-[15px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)] border border-color-border-grey p-4 rounded-[10px]"
					>
						<h3>
							{format(
								toZonedTime(new Date(l.startAt), userTimezone),
								"MMMM do",
								{
									locale: localeDic[i18n.language],
								},
							)}
						</h3>
						<Indicator className="bg-color-purple text-color-purple">
							{t(l.cancelReason, { ns: "modals" })}
						</Indicator>
					</div>
				),
			)}

			<Button
				className="w-full h-[57px] mb-3 mt-5"
				onClick={() => navigate("/student/lesson-calendar")}
			>
				{t("view_my_lessons")}
			</Button>
			<Button
				className="w-full h-[57px]"
				theme="gray"
				onClick={() => navigate("/student/manage-lessons")}
			>
				{t("return_to_dash")}
			</Button>
		</div>
	);
};

export default ScheduleSuccess;
