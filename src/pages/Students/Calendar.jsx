import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import CalendarModal from '../../components/CalendarModal';
import Layout from '../../components/Layout';
import Loader from '../../components/common/Loader';
import { useLocation } from 'react-router-dom';

import '../../assets/styles/calendar.scss';
import { feedbackURL } from '../../constants/global';
import ReviewLessonModal from '../../components/student-dashboard/ReviewLessonModal';
import { useAuth } from '../../modules/auth';
import FeedbackLessonModal from '../Mentors/FeedbackLessonModal';
import WeekHeader from '../../components/common/WeekHeader';
import { useQuery } from '@apollo/client';
import { APPOINTMENTS_QUERY } from '../../modules/auth/graphql';
import { format, utcToZonedTime } from 'date-fns-tz';
import { LessonTable } from '../../components/student-dashboard/LessonTable';

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

const Calendar = () => {
  const [t] = useTranslation(['lessons']);
  const location = useLocation();
  const { user } = useAuth();

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      studentId: user?.students[0]?.id,
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

  const [isLoading, setIsLoading] = useState(true);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [calendarEvent, setCalendarEvent] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendar, setIsCalendar] = useState(true);
  const closeModal = () => {
    setCalendarEvent({});
    setIsOpen(false);
  };

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
    },
  };

  useEffect(() => {
    (async () => {
      if (user && user?.student) {
        getAppointments({
          studentId: user.students[0]?.id,
          status: 'approved,scheduled,paid,completed,in_progress',
        });
      }
    })();
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
      setIsLoading(false);
    } else {
      setIsLoading(false);
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

  const CustomModal = () => {
    // if it defaults to undefined then it is your fault, im not testing this
    const [selectedEvent] =
      calendarEvents?.filter((x) => x.id === calendarEvent.id) ?? [];

    const scheduledTime = moment(selectedEvent?.resource?.startAt).tz(
      userTimezone,
    );
    const startTime = moment(selectedEvent?.resource?.startAt)
      .tz(userTimezone)
      .format('hh:mm A');
    const endTime = moment(selectedEvent?.resource?.end_at)
      .tz(userTimezone)
      .format('hh:mm A');

    return (
      <div style={{ zIndex: 9999 }} className="container">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <CalendarModal
            event={selectedEvent}
            lesson={selectedEvent?.title}
            startTime={startTime}
            endTime={endTime}
            // zoomlink={selectedEvent.resource?.zoomLink}
            zoom={selectedEvent.resource?.zoom}
            time={scheduledTime}
            data={selectedEvent}
            closeModal={closeModal}
            getAppointments={getAppointments}
          />
        </Modal>
      </div>
    );
  };

  const onClickPastLessons = () => {
    setIsCalendar(false);
    setDisplayTableData([...pastLessons]);
    setSelectedTab('pastLessons');
  };

  const onClickUpcomingLessons = () => {
    setIsCalendar(false);
    setDisplayTableData([...upcomingLessons]);
    setSelectedTab('upcomingLessons');
  };

  const onCalendarClick = () => {
    setIsCalendar(true);
    setSelectedTab('calendar');
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

  const onSelectEvent = (e) => {
    const today = moment().format('MM/DD/YYYY hh:mm a');
    const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a');
    if (moment(today).isBefore(closedDate)) {
      setCalendarEvent(e);
      setIsOpen(true);
    }
  };
  const handleFeedback = () => {
    window.open(feedbackURL);
  };

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);
  const [isFeedbackModal, setFeedbackModal] = React.useState(false);

  const handleOpenFeedbackModal = () => {
    setFeedbackModal(true);
  };

  const handleClodeFeedbackModal = () => {
    setFeedbackModal(false);
  };

  useEffect(() => {
    if (location.search.includes('completed')) {
      onClickPastLessons();
    }
  }, [pastLessons]);

  const eventPropGetter = useCallback((event) => {
    return {
      ...((event.resource.status === 'scheduled' ||
        event.resource.status === 'completed') && {
        style: {
          filter: 'grayscale(100%) opacity(0.8)',
        },
      }),
    };
  }, []);

  return (
    <Layout>
      {loadingAppointments && (
        <div className="absolute w-full h-full top-0 left-0 z-[10001] bg-black/40">
          <Loader></Loader>
        </div>
      )}
      <div className="children-wrapper">
        {/* <button onClick={() => setReviewLessonModal(true)}>Hey</button> */}
        <div className="appointment-calendar container-fluid">
          <h1 className="title m-0 mt-4 mb-3">
            {t('lessons', { ns: 'lessons' })}
          </h1>
          <div className="row container-fluid m-0 p-0">
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn grey-border ${
                    selectedTab === 'upcomingLessons' && 'btn-selected'
                  }`}
                  onClick={onClickUpcomingLessons}
                >
                  <span>{t('upcoming_lessons', { ns: 'lessons' })}</span>
                </button>
                <button
                  type="button"
                  className={`btn grey-border ${
                    selectedTab === 'pastLessons' && 'btn-selected'
                  }`}
                  onClick={onClickPastLessons}
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
            {!isLoading && !isCalendar && (
              <LessonTable
                displayTableData={displayTableData}
                userTimezone={userTimezone}
                handleOpenFeedbackModal={handleOpenFeedbackModal}
                handleFeedback={handleFeedback}
              />
            )}
            {!isLoading && isCalendar && (
              <div className="mt-4">
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
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <FeedbackLessonModal
        modalState="student"
        isOpen={isFeedbackModal}
        closeModal={handleClodeFeedbackModal}
      />
      {isOpen && <CustomModal />}
      {isLoading && <Loader />}
      <ReviewLessonModal
        isOpen={isReviewLessonModalOpen}
        setIsOpen={setReviewLessonModal}
      />
    </Layout>
  );
};

export default Calendar;
