import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { LessonsStatusType } from 'src/constants/global';

const StatusIndicator = ({ status }) => {
  switch (status) {
    //scheduled,paid,completed,in_progress,approved
    case LessonsStatusType.SCHEDULED:
      return (
        <span className="bg-gray-300 text-gray-700 bg-opacity-20 inline-block text-sm font-medium px-3 py-2 rounded-2xl">
          Pending
        </span>
      );
    case LessonsStatusType.APPROVED:
      return (
        <span className="bg-color-purple text-color-purple bg-opacity-20 inline-block text-sm font-medium px-3 py-2 rounded-2xl">
          Approved
        </span>
      );
    case LessonsStatusType.COMPLETED:
      return (
        <span className="inline-block bg-green-300 text-green-500 bg-opacity-20 text-sm font-medium px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-1">
            <FaCheck /> Completed
          </div>
        </span>
      );

    case LessonsStatusType.CANCELED:
      return (
        <span className="inline-block bg-color-red text-color-red bg-opacity-10 text-sm font-medium px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-1">Canceled</div>
        </span>
      );

    case LessonsStatusType.RESCHEDULED:
      return (
        <span className="inline-block bg-[#FFC7001A] text-[#FFC7001A] bg-opacity-10 text-sm font-medium px-3 py-2 rounded-2xl">
          <div className="flex items-center gap-1">Rescheduled</div>
        </span>
      );
    default:
      return <span></span>;
  }
  // return (
  //   <div>StatusIndicator</div>
  // )
};

export default StatusIndicator;
