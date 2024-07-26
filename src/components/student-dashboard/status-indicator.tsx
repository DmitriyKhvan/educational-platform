
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import { LessonsStatusType } from "@/shared/constants/global";
import Indicator from "@/components/indicator";

const StatusIndicator = ({ status }: {
	status: LessonsStatusType;
}) => {
	const [t] = useTranslation("lessons");

	switch (status) {
		//scheduled,paid,completed,in_progress,approved
		case LessonsStatusType.SCHEDULED:
		case LessonsStatusType.RESCHEDULED:
			return <Indicator>{t(LessonsStatusType.SCHEDULED)}</Indicator>;
		case LessonsStatusType.APPROVED:
			return (
				<Indicator className="bg-color-purple text-color-purple">
					{t(LessonsStatusType.APPROVED)}
				</Indicator>
			);
		case LessonsStatusType.COMPLETED:
			return (
				<Indicator className="bg-green-300 text-green-500">
					<FaCheck /> {t(LessonsStatusType.COMPLETED)}
				</Indicator>
			);

		case LessonsStatusType.CANCELED:
			return (
				<Indicator className="bg-color-red text-color-red">
					{t(LessonsStatusType.CANCELED)}
				</Indicator>
			);
		default:
			return <></>;
	}
};

export default StatusIndicator;
