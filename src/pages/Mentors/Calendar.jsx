import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar';
import moment from 'moment-timezone';
import Layout from '../../components/Layout';
import LessonTable from '../../components/mentor-dashboard/LessonTable';
import NotificationManager from '../../components/NotificationManager';
import ZoomWarningModal from '../../components/student-dashboard/ZoomWarningModal';
const ReviewLessonModal = lazy(() =>
  import('../../components/mentor-dashboard/ReviewLessonModal'),
);
import { format } from 'date-fns-tz';
import WeekHeader from '../../components/common/WeekHeader';
import '../../assets/styles/calendar.scss';
import { useAuth } from '../../modules/auth';
// import Swal from 'sweetalert2';
import {
  APPOINTMENTS_QUERY,
  APPROVE_APPOINTMENT,
} from '../../modules/auth/graphql';
import { useQuery, useMutation } from '@apollo/client';
import Loader from '../../components/Loader/Loader';
import { lowerCase } from 'lodash-es';
import ReactLoader from '../../components/common/Loader';
import RescheduleAndCancelModal from '../../components/student-dashboard/RescheduleAndCancelModal';
import notify from '../../utils/notify';
import { isBetween } from '../../utils/isBetween';
import { addMinutes, differenceInHours, isAfter } from 'date-fns';
import { LessonsStatusType, Roles } from 'src/constants/global';
import Button from 'src/components/Form/Button';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { useNotifications } from 'src/modules/notifications';

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
        tutor: eventDate.tutor,
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
      const mentor = eventDate.mentor.fullName || '';
      const startTime = moment.unix(date).utc(0, true).format('hh:mm a');
      const tableRow = {
        topic: eventDate?.package?.course?.title,
        level: eventDate?.students?.[0]?.level,
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

const Calendar = () => {
  const [t] = useTranslation(['lessons', 'modals']);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { notifications } = useNotifications();

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status:
        'approved,scheduled,rescheduled,paid,completed,in_progress,canceled',
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getAppointments();
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
      setIsCalendar(true);
    }
  }, [appointments]);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [pastLessons, setPastLessons] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [selectedTab, setSelectedTab] = useState('calendar');

  const [tabularData, setTabularData] = useState([]);
  const [isCalendar, setIsCalendar] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState({});
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      background: 'none',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  };

  const localizer = momentLocalizer(moment.tz.setDefault(userTimezone));
  const allViews = ['month', 'week', 'day'];
  const formats = {
    dateFormat: 'D',
    weekdayFormat: 'dddd',
    dayFormat: 'dddd D',
    timeGutterFormat: 'hA',
  };

  const fetchData = async () => {
    try {
      await getAppointments();
    } catch (error) {
      NotificationManager.error(error?.message || 'Server Issue', t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user?.mentor?.id) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = [];
      calendarAppointments.forEach((_, index) => {
        const start = moment(calendarAppointments[index].startAt).tz(
          userTimezone,
        );
        const end = moment(calendarAppointments[index].end_at).tz(userTimezone);
        const title = `${calendarAppointments[index]?.student.firstName} ${
          calendarAppointments[index]?.student.lastName
        } ${
          calendarAppointments[index]?.student?.langLevel
            ? `/ ${calendarAppointments[index].student.langLevel}`
            : ''
        }`;
        const event = {
          id: index,
          title,
          start: start.toDate(),
          end: end.toDate(),
          resource: calendarAppointments[index],
        };
        tempEvents.push(event);
      });
      setCalendarEvents([...tempEvents]);
    }
  }, [calendarAppointments]);

  useEffect(() => {
    if (tableAppointments) {
      const tempUpcomingLessons = [];
      const tempPastLessons = [];

      tableAppointments.map((each) => {
        const isWithin12hour =
          differenceInHours(
            new Date(each.resource.startAt),
            new Date(each.resource.canceledAt),
          ) <= 12;

        const endLesson = addMinutes(
          new Date(each.resource.startAt),
          each.resource.duration,
        );

        if (
          (isAfter(new Date(), endLesson) &&
            each.resource.status !== LessonsStatusType.CANCELED) ||
          (isWithin12hour && each.resource.canceledBy === Roles.STUDENT)
        ) {
          tempPastLessons.push(each);
        } else if (
          each.resource.status === LessonsStatusType.APPROVED ||
          each.resource.status === LessonsStatusType.SCHEDULED ||
          each.resource.status === LessonsStatusType.RESCHEDULED
        ) {
          tempUpcomingLessons.push(each);
        }
      });

      const sortPastLessons = [...tempPastLessons].sort(
        (a, b) => new Date(b.resource.startAt) - new Date(a.resource.startAt),
      );

      const sortUpcomingLessons = [...tempUpcomingLessons].sort(
        (a, b) => new Date(b.resource.startAt) - new Date(a.resource.startAt),
      );

      setUpcomingLessons(sortUpcomingLessons);
      setPastLessons(sortPastLessons);
    }
  }, [tableAppointments]);

  const onClickUpcomingLessons = () => {
    setTabularData([...upcomingLessons]);
    setIsCalendar(false);
    setSelectedTab('upcomingLessons');
  };
  const onClickPastLessons = () => {
    setTabularData([...pastLessons]);
    setIsCalendar(false);
    setSelectedTab('pastLessons');
  };
  const onCalendarClick = () => {
    setIsCalendar(true);
    setSelectedTab('calendar');
  };

  const onSelectEvent = (e) => {
    if (isLoading) {
      return;
    }

    setCalendarEvent(e);
    setIsCalendarModalOpen(true);
  };

  const closeCalendarModal = () => {
    setCalendarEvent({});
    setIsCalendarModalOpen(false);
  };

  const closeCancelLessonModal = () => {
    setIsCancelLessonModalOpen(false);
  };

  const onCancelLessonClick = () => {
    setTabIndex(0);
    // const [selectedEvent] = calendarEvents.filter(
    //   (x) => x.id === calendarEvent.id,
    // );
    setIsCalendarModalOpen(false);

    // const scheduledTime = moment(selectedEvent?.resource?.startAt).tz(
    //   userTimezone,
    // );

    // const isLate =
    //   moment.duration(moment(scheduledTime).diff(moment())).asHours() <= 24;
    // if (isLate) {
    //   Swal.fire({
    //     title: t('cannot_cancel', { ns: 'modals' }),
    //     text: t('cancel_error', { ns: 'modals' }),
    //     icon: 'error',
    //     confirmButtonText: t('ok', { ns: 'modals' }),
    //   });
    // } else {
    //   setIsCancelLessonModalOpen(true);
    // }

    setIsCancelLessonModalOpen(true);
  };

  Modal.setAppElement('#root');

  const CustomModal = () => {
    const [selectedEvent] = calendarEvents.filter(
      (event) => event.id === calendarEvent.id,
    );

    const { eventDate } = selectedEvent.resource;

    const endLesson = addMinutes(
      new Date(eventDate.startAt),
      eventDate.duration,
    );

    // const today = moment();
    // const tenMinuteBeforeStart = moment(eventDate.startAt).subtract(
    //   10,
    //   'minutes',
    // );
    // const fiveMinuteBeforeEnd = moment(eventDate.startAt).add(
    //   eventDate.duration - 5,
    //   'minutes',
    // );

    // const isBetween = moment(today).isBetween(
    //   tenMinuteBeforeStart,
    //   fiveMinuteBeforeEnd,
    // );

    const [
      approveAppointment,
      {
        loading: approveLessonLoading,
        error: approveLessonError,
        data: approveLessonData,
      },
    ] = useMutation(APPROVE_APPOINTMENT);

    const joinLesson = () => {
      if (isBetween(eventDate.startAt, eventDate.duration, userTimezone)) {
        window.open(eventDate.zoom.startUrl, '_blank');
      } else {
        setIsWarningOpen(true);
      }
    };

    const approveLesson = ({ id }) => {
      approveAppointment({
        variables: {
          id: parseInt(id),
          mentorId: parseInt(user?.mentor?.id),
        },
        // onCompleted: () => {
        //   getAppointments();
        //   setIsCalendarModalOpen(false);
        // },
      });
    };

    const displayModalEventDate = ({ resource }) => {
      const start = moment(resource?.startAt)
        .tz(userTimezone)
        .format('hh:mm A');
      const end = moment(resource?.startAt)
        .tz(userTimezone)
        .add(resource?.eventDate?.duration, 'minutes')
        .format('hh:mm A');

      const timeSlot = `${start} → ${end}`;
      const date = moment(resource?.startAt)
        .tz(userTimezone)
        .format('dddd, MMMM Do');

      return (
        <>
          <div className="row">
            {(selectedEvent.resource.eventDate.status ===
              LessonsStatusType.SCHEDULED ||
              selectedEvent.resource.eventDate.status ===
                LessonsStatusType.RESCHEDULED) && (
              <h4 className="text-red-500">
                This lesson haven&apos;t been approved yet!
              </h4>
            )}
          </div>
          <div className="row">
            <h4 className="text-primary">{date}</h4>
          </div>
          <div className="row">
            <h4 className="">{timeSlot}</h4>
          </div>
        </>
      );
    };

    if (approveLessonData) {
      getAppointments();
      setIsCalendarModalOpen(false);
      notify('Lesson successfully approved', 'success');
    }

    if (approveLessonError) {
      notify(approveLessonError.message, 'error');
    }

    return (
      <div style={{ zIndex: 9999 }} className="container">
        {approveLessonLoading && <ReactLoader />}
        <Modal
          isOpen={isCalendarModalOpen}
          onRequestClose={closeCalendarModal}
          style={customStyles}
          contentLabel="Tutor Calendar Event"
        >
          <div
            className="container page-card-modal grey-border rounded-lg bg-white mt-4 py-5 px-6"
            style={{ width: '30vw' }}
          >
            <div className="">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold capitalize">
                  {lowerCase(
                    eventDate?.packageSubscription?.package?.course?.title,
                  )}
                </div>
                <button
                  style={{ backgroundColor: 'white', cursor: 'pointer' }}
                  onClick={closeCalendarModal}
                >
                  <i className="fa-solid fa-xmark text-secondary"></i>
                </button>
              </div>

              <div className="ps-3">
                <div className="my-3">
                  {displayModalEventDate(selectedEvent)}
                </div>
                <div className="my-3">
                  <div className="row">
                    <h4 className="text-primary">{t('attendants')}</h4>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <div>
                        <b>Student</b>
                      </div>
                      <div className="w-[70px] h-[70px] rounded-[15px] mt-[10px] overflow-hidden">
                        <Avatar
                          avatarUrl={eventDate?.student?.avatar?.url}
                          gender={eventDate?.student?.gender}
                        />
                      </div>
                      <p>
                        {`${eventDate?.student?.firstName} ${eventDate?.student?.lastName}`}
                      </p>
                      <p className="text-color-purple">
                        {eventDate?.student?.langLevel}
                      </p>

                      <p className="text-sm">
                        {eventDate?.student?.user.email}
                      </p>
                    </div>
                    <div className="col-6">
                      <div>
                        <b>Mentor</b>
                      </div>
                      <div className="w-[70px] h-[70px] rounded-[15px] mt-[10px] overflow-hidden">
                        <Avatar
                          avatarUrl={eventDate?.mentor?.avatar?.url}
                          gender={eventDate?.mentor?.gender}
                        />
                      </div>
                      <p>{eventDate?.mentor?.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isAfter(endLesson, new Date()) && (
                <div className="row">
                  {eventDate.status === LessonsStatusType.APPROVED && (
                    <button
                      className="btn col-5 enter-btn bg-primary"
                      onClick={joinLesson}
                      target="_blank"
                      // disabled={eventDate.status === 'scheduled'}
                      rel="noreferrer"
                    >
                      {t('start_lesson')}
                    </button>
                  )}

                  {(eventDate.status === LessonsStatusType.SCHEDULED ||
                    eventDate.status === LessonsStatusType.RESCHEDULED) && (
                    <button
                      className="btn col-5 enter-btn bg-primary"
                      onClick={() => approveLesson(eventDate)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('approve_lesson')}
                    </button>
                  )}

                  <button
                    className="btn col-5 enter-btn"
                    onClick={onCancelLessonClick}
                  >
                    {t('cancel_lesson', { ns: 'modals' })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  const eventPropGetter = useCallback(
    (event) => {
      return {
        ...((event.resource.eventDate.status ===
          LessonsStatusType.RESCHEDULED ||
          event.resource.eventDate.status === LessonsStatusType.COMPLETED) && {
          style: {
            background: 'none',
            backgroundColor: '#909090',
          },
        }),
      };
    },
    [appointments],
  );

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);

  return (
    <Layout>
      {loadingAppointments && <ReactLoader />}
      <div className="container-fluid p-3">
        {/* <button onClick={() => setReviewLessonModal(true)}>
          Open ReviewLessonModal
        </button> */}
        <h1 className="title m-0 mb-2">{t('lessons')}</h1>
        <div className="row container-fluid m-0 p-0">
          <div className="flex flex-wrap gap-4 mb-4 sm:mb-8">
            <div className="flex items-center">
              <Button
                theme="outline"
                className={`ml-0 rounded-r-none focus:shadow-none ${
                  selectedTab === 'upcomingLessons' &&
                  'bg-color-purple text-white'
                }`}
                onClick={onClickUpcomingLessons}
              >
                <span>{t('upcoming_lessons', { ns: 'lessons' })}</span>
              </Button>
              <Button
                theme="outline"
                className={`ml-[-4px] rounded-l-none focus:shadow-none ${
                  selectedTab === 'pastLessons' && 'bg-color-purple text-white'
                }`}
                onClick={onClickPastLessons}
              >
                <span>{t('past_lessons', { ns: 'lessons' })}</span>
              </Button>
            </div>

            <Button
              theme="outline"
              className={`focus:shadow-none ${
                selectedTab === 'calendar' && 'bg-color-purple text-white'
              }`}
              onClick={onCalendarClick}
            >
              <span>{t('calendar_view', { ns: 'lessons' })}</span>
            </Button>
          </div>
        </div>

        <div className="overflow-auto h-full">
          <div className={`${isLoading ? 'loading' : ''} mt-4`}>
            {isCalendar && (
              <BigCalendar
                style={{ minHeight: '70vh', minWidth: '559px' }}
                popup={true}
                formats={formats}
                events={calendarEvents}
                localizer={localizer}
                onSelectEvent={onSelectEvent}
                views={allViews}
                defaultView={Views.WEEK}
                showMultiDayTimes
                eventPropGetter={eventPropGetter}
                startAccessor="start"
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
                  month: t('calendar_month'),
                  week: t('calendar_week'),
                  day: t('calendar_day'),
                  previous: t('calendar_prev'),
                  next: t('calendar_next'),
                  today: t('calendar_today'),
                }}
              />
            )}
            {tabularData.length !== 0 && (
              <LessonTable tabularData={tabularData} />
            )}
          </div>
        </div>
      </div>
      {isCalendarModalOpen && <CustomModal />}

      <RescheduleAndCancelModal
        data={calendarEvent.resource?.eventDate}
        isOpen={isCancelLessonModalOpen}
        setIsOpen={setIsCancelLessonModalOpen}
        closeModal={closeCancelLessonModal}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        fetchAppointments={fetchData}
        type={'cancel'}
        duration={calendarEvent.resource?.eventDate?.duration}
      />

      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={() => setIsWarningOpen(false)}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
      <Suspense fallback={<Loader />}>
        <ReviewLessonModal
          isOpen={isReviewLessonModalOpen}
          setIsOpen={setReviewLessonModal}
        />
      </Suspense>
    </Layout>
  );
};

export default Calendar;
