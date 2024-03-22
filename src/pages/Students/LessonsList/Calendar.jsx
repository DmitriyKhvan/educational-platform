/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import WeekHeader from 'src/components/common/WeekHeader';
import { LessonsStatusType } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import Modal from 'react-modal';
import LessonInfoModal from 'src/components/student-dashboard/LessonInfoModal';
import { enUS, ko } from 'date-fns/locale';
import { format, getDay, isBefore, parse, startOfWeek } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

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

  const locales = {
    'en-US': enUS,
    ko: ko,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const allViews = ['month', 'week', 'day'];
  const formats = {
    dateFormat: 'd',
    weekdayFormat: 'cccc',
    dayFormat: 'cccc d',
    timeGutterFormat: 'ha',
  };

  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = [];
      calendarAppointments.forEach((_, index) => {
        const event = {
          id: index,
          title: calendarAppointments[index]?.lesson,
          start: calendarAppointments[index].startAt,
          end: calendarAppointments[index].end_at,
          resource: calendarAppointments[index],
        };
        tempEvents.push(event);
      });
      setCalendarEvents([...tempEvents]);
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
      zIndex: 20,
      background: 'none',
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 20,
    },
  };

  const CustomModal = () => {
    const [selectedEvent] =
      calendarEvents?.filter((x) => x.id === calendarEvent.id) ?? [];

    return (
      <div className="container">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="p-8 z-20 bg-white rounded-2xl">
            <LessonInfoModal
              date={selectedEvent?.resource?.eventDate?.startAt}
              data={selectedEvent?.resource?.eventDate}
              refetch={getAppointments}
              duration={selectedEvent.resource.eventDate.duration}
              userTimezone={userTimezone}
            />
          </div>
        </Modal>
      </div>
    );
  };

  const onSelectEvent = (e) => {
    // console.log(e, 'event');
    // console.log(e.event.title, 'e.event.title');
    // console.log(e.event.publicId, 'e.event.publicId');
    // setCalendarEvent(e.event.publicId);
    // setIsOpen(true);
    setCalendarEvent({ id: Number(e.event.id) });
    setIsOpen(true);
    // if (isBefore(utcToZonedTime(new Date(), userTimezone), e.end)) {
    //   setCalendarEvent(e);
    //   setIsOpen(true);
    // }
  };

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

  console.log(calendarEvents, 'calendarEvents');

  return (
    <>
      <FullCalendar
        events={calendarEvents}
        plugins={[dayGridPlugin, timeGridPlugin]}
        dayMaxEvents={true}
        initialView="dayGridMonth"
        allDaySlot={false}
        displayEventTime={false}
        eventClick={onSelectEvent}
        headerToolbar={{
          start: 'title prev,next',
          center: '',
          end: 'dayGridMonth,timeGridWeek,timeGridDay today',
        }}
      />
      <BigCalendar
        getNow={() => utcToZonedTime(new Date(), userTimezone)}
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
