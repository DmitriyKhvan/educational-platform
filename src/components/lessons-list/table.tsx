import { useAuth } from '@/app/providers/auth-provider';
import { NoLessonsMessage } from '@/components/lessons-list';
import LessonTable from '@/components/student-dashboard/lesson-table';
import { LessonTableMobile } from '@/components/student-dashboard/lesson-table-mobile';
import { isWithinHours } from '@/shared/utils/is-within-hours';
import type { CalendarEventsSorted } from '@/types';
import { LessonStatusType, type PackageSubscription, UserRoleType } from '@/types/types.generated';
import { addMinutes, isAfter } from 'date-fns';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

interface TableProps {
  tableAppointments: CalendarEventsSorted[];
  getAppointments: () => void;
  selectedTab?: string;
  planStatus: PackageSubscription[];
  handleOpenFeedbackModal?: () => void;
  handleFeedback?: () => void;
}

const Table: React.FC<TableProps> = ({
  tableAppointments,
  getAppointments,
  selectedTab,
  planStatus,
  handleOpenFeedbackModal,
  handleFeedback,
}) => {
  const [displayTableData, setDisplayTableData] = useState<CalendarEventsSorted[]>([]);
  const isDesktop = useMediaQuery({ minWidth: 1307 });

  const [pastLessons, setPastLessons] = useState<CalendarEventsSorted[]>([]);
  const [upcomingLessons, setUpcomingLessons] = useState<CalendarEventsSorted[]>([]);

  const { user } = useAuth();

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (tableAppointments) {
      const tempUpcomingLessons: CalendarEventsSorted[] = [];
      const tempPastLessons: CalendarEventsSorted[] = [];

      // biome-ignore lint/complexity/noForEach: <explanation>
      tableAppointments.forEach((each) => {
        const duration = Number(each.resource.duration) ?? 0;
        const isWithin24hour = isWithinHours({
          dateEnd: new Date(each.resource.startAt),
          dateStart: new Date(each.resource.canceledAt),
          hours: 24,
          userTimezone,
        });

        const endLesson = addMinutes(new Date(each.resource.startAt), duration ?? 0);

        if (
          (isAfter(new Date(), endLesson) && each.resource.status !== LessonStatusType.Canceled) ||
          (isWithin24hour && each.resource.canceledBy === UserRoleType.Student)
        ) {
          tempPastLessons.push(each);
        } else if (
          each.resource.status === LessonStatusType.Approved ||
          each.resource.status === LessonStatusType.Scheduled ||
          each.resource.status === LessonStatusType.Rescheduled
        ) {
          tempUpcomingLessons.push(each);
        }
      });

      const sortPastLessons = [...tempPastLessons].sort(
        (a, b) => new Date(b.resource.startAt).getTime() - new Date(a.resource.startAt).getTime(),
      );

      const sortUpcomingLessons = [...tempUpcomingLessons].sort(
        (a, b) => new Date(a.resource.startAt).getTime() - new Date(b.resource.startAt).getTime(),
      );

      setUpcomingLessons(sortUpcomingLessons);
      setPastLessons(sortPastLessons);
    }
  }, [tableAppointments, userTimezone]);

  useEffect(() => {
    if (upcomingLessons && pastLessons) {
      setDisplayTableData(
        selectedTab === 'upcomingLessons' ? [...upcomingLessons] : [...pastLessons],
      );
    }
  }, [selectedTab, upcomingLessons, pastLessons]);

  return displayTableData.length ? (
    isDesktop ? (
      <LessonTable
        displayTableData={displayTableData}
        userTimezone={userTimezone}
        getAppointments={getAppointments}
        handleOpenFeedbackModal={handleOpenFeedbackModal}
        handleFeedback={handleFeedback}
      />
    ) : (
      <LessonTableMobile displayTableData={displayTableData} getAppointments={getAppointments} />
    )
  ) : (
    <NoLessonsMessage
      selectedTab={selectedTab}
      //   availableCredits={planStatus?.reduce((prev, curr) => prev + (curr.credits || 0), 0)} // wasn't used properly in the first place
      availableCredits={
        planStatus?.reduce(
          (acc: number, curr: PackageSubscription) => acc + (curr?.credits ?? 0),
          0,
        ) ?? 0
      }
    />
  );
};

export default Table;
