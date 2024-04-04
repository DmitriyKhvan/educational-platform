import React from 'react';
import ScheduleCard from './ScheduleCardRebranding';

export const LessonTableMobile = ({
  displayTableData,
  getAppointments,
  // handleFeedback,
}) => {
  return (
    <ul>
      {displayTableData?.map((data, idx) => {
        return (
          <li key={data?.resource?.id ?? idx}>
            <ScheduleCard
              // key={data?.resource?.id ?? idx}
              duration={data?.resource?.duration}
              lesson={
                data?.resource?.packageSubscription?.package?.course?.title
              }
              mentor={data?.resource?.mentor}
              playground={data?.resource?.playground}
              date={data?.resource?.startAt}
              data={data?.resource}
              index={idx}
              fetchAppointments={getAppointments}
            />
          </li>
        );
      })}
    </ul>
  );
};
