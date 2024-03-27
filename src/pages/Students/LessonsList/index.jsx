import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@apollo/client';
import { format, utcToZonedTime } from 'date-fns-tz';
import Button from 'src/components/Form/Button';
import { Badge } from 'src/components/Badge';
import { useNotifications } from 'src/modules/notifications';
import { APPOINTMENTS_QUERY, PACKAGE_QUERY } from 'src/modules/auth/graphql';
import { LessonsStatusType, getItemToLocalStorage } from 'src/constants/global';
import Layout from 'src/layouts/DashboardLayout';
import Loader from 'src/components/Loader/Loader';
import ReviewLessonModal from 'src/components/student-dashboard/ReviewLessonModal';
import Calendar from './Calendar';
import Table from './Table';
import { useAuth } from 'src/modules/auth';
import { addMinutes } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

const sortCalendarEvents = (data, timeZone) => {
  if (!data) return;
  let eventDates = {};
  data.forEach((apt) => {
    let startAt = new Date(apt.startAt);
    let date = format(startAt, 'yyyy-MM-dd');
    if (eventDates[date]) {
      eventDates[date].push(apt);
    } else {
      eventDates[date] = [apt];
    }
  });

  const eventKeys = Object.keys(eventDates);
  const calendarEvents = [];
  eventKeys.forEach((key) => {
    for (const eventDate of eventDates[key]) {
      const iterateEvents = {
        zoom: eventDate.zoom,
        lesson: eventDate?.packageSubscription?.package?.course?.title,
        courseId: eventDate?.packageSubscription?.package?.course?.id,
        startAt: utcToZonedTime(new Date(eventDate.startAt), timeZone),
        end_at: addMinutes(
          utcToZonedTime(new Date(eventDate.startAt), timeZone),
          eventDate.duration,
        ),
        type: eventDate.type,
        mentor: eventDate.mentor,
        student: eventDate.student,
        eventDate,
        status: eventDate.status,
        packageSubscription: eventDate.packageSubscription,
      };

      calendarEvents.push(iterateEvents);
    }
  });

  const tablularEventData = [];
  for (const eventKey of eventKeys) {
    for (const eventDate of eventDates[eventKey]) {
      const mentor = eventDate.mentor
        ? eventDate.mentor?.user?.firstName +
          ' ' +
          eventDate.mentor?.user?.lastName?.charAt(0)?.toUpperCase() +
          '.'
        : '';

      const startTime = format(
        utcToZonedTime(new Date(eventDate.startAt), timeZone),
        'hh:mm a',
        { timeZone: timeZone },
      );
      const endTime = format(
        addMinutes(
          utcToZonedTime(new Date(eventDate.startAt), timeZone),
          eventDate.duration,
        ),
        'hh:mm a',
        { timeZone: timeZone },
      );

      const tableRow = {
        dateTime: {
          startTime,
          endTime: endTime,
          date: format(
            utcToZonedTime(new Date(eventDate.startAt), timeZone),
            'eee, MMM do',
            { timeZone: timeZone },
          ),
        },
        sessionTime: new Date(eventDate.startAt),
        mentor,
        resource: eventDate,
      };
      tablularEventData.push(tableRow);
    }
  }
  return { tablularEventData, calendarEvents };
};

const LessonsList = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [t] = useTranslation(['lessons']);
  const { user } = useAuth();

  const { notifications, getCountNotification, removeNotifications } =
    useNotifications();

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      studentId: getItemToLocalStorage('studentId'),
      status: `approved,scheduled,rescheduled,paid,completed,in_progress,canceled`,
    },
    fetchPolicy: 'no-cache',
  });

  const { data: { packageSubscriptions: planStatus = [] } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      fetchPolicy: 'no-cache',
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    },
  );

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

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);

  useEffect(() => {
    if (isMobile && selectedTab === 'calendar') {
      setIsCalendar(false);
      setSelectedTab('upcomingLessons');
    }
  }, [isMobile]);

  return (
    <Layout>
      {loadingAppointments && (
        <div className="absolute w-full h-full top-0 left-0 z-[10001] bg-black/40">
          <Loader height={'100vh'}></Loader>
        </div>
      )}
      <div className="px-5 py-6 sm:p-10 min-h-screen">
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
            <Table
              tableAppointments={tableAppointments}
              planStatus={planStatus}
              selectedTab={selectedTab}
              getAppointments={getAppointments}
            />
          )}
          {!isMobile && !loadingAppointments && isCalendar && (
            <div className="mt-4">
              <Calendar
                calendarAppointments={calendarAppointments}
                getAppointments={getAppointments}
              />
            </div>
          )}
        </div>
      </div>
      {/* <FeedbackLessonModal
        modalState="student"
        isOpen={isFeedbackModal}
        closeModal={handleClodeFeedbackModal}
      /> */}
      {loadingAppointments && <Loader />}
      <ReviewLessonModal
        isOpen={isReviewLessonModalOpen}
        setIsOpen={setReviewLessonModal}
      />
    </Layout>
  );
};

export default LessonsList;
