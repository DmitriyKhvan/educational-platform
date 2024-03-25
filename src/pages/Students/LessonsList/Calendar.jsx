import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import Modal from 'react-modal';
import LessonInfoModal from 'src/components/student-dashboard/LessonInfoModal';
import { utcToZonedTime } from 'date-fns-tz';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import koLocale from '@fullcalendar/core/locales/ko';

import enLocale from '@fullcalendar/core/locales/en-gb';

import dayGridPlugin from '@fullcalendar/daygrid';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';
import { useMediaQuery } from 'react-responsive';
import CalendarHeader from './CalendarHeader';

const Calendar = ({ calendarAppointments, getAppointments }) => {
  // eslint-disable-next-line no-unused-vars
  const [_, i18n] = useTranslation();
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const calendarRef = useRef();
  const { getTitleByCourseId } = useCourseTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState({});

  const closeModal = () => {
    setCalendarEvent({});
    setIsOpen(false);
  };

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = [];
      calendarAppointments.forEach((_, index) => {
        const event = {
          id: index,
          title: getTitleByCourseId(calendarAppointments[index]?.courseId),
          start: calendarAppointments[index].startAt,
          end: calendarAppointments[index].end_at,
          resource: calendarAppointments[index],
          className: 'mb-2',
          color: '#862EE7',
          display: 'block',
        };
        tempEvents.push(event);
      });
      setCalendarEvents([...tempEvents]);
    }
  }, [calendarAppointments, getTitleByCourseId]);

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
    setCalendarEvent({ id: Number(e.event.id) });
    setIsOpen(true);
  };

  return (
    <>
      <CalendarHeader calendarRef={calendarRef} />
      <FullCalendar
        ref={calendarRef}
        headerToolbar={null}
        scrollTimeReset={false}
        nowIndicator={true}
        views={{
          dayGridMonth: {
            dayHeaderFormat: { weekday: isTablet ? 'short' : 'long' },
          },
        }}
        locales={[enLocale, koLocale]}
        locale={i18n.language === 'en' ? 'en' : koLocale}
        now={utcToZonedTime(new Date(), userTimezone)}
        events={calendarEvents}
        plugins={[dayGridPlugin, timeGridPlugin]}
        dayMaxEvents={true}
        initialView="dayGridMonth"
        allDaySlot={false}
        displayEventTime={false}
        eventClick={onSelectEvent}
        dayPopoverFormat={{ month: 'long', day: 'numeric' }}
      />

      {isOpen && <CustomModal />}
    </>
  );
};

export default Calendar;
