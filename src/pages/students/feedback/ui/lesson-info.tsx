import { getTranslatedTitle } from "@/shared/utils/get-translated-title";
import { useTranslation } from "react-i18next";
// import { getTranslatedTitle } from 'src/utils/getTranslatedTitle';

function LessonInfo({ data }) {
	// eslint-disable-next-line no-unused-vars
	const [t, i18n] = useTranslation(["common", "feedback", "lessons"]);

	return (
		<div className="mt-6 space-y-6">
			<div>
				<p className="text-color-light-grey text-sm mb-3 block">
					{t("topic_lesson", { ns: "feedback" })}
				</p>
				<p className="bg-color-dashboard-bg p-4 font-medium text-color-dark-violet text-sm min-h-14 rounded-lg">
					{getTranslatedTitle(data?.topic, i18n?.language)}
				</p>
			</div>

			<div>
				<p className="text-color-light-grey text-sm mb-3">
					{t("lesson_package", { ns: "lessons" })}
				</p>
				<p className="bg-color-dashboard-bg p-4 font-medium text-color-dark-violet text-sm min-h-14 rounded-lg">
					{getTranslatedTitle(
						data?.packageSubscription?.package?.course,
						i18n?.language,
					)}
				</p>
			</div>

			<div>
				<p className="text-color-light-grey text-sm mb-3">
					{t("mentor", { ns: "lessons" })}
				</p>
				<p className="bg-color-dashboard-bg p-4 font-medium text-color-dark-violet text-sm min-h-14 rounded-lg">
					{data?.mentor?.firstName}{" "}
					{data?.mentor?.lastName && `${data?.mentor?.lastName[0]}.`}
				</p>
			</div>

			<div>
				<p className="text-color-light-grey text-sm mb-3">
					{t("level", { ns: "lessons" })}
				</p>
				<p className="bg-color-dashboard-bg p-4 font-medium text-color-dark-violet text-sm min-h-14 rounded-lg">
					{getTranslatedTitle(data?.languageLevel, i18n?.language)}
				</p>
			</div>

			<div>
				<p className="text-color-light-grey text-sm mb-3">
					{t("duration", { ns: "feedback" })}
				</p>
				<p className="bg-color-dashboard-bg p-4 font-medium text-color-dark-violet text-sm min-h-14 rounded-lg">
					{data?.duration} {t("minutes")}
				</p>
			</div>
		</div>
	);
}

export default LessonInfo;
