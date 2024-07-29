import ScheduleCard from '@/components/student-dashboard/schedule-card-rebranding';
import type { CalendarEventsSorted } from '@/types';

export const LessonTableMobile = ({
  displayTableData,
  getAppointments,
}: {
  displayTableData: CalendarEventsSorted[];
  getAppointments: () => void;
}) => {
  return (
    <ul>
      {displayTableData?.map((data, idx) => {
        const duration = Number(data?.resource?.duration) ?? 0;
        return (
          <li key={data?.resource?.id ?? idx}>
            <ScheduleCard
              duration={duration}
              lesson={data?.resource?.packageSubscription?.package?.course?.title}
              mentor={data?.resource?.mentor}
              playground={data?.resource?.playground}
              date={data?.resource?.startAt}
              data={data?.resource}
              index={idx}
              fetchAppointments={getAppointments}
              subscription={data?.resource?.packageSubscription}
            />
          </li>
        );
      })}
    </ul>
  );
};
