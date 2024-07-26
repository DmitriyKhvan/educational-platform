import { useAuth } from "@/app/providers/auth-provider";
import Button from "@/components/form/button";
import Indicator from "@/components/indicator";
import Loader from "@/components/loader/loader";
import { PlaygroundRecordingModal } from "@/components/playground-recording-modal";
import StatusIndicator from "@/components/student-dashboard/status-indicator";
import FeedbackInfo from "@/pages/students/feedback/ui/feedback-info";
import LessonInfo from "@/pages/students/feedback/ui/lesson-info";
import { LESSON_QUERY } from "@/shared/apollo/graphql";
import { localeDic } from "@/shared/constants/global";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@apollo/client";
import { addMinutes } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaStar } from "react-icons/fa6";
import { PiStarFourFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { StudentReviewModal } from "src/entities/student-review-modal";

function Feedback() {
	const params = useParams();
	const [t, i18n] = useTranslation(["common", "feedback"]);
	const { user } = useAuth();

	const [openReview, setOpenReview] = useState(false);

	const {
		data: lessonData,
		loading,
		refetch,
	} = useQuery(LESSON_QUERY, {
		fetchPolicy: "network-only",
		variables: { id: params?.id },
	});
	const data = lessonData?.lesson;

	const userTimezone =
		user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

	if (loading && !data) {
		return <Loader height="100%" />;
	}

	return (
		<>
			<header className="max-w-[514px] xl:max-w-none mx-auto flex justify-between items-center mb-6">
				<div>
					<h2 className="text-[28px] font-bold text-color-dark-purple">
						{format(
							toZonedTime(new Date(data?.startAt), userTimezone),
							"eee, MMM do",
							{
								timeZone: userTimezone,
								locale: localeDic[i18n.language],
							},
						)}
					</h2>
					<p>
						{format(
							toZonedTime(new Date(data?.startAt), userTimezone),
							"hh:mm a",
							{
								timeZone: userTimezone,
								locale: localeDic[i18n.language],
							},
						)}
						{" - "}
						{format(
							addMinutes(
								toZonedTime(new Date(data?.startAt), userTimezone),
								data?.duration,
							),
							"hh:mm a",
							{ timeZone: userTimezone, locale: localeDic[i18n.language] },
						)}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{data?.isTrial && (
						<Indicator className="bg-green-300 text-green-500">
							<PiStarFourFill /> {t("trial", { ns: "common" })}
						</Indicator>
					)}

					<StatusIndicator status={data?.status} />
				</div>
			</header>
			<div className="flex flex-col xl:flex-row-reverse max-w-[514px] mx-auto xl:max-w-none xl:gap-20">
				<section className="basis-1/2">
					{data?.playground?.recordingUrl && (
						<PlaygroundRecordingModal
							urlRecording={data?.playground?.recordingUrl}
						/>
					)}

					<div className="">
						<AdaptiveDialog
							button={
								<Button
									disabled={data?.studentReview}
									className="w-full h-[57px] mb-10 font-semibold gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#039855]"
								>
									{data?.studentReview ? <FaCheck /> : <FaStar />}{" "}
									{data?.studentReview
										? t("review_submitted", { ns: "feedback" })
										: t("submit_review", { ns: "feedback" })}
								</Button>
							}
							open={openReview}
							setOpen={setOpenReview}
						>
							<StudentReviewModal
								studentId={data?.student?.id}
								lessonId={data?.id}
								closeModal={() => {
									refetch();
									setOpenReview(false);
								}}
							/>
						</AdaptiveDialog>
					</div>
				</section>

				<section className="basis-1/2">
					<Tabs defaultValue="feedback">
						<TabsList className="w-full">
							<TabsTrigger value="feedback" className="w-full">
								{t("feedback", { ns: "feedback" })}
							</TabsTrigger>
							<TabsTrigger value="lessonInfo" className="w-full">
								{t("lesson_info", { ns: "feedback" })}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="feedback">
							<FeedbackInfo data={data} />
						</TabsContent>
						<TabsContent value="lessonInfo">
							<LessonInfo data={data} />
						</TabsContent>
					</Tabs>
				</section>
			</div>
		</>
	);
}

export default Feedback;
