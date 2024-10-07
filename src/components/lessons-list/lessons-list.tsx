import { useAuth } from '@/app/providers/auth-provider';
import { useNotifications } from '@/app/providers/notification-provider';
import { Badge } from '@/components/badge';
import Button from '@/components/form/button';
import { LessonsCalendar, LessonsTable } from '@/components/lessons-list';
import Loader from '@/components/loader/loader';
import { sortCalendarEvents } from '@/shared/utils/sort-calendar-events';
import type { CalendarEventProcessed, CalendarEventsSorted } from '@/types';
import { LessonStatusType, type Lesson, type PackageSubscription } from '@/types/types.generated';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface LessonsListProps {
  getAppointments: () => void;
  appointments:
    | {
        lessons: Lesson[];
      }
    | undefined;
  loadingAppointments: boolean;
  planStatus: PackageSubscription;
}

const LessonsList: React.FC<LessonsListProps> = ({
  getAppointments,
  appointments,
  loadingAppointments,
  planStatus,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    selectedTab: 'upcomingLessons',
  });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [t] = useTranslation(['lessons']);
  const { user } = useAuth();
  const { notifications, getCountNotification, removeNotifications } = useNotifications();

  useEffect(() => {
    getAppointments();
    if (searchParams.get('selectedTab') === 'upcomingLessons') {
      setTimeout(() => {
        removeNotifications(LessonStatusType.Scheduled, LessonStatusType.Rescheduled);
      }, 300);
    }
  }, [notifications]);

  const [calendarAppointments, setCalendarAppointments] = useState<CalendarEventProcessed[]>([]);
  const [tableAppointments, setTableAppointments] = useState<CalendarEventsSorted[]>([]);

  useEffect(() => {
    if (appointments?.lessons && user?.timeZone) {
      const sortedEvents = sortCalendarEvents(appointments.lessons, user?.timeZone);

      if (sortedEvents) {
        const { calendarEvents, tablularEventData } = sortedEvents;

        setCalendarAppointments(
          calendarEvents.filter((event) => event.status !== LessonStatusType.Canceled),
        );
        setTableAppointments(tablularEventData);
      }
    }
  }, [appointments, user?.timeZone]);

  const onClickPastLessons = () => {
    navigate('?selectedTab=pastLessons');
  };

  const onClickUpcomingLessons = () => {
    navigate('?selectedTab=upcomingLessons');
    removeNotifications(LessonStatusType.Scheduled, LessonStatusType.Rescheduled);
  };

  const onCalendarClick = () => {
    navigate('?selectedTab=calendar');
  };

  useEffect(() => {
    if (isMobile && searchParams.get('selectedTab') === 'calendar') {
      navigate('?selectedTab=upcomingLessons');
    }
  }, [isMobile]);

  return (
    <>
      {loadingAppointments ? (
        <Loader height="100%" />
      ) : (
        <div className="h-full">
          <div>
            <h1 className="mb-4 text-[32px] font-bold">{t('lessons', { ns: 'lessons' })}</h1>
            <div className="row container-fluid m-0 p-0">
              <div className="flex flex-wrap gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="grid grid-cols-2 w-full sm:flex sm:w-auto">
                  <Button
                    theme="outline"
                    className={`relative ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
                      searchParams.get('selectedTab') === 'upcomingLessons' &&
                      'bg-color-dark-purple text-white'
                    }`}
                    onClick={onClickUpcomingLessons}
                  >
                    <span>{t('upcoming_lessons', { ns: 'lessons' })}</span>
                    {getCountNotification(
                      LessonStatusType.Scheduled,
                      LessonStatusType.Rescheduled,
                    ) > 0 && (
                      <Badge
                        count={getCountNotification(
                          LessonStatusType.Scheduled,
                          LessonStatusType.Rescheduled,
                        )}
                      />
                    )}
                  </Button>
                  <Button
                    theme="outline"
                    className={`ml-[-4px] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
                      searchParams.get('selectedTab') === 'pastLessons' &&
                      'bg-color-dark-purple text-white'
                    }`}
                    onClick={onClickPastLessons}
                  >
                    <span>{t('past_lessons', { ns: 'lessons' })}</span>
                  </Button>
                </div>

                <Button
                  theme="outline"
                  className={`focus:shadow-none hidden sm:block hover:bg-color-dark-purple hover:text-white ${
                    searchParams.get('selectedTab') === 'calendar' &&
                    'bg-color-dark-purple text-white'
                  }`}
                  onClick={onCalendarClick}
                >
                  <span>{t('calendar_view', { ns: 'lessons' })}</span>
                </Button>
              </div>
            </div>
          </div>

          <div>
            {!loadingAppointments && searchParams.get('selectedTab') !== 'calendar' && (
              <LessonsTable
                tableAppointments={tableAppointments}
                planStatus={planStatus}
                selectedTab={searchParams.get('selectedTab') ?? undefined}
                getAppointments={getAppointments}
              />
            )}
            {!isMobile &&
              !loadingAppointments &&
              searchParams.get('selectedTab') === 'calendar' && (
                <div className="mt-4">
                  <LessonsCalendar
                    calendarAppointments={calendarAppointments}
                    getAppointments={getAppointments}
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default LessonsList;
