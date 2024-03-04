import React from 'react';
import ScheduleCard from './ScheduleCardRebranding';

export const LessonTableMobile = ({
  displayTableData,
  getAppointments,
  // handleFeedback,
}) => {
  return (
    <ul>
      {displayTableData?.map((data, idx) => (
        <li key={data?.resource?.id ?? idx}>
          <ScheduleCard
            // key={data?.resource?.id ?? idx}
            duration={data?.resource?.duration}
            lesson={data?.resource?.packageSubscription?.package?.course?.title}
            mentor={data?.resource?.mentor}
            zoom={data?.resource?.zoom}
            date={data?.resource?.startAt}
            data={data?.resource}
            index={idx}
            fetchAppointments={getAppointments}
          />
        </li>
      ))}
    </ul>
  );
};
