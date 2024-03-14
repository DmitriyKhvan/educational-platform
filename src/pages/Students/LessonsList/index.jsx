import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { useQuery } from '@apollo/client';
import { format } from 'date-fns-tz';
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

const sortCalendarEvents = (data) => {
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
      const date = moment(eventDate.startAt).utc(0, true).unix();
      const endEpoch = date + eventDate.duration * 60;
      const startAt = moment.unix(date).utc(0, true);
      const end_at = moment.unix(endEpoch).utc(0, true);
      const iterateEvents = {
        zoom: eventDate.zoom,
        lesson: eventDate?.packageSubscription?.package?.course?.title,
        startAt,
        end_at,
        type: eventDate.type,
        mentor: eventDate.mentor,
        student: eventDate.student,
        eventDate,
        status: eventDate.status,
      };

      calendarEvents.push(iterateEvents);
    }
  });

  const tablularEventData = [];
  for (const eventKey of eventKeys) {
    for (const eventDate of eventDates[eventKey]) {
      const date = moment(eventDate.startAt).utc(0, true).unix();
      const mentor = eventDate.mentor
        ? eventDate.mentor?.user?.firstName +
          ' ' +
          eventDate.mentor?.user?.lastName?.charAt(0)?.toUpperCase() +
          '.'
        : '';
      const startTime = moment.unix(date).utc(0, true).format('hh:mm a');
      const tableRow = {
        dateTime: {
          startTime,
          endTime: moment
            .unix(date)
            .utc(0, true)
            .add(eventDate.duration, 'minutes')
            .format('hh:mm a'),
          date: moment.unix(date).utc(0, true).format('ddd, MMM D'),
        },
        sessionTime: new Date(
          `${moment.unix(date).utc(0, true).format('ddd, MMM D')},${startTime}`,
        ),
        onClick: {
          date,
        },
        mentor,
        resource: eventDate,
      };
      tablularEventData.push(tableRow);
    }
  }
  return { tablularEventData, calendarEvents };
};

const LessonsList = () => {
  const [t] = useTranslation(['lessons']);

  const { notifications, getCountNotification, removeNotifications } =
    useNotifications();

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      // studentId: user?.students[0]?.id,
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
    // to update content after receiving notification
    getAppointments();
    //reset the notification badge for the current tab
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

  // const customStyles = {
  //   content: {
  //     top: '50%',
  //     left: '50%',
  //     right: 'auto',
  //     bottom: 'auto',
  //     marginRight: '-50%',
  //     transform: 'translate(-50%, -50%)',
  //     zIndex: 9999,
  //     background: 'none',
  //     border: 'none',
  //   },
  //   overlay: {
  //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   },
  // };

  // useEffect(() => {
  //   if (calendarAppointments) {
  //     const tempEvents = [];
  //     calendarAppointments.forEach((_, index) => {
  //       const start = moment(calendarAppointments[index].startAt).tz(
  //         userTimezone,
  //       );
  //       const end = moment(calendarAppointments[index].end_at).tz(userTimezone);
  //       const event = {
  //         id: index,
  //         title: calendarAppointments[index]?.lesson,
  //         start: start.toDate(),
  //         end: end.toDate(),
  //         resource: calendarAppointments[index],
  //       };
  //       tempEvents.push(event);
  //     });
  //     setCalendarEvents([...tempEvents]);
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [calendarAppointments]);

  // useEffect(() => {
  //   if (tableAppointments) {
  //     const tempUpcomingLessons = [];
  //     const tempPastLessons = [];

  //     tableAppointments.map((each) => {
  //       const isWithin24hour = isWithinHours({
  //         dateEnd: new Date(each.resource.startAt),
  //         dateStart: new Date(each.resource.canceledAt),
  //         hours: 24,
  //         userTimezone,
  //       });

  //       const endLesson = addMinutes(
  //         new Date(each.resource.startAt),
  //         each.resource.duration,
  //       );

  //       if (
  //         (isAfter(new Date(), endLesson) &&
  //           each.resource.status !== LessonsStatusType.CANCELED) ||
  //         (isWithin24hour && each.resource.canceledBy === Roles.STUDENT)
  //       ) {
  //         tempPastLessons.push(each);
  //       } else if (
  //         each.resource.status === LessonsStatusType.APPROVED ||
  //         each.resource.status === LessonsStatusType.SCHEDULED ||
  //         each.resource.status === LessonsStatusType.RESCHEDULED
  //       ) {
  //         tempUpcomingLessons.push(each);
  //       }
  //     });

  //     const sortPastLessons = [...tempPastLessons].sort(
  //       (a, b) => new Date(b.resource.startAt) - new Date(a.resource.startAt),
  //     );

  //     const sortUpcomingLessons = [...tempUpcomingLessons].sort(
  //       (a, b) => new Date(b.resource.startAt) - new Date(a.resource.startAt),
  //     );

  //     setUpcomingLessons(sortUpcomingLessons);
  //     setPastLessons(sortPastLessons);

  //     // to update content after receiving notification
  //     setDisplayTableData(
  //       selectedTab === 'pastLessons' ? sortPastLessons : sortUpcomingLessons,
  //     );
  //     setIsLoading(false);
  //   }
  // }, [tableAppointments]);

  // const CustomModal = () => {
  //   // if it defaults to undefined then it is your fault, im not testing this
  //   const [selectedEvent] =
  //     calendarEvents?.filter((x) => x.id === calendarEvent.id) ?? [];

  //   return (
  //     <div style={{ zIndex: 9999 }} className="container">
  //       <Modal
  //         isOpen={isOpen}
  //         onRequestClose={closeModal}
  //         style={customStyles}
  //         contentLabel="Example Modal"
  //       >
  //         <div className="p-8 bg-white rounded-2xl">
  //           <LessonInfoModal
  //             date={selectedEvent.start}
  //             data={selectedEvent.resource}
  //             refetch={getAppointments}
  //             duration={selectedEvent.resource.eventDate.duration}
  //             userTimezone={userTimezone}
  //           />
  //         </div>
  //       </Modal>
  //     </div>
  //   );
  // };

  const onClickPastLessons = () => {
    setIsCalendar(false);
    // setDisplayTableData([...pastLessons]);
    setSelectedTab('pastLessons');
  };

  const onClickUpcomingLessons = () => {
    setIsCalendar(false);
    // setDisplayTableData([...upcomingLessons]);
    setSelectedTab('upcomingLessons');
    removeNotifications(LessonsStatusType.APPROVED);
  };

  const onCalendarClick = () => {
    setIsCalendar(true);
    setSelectedTab('calendar');
  };

  // const localizer = momentLocalizer(moment.tz.setDefault(userTimezone));
  // const allViews = ['month', 'week', 'day'];
  // const formats = {
  //   dateFormat: 'D',
  //   weekdayFormat: 'dddd',
  //   dayFormat: 'dddd D',
  //   timeGutterFormat: 'hA',
  // };

  // const onSelectEvent = (e) => {
  //   const today = moment().format('MM/DD/YYYY hh:mm a');
  //   const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a');
  //   if (moment(today).isBefore(closedDate)) {
  //     setCalendarEvent(e);
  //     setIsOpen(true);
  //   }
  // };
  // const handleFeedback = () => {
  //   window.open(feedbackURL);
  // };

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);
  // const [isFeedbackModal, setFeedbackModal] = React.useState(false);

  // const handleOpenFeedbackModal = () => {
  //   setFeedbackModal(true);
  // };

  // const handleClodeFeedbackModal = () => {
  //   setFeedbackModal(false);
  // };

  // useEffect(() => {
  //   if (location.search.includes('completed')) {
  //     onClickPastLessons();
  //   }
  // }, [pastLessons]);

  // const eventPropGetter = useCallback((event) => {
  //   return {
  //     ...((event.resource.status === LessonsStatusType.SCHEDULED ||
  //       event.resource.status === LessonsStatusType.RESCHEDULED ||
  //       event.resource.status === LessonsStatusType.COMPLETED) && {
  //       style: {
  //         filter: 'grayscale(100%) opacity(0.8)',
  //       },
  //     }),
  //   };
  // }, []);

  // const noLessonMessage = (
  //   <>
  //     {selectedTab === 'pastLessons' ? (
  //       <div className="w-full bg-gray-50 rounded-lg mt-8 py-[47px]">
  //         <p className="text-color-dark-purple text-sm text-center mb-6">
  //           You don’t have completed lessons yet
  //         </p>
  //       </div>
  //     ) : (
  //       <div className="w-full bg-gray-50 rounded-lg mt-8 py-[47px]">
  //         <p className="text-color-dark-purple text-sm text-center mb-6">
  //           You have{' '}
  //           <span className="text-color-purple font-medium">
  //             {planStatus.reduce((prev, curr) => prev + curr.credits, 0)}{' '}
  //             available
  //           </span>{' '}
  //           lessons
  //         </p>
  //         <div className="flex justify-center gap-3">
  //           <Link
  //             to="/student/schedule-lesson/select"
  //             className="block rounded-lg bg-color-purple px-4 py-4 text-white font-medium sm:font-semibold text-xs sm:text-sm text-center"
  //           >
  //             {t('schedule_by_time', { ns: 'dashboard' })}
  //           </Link>
  //           <Link
  //             to="/student/mentors-list"
  //             className="block rounded-lg bg-color-purple px-4 py-4 text-white font-medium sm:font-semibold text-xs sm:text-sm text-center"
  //           >
  //             {t('schedule_by_mentor', { ns: 'dashboard' })}
  //           </Link>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <Layout>
      {loadingAppointments && (
        <div className="absolute w-full h-full top-0 left-0 z-[10001] bg-black/40">
          {/* <Loader height={'100vh'}></Loader> */}
        </div>
      )}
      {/* <div className="mx-3 my-2 sm:mx-6 sm:my-4 2xl:mx-16 2xl:my-12"> */}
      <div className="px-5 py-6 sm:p-10 min-h-screen">
        {/* <button onClick={() => setReviewLessonModal(true)}>Hey</button> */}

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
          {
            !loadingAppointments && !isCalendar && (
              <Table
                tableAppointments={tableAppointments}
                planStatus={planStatus}
                selectedTab={selectedTab}
                getAppointments={getAppointments}
              />
            )
            // (displayTableData?.length ? (
            //   isDesktop ? (
            //     <LessonTable
            //       displayTableData={displayTableData}
            //       userTimezone={userTimezone}
            //       handleOpenFeedbackModal={handleOpenFeedbackModal}
            //       handleFeedback={handleFeedback}
            //     />
            //   ) : (
            //     <LessonTableMobile
            //       displayTableData={displayTableData}
            //       getAppointments={getAppointments}
            //       userTimezone={userTimezone}
            //       handleOpenFeedbackModal={handleOpenFeedbackModal}
            //       handleFeedback={handleFeedback}
            //     />
            //   )
            // ) : (
            //   <NoLessonsMessage
            //     selectedTab={selectedTab}
            //     availableCredits={planStatus.reduce(
            //       (prev, curr) => prev + curr.credits,
            //       0,
            //     )}
            //   />
            // ))
          }
          {!loadingAppointments && isCalendar && (
            <div className="mt-4">
              <Calendar
                calendarAppointments={calendarAppointments}
                // setIsLoading={setIsLoading}
                // onSelectEvent={onSelectEvent}
                getAppointments={getAppointments}
              />
              {/* <BigCalendar
                style={{ minHeight: '70vh', minWidth: '559px' }}
                popup={true}
                formats={formats}
                events={calendarEvents}
                localizer={localizer}
                onSelectEvent={onSelectEvent}
                views={allViews}
                showMultiDayTimes
                startAccessor="start"
                eventPropGetter={eventPropGetter}
                endAccessor="end"
                components={{
                  month: {
                    header: WeekHeader,
                  },
                  week: {
                    header: WeekHeader,
                  },
                }}
                messages={{
                  month: t('calendar_month', { ns: 'lessons' }),
                  week: t('calendar_week', { ns: 'lessons' }),
                  day: t('calendar_day', { ns: 'lessons' }),
                  previous: t('calendar_prev', { ns: 'lessons' }),
                  next: t('calendar_next', { ns: 'lessons' }),
                  today: t('calendar_today', { ns: 'lessons' }),
                }}
              /> */}
            </div>
          )}
        </div>
      </div>
      {/* <FeedbackLessonModal
        modalState="student"
        isOpen={isFeedbackModal}
        closeModal={handleClodeFeedbackModal}
      /> */}
      {/* {isOpen && <CustomModal />} */}
      {loadingAppointments && <Loader />}
      <ReviewLessonModal
        isOpen={isReviewLessonModalOpen}
        setIsOpen={setReviewLessonModal}
      />
    </Layout>
  );
};

export default LessonsList;
