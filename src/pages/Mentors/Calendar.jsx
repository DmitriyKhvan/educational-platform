import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import Layout from '../../components/Layout';
import LessonTable from '../../components/mentor-dashboard/LessonTable';
import NotificationManager from '../../components/NotificationManager';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import ZoomWarningModal from '../../components/student-dashboard/ZoomWarningModal';
const ReviewLessonModal = lazy(() =>
  import('../../components/mentor-dashboard/ReviewLessonModal'),
);
import { format, utcToZonedTime } from 'date-fns-tz';
import WeekHeader from '../../components/common/WeekHeader';
import '../../assets/styles/calendar.scss';
import { toast } from 'react-toastify';
import { useAuth } from '../../modules/auth';
import Swal from 'sweetalert2';
import {
  CANCEL_APPOINTMENT,
  APPOINTMENTS_QUERY,
} from '../../modules/auth/graphql';
import { useQuery, useMutation, gql, useLazyQuery } from '@apollo/client';
import Loader from '../../components/Loader/Loader';
import { lowerCase } from 'lodash-es';
import ReactLoader from '../../components/common/Loader';

const GET_ZOOMLINK = gql`
  query Get_Zoomlink($id: Int!) {
    zoomLink(id: $id) {
      id
      url
      isPaid
    }
  }
`;

const sortCalendarEvents = (data) => {
  if (!data) return;
  const timeZone = 'Asia/Seoul';
  let eventDates = {};
  data.forEach((apt) => {
    let startAt = new Date(apt.startAt);
    let date = format(utcToZonedTime(startAt, timeZone), 'yyyy-MM-dd');
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
        zoomLink: eventDate.zoomlinkId,
        lesson: eventDate?.packageSubscription?.package?.course?.title,
        startAt,
        end_at,
        type: eventDate.type,
        tutor: eventDate.tutor,
        student: eventDate.students,
        eventDate,
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

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: 'approved,scheduled,paid,completed,in_progress',
    },
    fetchPolicy: 'no-cache',
  });

  const [calendarAppointments, setCalendarAppointments] = useState([]);
  const [tableAppointments, setTableAppointments] = useState([]);

  useEffect(() => {
    if (!appointments) return;
    else {
      const { calendarEvents, tablularEventData } = sortCalendarEvents(
        appointments?.lessons,
      );
      setCalendarAppointments(calendarEvents);
      setTableAppointments(tablularEventData);
    }
  }, [appointments]);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [pastLessons, setPastLessons] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [selectedTab, setSelectedTab] = useState('calendar');

  const [tabularData, setTabularData] = useState([]);
  const [isCalendar, setIsCalendar] = useState(true);
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [calendarEvent, setCalendarEvent] = useState({});
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [cancelAppointment, { loading: loadingCancelAppointment }] =
    useMutation(CANCEL_APPOINTMENT, {
      onCompleted: async () => {
        await fetchData();
      },
    });

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

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      NotificationManager.error(
        error.response?.data?.message || 'Server Issue',
        t,
      );
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
        const event = {
          id: index,
          title: calendarAppointments[index]?.lesson,
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
        if (new Date(each.resource.startAt) > new Date()) {
          if (
            each.resource.status === 'approved' ||
            each.resource.status === 'scheduled'
          ) {
            tempUpcomingLessons.push(each);
          }
        } else {
          tempPastLessons.push(each);
        }
      });
      setUpcomingLessons([...tempUpcomingLessons]);
      setPastLessons([...tempPastLessons]);
    }
  }, [tableAppointments]);

  const onClickUpcomingLessons = () => {
    setTabularData([...upcomingLessons]);
    setIsUpcoming(true);
    setIsCalendar(false);
    setSelectedTab('upcomingLessons');
  };
  const onClickPastLessons = () => {
    setTabularData([...pastLessons]);
    setIsUpcoming(false);
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
    const today = moment().format('MM/DD/YYYY hh:mm a');
    const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a');
    if (moment(today).isBefore(closedDate)) {
      setCalendarEvent(e);
      setIsCalendarModalOpen(true);
    } else {
      toast.warn('This class has already passed', {
        hideProgressBar: true,
      });
    }
  };

  const closeCalendarModal = () => {
    setCalendarEvent({});
    setIsCalendarModalOpen(false);
  };

  const closeCancelLessonModal = () => {
    setIsCancelLessonModalOpen(false);
  };

  const onCancelLessonClick = () => {
    setIsCalendarModalOpen(false);
    setIsCancelLessonModalOpen(true);
  };

  const onCancel = async () => {
    const [selectedEvent] = calendarEvents.filter(
      (x) => x.id === calendarEvent.id,
    );

    const scheduledTime = moment(selectedEvent?.resource?.startAt).tz(
      userTimezone,
    );

    const isLate =
      moment.duration(moment(scheduledTime).diff(moment())).asHours() <= 24;

    const { id } = selectedEvent.resource.eventDate;
    if (isLate) {
      closeCancelLessonModal();
      Swal.fire({
        title: t('cannot_cancel', { ns: 'modals' }),
        text: t('cancel_error', { ns: 'modals' }),
        icon: 'error',
        confirmButtonText: t('ok', { ns: 'modals' }),
      });
    } else {
      try {
        setIsLoading(true);
        await cancelAppointment({
          variables: {
            id,
          },
        });
      } catch (error) {
        setIsLoading(false);
        NotificationManager.error(
          error.response?.data?.message || 'Server Issue',
          t,
        );
      } finally {
        closeCalendarModal();
        closeCancelLessonModal();
      }
    }
  };

  Modal.setAppElement('#root');

  const CustomModal = () => {
    const [selectedEvent] = calendarEvents.filter(
      (event) => event.id === calendarEvent.id,
    );
    const { eventDate } = selectedEvent.resource;
    const student = eventDate.student;
    const tutorAvatar = user.mentor?.avatar?.url;

    const displayStudentAvatar = student?.avatar
      ? student?.avatar?.url
      : student?.user?.gender === 'male'
      ? maleAvatar
      : femaleAvatar;

    const displayTutorAvatar = tutorAvatar
      ? tutorAvatar
      : eventDate.mentor?.user?.gender === 'male'
      ? maleAvatar
      : femaleAvatar;

    const today = moment();
    const tenMinuteBeforeStart = moment(eventDate.startAt).subtract(
      10,
      'minutes',
    );
    const fiveMinuteBeforeEnd = moment(eventDate.startAt).add(
      eventDate.duration - 5,
      'minutes',
    );

    const isBetween = moment(today).isBetween(
      tenMinuteBeforeStart,
      fiveMinuteBeforeEnd,
    );

    const [getZoomLink] = useLazyQuery(GET_ZOOMLINK, {
      fetchPolicy: 'no-cache',
    });

    const joinLesson = async () => {
      if (isBetween) {
        const zoomlink = await getZoomLink({
          variables: {
            id: parseInt(eventDate.zoomlinkId),
          },
        });
        window.location.replace(zoomlink.data.zoomLink.url);
      }
      if (!isBetween) setIsWarningOpen(true);
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
            {selectedEvent.resource.eventDate.status === 'scheduled' && (
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

    return (
      <div style={{ zIndex: 9999 }} className="container">
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
                  {lowerCase(selectedEvent.title)}
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
                <div className="my-3 attends">
                  <div className="row">
                    <h4 className="text-primary">{t('attendants')}</h4>
                  </div>
                  <div className="row mt-2">
                    <div className="col-4 me-3">
                      <div>
                        <b>Student</b>
                      </div>
                      <div>
                        <img
                          src={displayStudentAvatar}
                          alt="Student Avatar"
                          className="img-fluid rounded-corners"
                        />
                      </div>
                      <p>
                        {eventDate?.student?.user?.firstName +
                          ' ' +
                          eventDate?.student?.user?.lastName}
                      </p>
                    </div>
                    <div className="col-4">
                      <div>
                        <b>Mentor</b>
                      </div>
                      <div>
                        <img
                          src={displayTutorAvatar}
                          alt="Tutor Avatar"
                          className="img-fluid rounded-corners"
                        />
                      </div>
                      <p>{eventDate?.mentor?.user?.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <button
                  className="btn col-5 enter-btn bg-primary"
                  onClick={joinLesson}
                  target="_blank"
                  disabled={eventDate.status === 'scheduled'}
                  rel="noreferrer"
                >
                  {t('start_lesson')}
                </button>
                <button
                  className="btn col-5 enter-btn"
                  onClick={onCancelLessonClick}
                >
                  {t('cancel_lesson', { ns: 'modals' })}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  const CancelLessonModal = () => {
    return (
      <div style={{ zIndex: 9999 }} className="container">
        <Modal
          isOpen={isCancelLessonModalOpen}
          onRequestClose={closeCancelLessonModal}
          style={customStyles}
          contentLabel="Tutor Calendar Event"
        >
          <div
            className="container page-card grey-border bg-white pt-2 mt-4 p-4"
            style={{ width: '40vw' }}
          >
            <div className="px-4 pt-3">
              <div className="row">
                <h1 className="text-primary mb-2">
                  {t('lesson_cancellation', { ns: 'modals' })}
                </h1>
              </div>
              <div className="row">
                {t('please_read_the_following', { ns: 'modals' })}
              </div>
              <div className="row mt-4">
                <h2 className="mb-2">{t('warning', { ns: 'modals' })}</h2>
              </div>
              <div className="row">
                <p>{t('cancellation_policy_notice', { ns: 'modals' })}</p>
              </div>
              <div className="row mb-3">
                <ul>
                  <li>
                    {t('cancellation_policy_tutor_one', { ns: 'modals' })}
                  </li>
                  <li>
                    {t('cancellation_policy_tutor_two', { ns: 'modals' })}
                  </li>
                </ul>
              </div>
              <div className="row">
                <button
                  className="btn btn-primary enter-btn m-0"
                  onClick={onCancel}
                >
                  {t('cancel_lesson', { ns: 'modals' })}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  const eventPropGetter = useCallback(
    (event) => {
      return {
        ...((event.resource.eventDate.status === 'scheduled' ||
          event.resource.eventDate.status === 'completed') && {
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
      {(loadingAppointments || loadingCancelAppointment) && <ReactLoader />}
      <div className="container-fluid p-3">
        {/* <button onClick={() => setReviewLessonModal(true)}>
          Open ReviewLessonModal
        </button> */}
        <h1 className="title m-0 mb-2">{t('lessons')}</h1>
        <div className="row container-fluid m-0 p-0">
          <div className="col-auto">
            <div className="btn-group" role="group">
              <button
                type="button"
                onClick={onClickUpcomingLessons}
                className={`btn grey-border ${
                  selectedTab === 'upcomingLessons' && 'btn-selected'
                }`}
              >
                <span>{t('upcoming_lessons', { ns: 'lessons' })}</span>
              </button>
              <button
                type="button"
                onClick={onClickPastLessons}
                className={`btn grey-border ${
                  selectedTab === 'pastLessons' && 'btn-selected'
                }`}
              >
                <span>{t('past_lessons', { ns: 'lessons' })}</span>
              </button>
            </div>
          </div>
          <div className="col-auto ps-3">
            <button
              type="button"
              className={`btn grey-border ${
                selectedTab === 'calendar' && 'btn-selected'
              }`}
              onClick={onCalendarClick}
            >
              <span>{t('calendar_view', { ns: 'lessons' })}</span>
            </button>
          </div>
        </div>

        <div className="scroll-layout">
          <div className={`${isLoading ? 'loading' : ''} mt-4`}>
            {isCalendar ? (
              <BigCalendar
                style={{ minHeight: '70vh' }}
                popup={true}
                formats={formats}
                events={calendarEvents}
                localizer={localizer}
                onSelectEvent={onSelectEvent}
                views={allViews}
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
            ) : (
              <LessonTable
                // timezone={'Asia/Seoul'}
                isUpcoming={isUpcoming}
                tabularData={tabularData}
              />
            )}
          </div>
        </div>
      </div>
      {isCalendarModalOpen && <CustomModal />}
      {isCancelLessonModalOpen && <CancelLessonModal />}
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={onCancel}
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
