import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import WeekHeader from 'src/components/common/WeekHeader';
import { LessonsStatusType } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import Modal from 'react-modal';
import LessonInfoModal from 'src/components/student-dashboard/LessonInfoModal';

const Calendar = ({ calendarAppointments, getAppointments }) => {
  const [t] = useTranslation(['lessons']);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState({});
  const closeModal = () => {
    setCalendarEvent({});
    setIsOpen(false);
  };

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localizer = momentLocalizer(moment.tz.setDefault(userTimezone));
  const allViews = ['month', 'week', 'day'];
  const formats = {
    dateFormat: 'D',
    weekdayFormat: 'dddd',
    dayFormat: 'dddd D',
    timeGutterFormat: 'hA',
  };

  const [calendarEvents, setCalendarEvents] = useState([]);

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
      // setIsLoading(false);
    } else {
      // setIsLoading(false);
    }
  }, [calendarAppointments]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 40,
      background: 'none',
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const CustomModal = () => {
    // if it defaults to undefined then it is your fault, im not testing this
    const [selectedEvent] =
      calendarEvents?.filter((x) => x.id === calendarEvent.id) ?? [];

    return (
      <div style={{ zIndex: 40 }} className="container">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="p-8 bg-white rounded-2xl">
            <LessonInfoModal
              date={selectedEvent.start}
              data={selectedEvent.resource}
              refetch={getAppointments}
              duration={selectedEvent.resource.eventDate.duration}
              userTimezone={userTimezone}
            />
          </div>
        </Modal>
      </div>
    );
  };

  // const onSelectEvent = (e) => {
  //   const today = moment().format('MM/DD/YYYY hh:mm a');
  //   const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a');
  //   if (moment(today).isBefore(closedDate)) {
  //     setCalendarEvent(e);
  //     setIsOpen(true);
  //   }
  // };

  const onSelectEvent = (e) => {
    const today = moment().format('MM/DD/YYYY hh:mm a');
    const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a');
    if (moment(today).isBefore(closedDate)) {
      setCalendarEvent(e);
      setIsOpen(true);
    }
  };
  // const handleFeedback = () => {
  //   window.open(feedbackURL);
  // };

  const eventPropGetter = useCallback((event) => {
    return {
      ...((event.resource.status === LessonsStatusType.SCHEDULED ||
        event.resource.status === LessonsStatusType.RESCHEDULED ||
        event.resource.status === LessonsStatusType.COMPLETED) && {
        style: {
          filter: 'grayscale(100%) opacity(0.8)',
        },
      }),
    };
  }, []);

  return (
    <>
      <BigCalendar
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
      />

      {isOpen && <CustomModal />}
    </>
  );
};

export default Calendar;
