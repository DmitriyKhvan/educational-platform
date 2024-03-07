import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';
import { LessonsStatusType } from 'src/constants/global';

const StatusIndicator = ({ status }) => {
  const [t] = useTranslation('lessons');

  switch (status) {
    //scheduled,paid,completed,in_progress,approved
    case LessonsStatusType.SCHEDULED:
    case LessonsStatusType.RESCHEDULED:
      return (
        <span className="bg-gray-300 text-gray-700 bg-opacity-20 inline-block text-sm font-medium px-3 py-2 rounded-2xl">
          {t(LessonsStatusType.SCHEDULED)}
        </span>
      );
    case LessonsStatusType.APPROVED:
      return (
        <span className="bg-color-purple text-color-purple bg-opacity-20 inline-block text-sm font-medium px-3 py-2 rounded-2xl">
          {t(LessonsStatusType.APPROVED, { ns: 'lessons' })}
        </span>
      );
    case LessonsStatusType.COMPLETED:
      return (
        <span className="inline-block bg-green-300 text-green-500 bg-opacity-20 text-sm font-medium px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-1">
            <FaCheck /> {t(LessonsStatusType.COMPLETED, { ns: 'lessons' })}
          </div>
        </span>
      );

    case LessonsStatusType.CANCELED:
      return (
        <span className="inline-block bg-color-red text-color-red bg-opacity-10 text-sm font-medium px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-1">
            {t(LessonsStatusType.CANCELED, { ns: 'lessons' })}
          </div>
        </span>
      );

    // case LessonsStatusType.RESCHEDULED:
    //   return (
    //     <span className="inline-block bg-[#FFC700] text-[#FFC700] bg-opacity-10 text-sm font-medium px-3 py-2 rounded-2xl">
    //       <div className="flex items-center gap-1">Rescheduled</div>
    //     </span>
    //   );
    default:
      return <span></span>;
  }
  // return (
  //   <div>StatusIndicator</div>
  // )
};

export default StatusIndicator;
