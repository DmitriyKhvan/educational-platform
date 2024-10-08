import Indicator from '@/components/indicator';
import { LessonStatusType } from '@/types/types.generated';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';

const StatusIndicator = ({
  status,
}: {
  status?: LessonStatusType | null;
}) => {
  const [t] = useTranslation('lessons');

  switch (status) {
    //scheduled,paid,completed,in_progress,approved
    case LessonStatusType.Scheduled:
    case LessonStatusType.Rescheduled:
      return <Indicator>{t(LessonStatusType.Scheduled)}</Indicator>;
    case LessonStatusType.Approved:
      return (
        <Indicator className="bg-color-purple text-color-purple">
          {t(LessonStatusType.Approved)}
        </Indicator>
      );
    case LessonStatusType.Completed:
      return (
        <Indicator className="bg-green-300 text-green-500">
          <FaCheck /> {t(LessonStatusType.Completed)}
        </Indicator>
      );

    case LessonStatusType.Canceled:
      return (
        <Indicator className="bg-color-red text-color-red">
          {t(LessonStatusType.Canceled)}
        </Indicator>
      );
    default:
      return <></>;
  }
};

export default StatusIndicator;
