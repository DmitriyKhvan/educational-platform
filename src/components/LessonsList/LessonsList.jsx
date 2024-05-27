import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'src/components/Form/Button';
import { Badge } from 'src/components/Badge';
import { useNotifications } from 'src/app/providers/NotificationProvider';
import { LessonsStatusType } from 'src/shared/constants/global';
import Loader from 'src/components/Loader/Loader';
import { LessonsCalendar, LessonsTable } from 'src/components/LessonsList';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useMediaQuery } from 'react-responsive';
import { sortCalendarEvents } from 'src/shared/utils/sortCalendarEvents';

const LessonsList = ({
  getAppointments,
  appointments,
  loadingAppointments,
  planStatus,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [t] = useTranslation(['lessons']);
  const { user } = useAuth();

  const { notifications, getCountNotification, removeNotifications } =
    useNotifications();

  useEffect(() => {
    getAppointments();
    if (selectedTab === 'upcomingLessons') {
      setTimeout(() => {
        removeNotifications(LessonsStatusType.APPROVED);
      }, 300);
    }
  }, [notifications]);

  const [calendarAppointments, setCalendarAppointments] = useState([]);
  const [tableAppointments, setTableAppointments] = useState([]);

  useEffect(() => {
    if (appointments) {
      const { calendarEvents, tablularEventData } = sortCalendarEvents(
        appointments?.lessons,
        user.timeZone,
      );

      setCalendarAppointments(
        calendarEvents.filter(
          (event) => event.status !== LessonsStatusType.CANCELED,
        ),
      );
      setTableAppointments(tablularEventData);
    }
  }, [appointments]);

  const [selectedTab, setSelectedTab] = useState('upcomingLessons');

  const [isCalendar, setIsCalendar] = useState(false);

  const onClickPastLessons = () => {
    setIsCalendar(false);
    setSelectedTab('pastLessons');
  };

  const onClickUpcomingLessons = () => {
    setIsCalendar(false);
    setSelectedTab('upcomingLessons');
    removeNotifications(LessonsStatusType.APPROVED);
  };

  const onCalendarClick = () => {
    setIsCalendar(true);
    setSelectedTab('calendar');
  };

  useEffect(() => {
    if (isMobile && selectedTab === 'calendar') {
      setIsCalendar(false);
      setSelectedTab('upcomingLessons');
    }
  }, [isMobile]);

  return (
    <>
      {loadingAppointments ? (
        <Loader height="100%" />
      ) : (
        <div className="h-full">
          <div>
            <h1 className="mb-4 text-[32px] font-bold">
              {t('lessons', { ns: 'lessons' })}
            </h1>
            <div className="row container-fluid m-0 p-0">
              <div className="flex flex-wrap gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="grid grid-cols-2 w-full sm:flex sm:w-auto">
                  <Button
                    theme="outline"
                    className={`relative ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
                      selectedTab === 'upcomingLessons' &&
                      'bg-color-dark-purple text-white'
                    }`}
                    onClick={onClickUpcomingLessons}
                  >
                    <span>{t('upcoming_lessons', { ns: 'lessons' })}</span>
                    {getCountNotification(LessonsStatusType.APPROVED) > 0 && (
                      <Badge
                        count={getCountNotification(LessonsStatusType.APPROVED)}
                      />
                    )}
                  </Button>
                  <Button
                    theme="outline"
                    className={`ml-[-4px] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
                      selectedTab === 'pastLessons' &&
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
                    selectedTab === 'calendar' &&
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
            {!loadingAppointments && !isCalendar && (
              <LessonsTable
                tableAppointments={tableAppointments}
                planStatus={planStatus}
                selectedTab={selectedTab}
                getAppointments={getAppointments}
              />
            )}
            {!isMobile && !loadingAppointments && isCalendar && (
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
