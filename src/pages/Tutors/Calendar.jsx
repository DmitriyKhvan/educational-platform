import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import Layout from '../../components/Layout';
import { getAppointments } from '../../actions/appointment';
import { getTutorInfo } from '../../actions/tutor';
import { getUserInfo } from '../../actions/user';
import LessonTable from '../../components/tutor-dashboard/LessonTable';
import NotificationManager from '../../components/NotificationManager';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import ZoomWarningModal from '../../components/student-dashboard/ZoomWarningModal';
import ReviewLessonModal from '../../components/tutor-dashboard/ReviewLessonModal';

import WeekHeader from '../../components/common/WeekHeader';
import '../../assets/styles/calendar.scss';
import AppointmentApi from '../../api/AppointmentApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../modules/auth';
import Swal from 'sweetalert2';
import { STUDENTS_QUERY } from '../../modules/auth/graphql';
import { useQuery } from '@apollo/client';

const Calendar = () => {
  const [t] = useTranslation(['lessons', 'modals']);
  const dispatch = useDispatch();
  const calendarAppointments = useSelector(
    (state) => state.appointment.calendarEvents,
  );

  const tableAppointments = useSelector(
    (state) => state.appointment.tablularEventData,
  );
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

  const { user } = useAuth();

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

  const fetchData = () => {
    dispatch(
      getAppointments({ tutor_id: user.tutor?.id, status: 'scheduled' }),
    );
  };

  useEffect(() => {
    if (user && user.role && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && user?.tutor?.id) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = [];
      calendarAppointments.forEach((_, index) => {
        const start = moment(calendarAppointments[index].start_at).tz(
          userTimezone,
        );
        const end = moment(calendarAppointments[index].end_at).tz(userTimezone);
        const event = {
          id: index,
          title:
            calendarAppointments[index].lesson.type.charAt(0).toUpperCase() +
            calendarAppointments[index].lesson.type.slice(1),
          start: start.toDate(),
          end: end.toDate(),
          resource: calendarAppointments[index],
        };
        tempEvents.push(event);
      });
      setCalendarEvents([...tempEvents]);
      // setIsLoading(false)
    }
  }, [calendarAppointments]);

  useEffect(() => {
    if (tableAppointments) {
      const tempUpcomingLessons = [];
      const tempPastLessons = [];
      tableAppointments.map((each) => {
        if (new Date(each.resource.start_at) > new Date()) {
          tempUpcomingLessons.push(each);
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

    const scheduledTime = moment(selectedEvent?.resource?.start_at).tz(
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
        await AppointmentApi.cancelAppointment(id);
        fetchData();
      } catch (error) {
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
    const [students] = eventDate.students;

    const { data } = useQuery(STUDENTS_QUERY, {
      errorPolicy: 'ignore',
    });
    const studentsList = data?.students;

    const studentLessonLevel = students.level || 0;

    const studentAvatar = studentsList?.find(i => +i.id === +students?.id);
    const tutorAvatar = user.tutor?.avatar?.url;

    const displayStudentAvatar = studentAvatar?.avatar
      ? studentAvatar?.avatar?.url
      : students.user?.gender === 'male'
      ? maleAvatar
      : femaleAvatar;

    const displayTutorAvatar = tutorAvatar
      ? tutorAvatar
      : eventDate.tutor?.user?.gender === 'male'
      ? maleAvatar
      : femaleAvatar;

    const today = moment();
    const tenMinuteBeforeStart = moment(eventDate.start_at).subtract(
      10,
      'minutes',
    );
    const fiveMinuteBeforeEnd = moment(eventDate.start_at).add(
      eventDate.duration - 5,
      'minutes',
    );

    const isBetween = moment(today).isBetween(
      tenMinuteBeforeStart,
      fiveMinuteBeforeEnd,
    );

    const joinLesson = async () => {
      if (isBetween) window.location.href = eventDate.zoomlink.url;
      if (!isBetween) setIsWarningOpen(true);
    };

    const displayModalEventDate = ({ resource }) => {
      const start = moment(resource?.start_at)
        .tz(userTimezone)
        .format('hh:mm A');
      const end = moment(resource?.start_at)
        .tz(userTimezone)
        .add(resource?.eventDate?.duration, 'minutes')
        .format('hh:mm A');

      const timeSlot = `${start} → ${end}`;
      const date = moment(resource?.start_at)
        .tz(userTimezone)
        .format('dddd, MMMM Do');

      return (
        <>
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
            className="container page-card-modal grey-border bg-white pt-1 mt-4 p-2"
            style={{ width: '30vw' }}
          >
            <div className="px-4">
              <div className="row">
                <div className="col-10 mx-2 ps-2">
                  <h1>
                    <strong>{selectedEvent.title}</strong>
                  </h1>
                </div>
                <div className="col-1">
                  <button
                    style={{ backgroundColor: 'white', cursor: 'pointer' }}
                    onClick={closeCalendarModal}
                  >
                    <h1>
                      <i className="fa-solid fa-xmark text-secondary"></i>
                    </h1>
                  </button>
                </div>
              </div>

              <div className="ps-3">
                <div className="my-3">
                  {displayModalEventDate(selectedEvent)}
                </div>

                <div className="my-3">
                  <div className="row">
                    <h4 className="text-primary">{t('current_topic')}</h4>
                  </div>
                  <div className="row">
                    <h4>
                      {t('tutor_calendar_current_topic', {
                        level: studentLessonLevel,
                        current_topic: eventDate.lesson_topic,
                      })}
                    </h4>
                  </div>
                </div>

                <div className="my-3">
                  <div className="row">
                    <h4 className="text-primary">{t('previous_topic')}</h4>
                  </div>
                  <div className="row">
                    <h4>
                      {t('tutor_calendar_previous_topic', {
                        level: studentLessonLevel,
                        previous: eventDate.last_part_lesson,
                      })}
                    </h4>
                  </div>
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
                      <p>{students?.user?.first_name}</p>
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
                      <p>{eventDate?.tutor?.user?.first_name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <button
                  className="btn col-5 enter-btn bg-primary text-white"
                  onClick={joinLesson}
                  target="_blank"
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
              <div className="row">
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

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);

  return (
    <Layout>
      <div className="container-fluid">
        {/* <button onClick={() => setReviewLessonModal(true)}>Open ReviewLessonModal</button> */}
        <h1 className="title m-0 mt-4 mb-3">{t('lessons')}</h1>
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
          <div className="mt-4">
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
                timezone={'America/New_York'}
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
      <ReviewLessonModal
        isOpen={isReviewLessonModalOpen}
        setIsOpen={setReviewLessonModal}
      />
    </Layout>
  );
};

export default Calendar;
