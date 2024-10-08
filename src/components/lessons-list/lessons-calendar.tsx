import { useAuth } from '@/app/providers/auth-provider';
import { LessonsCalendarHeader } from '@/components/lessons-list';
import LessonInfoModal from '@/components/student-dashboard/lesson-info-modal';
import { COURSE_COLORS, CalendarView, courseColorsDict } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

import { Calendar } from '@/components/calendar';
import Loader from '@/components/loader/loader';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import { useCourseColors } from '@/shared/utils/use-course-colors';
import type { CalendarEventProcessed } from '@/types';
import { UserRoleType } from '@/types/types.generated';
import type { EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import type FullCalendar from '@fullcalendar/react';

interface LessonsCalendarProps {
  calendarAppointments: CalendarEventProcessed[];
  getAppointments: () => void;
}

const LessonsCalendar: React.FC<LessonsCalendarProps> = ({
  calendarAppointments,
  getAppointments,
}) => {
  const [_, i18n] = useTranslation();
  const calendarRef = useRef<FullCalendar | null>(null);
  const { getColorByCourseId, colorsReady } = useCourseColors();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState<{ id?: number | string }>({});
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);

  const closeModal = () => {
    setCalendarEvent({});
    setIsOpen(false);
  };

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = calendarAppointments.map((ap) => ({
        title: `${format(ap.startAt, 'hh:mm a')} ${ap.student.firstName}`,
        start: ap.startAt,
        end: ap.end_at,
        resource: ap,
        id: `${ap.startAt.toISOString()}${ap.lesson}`,
      }));
      setCalendarEvents(tempEvents);
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

  const CustomModal: React.FC = () => {
    const selectedEvent = calendarEvents.find((x) => x.id === calendarEvent.id);

    return (
      <div className="container">
        <Modal
          appElement={document.body}
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="p-8 z-20 bg-white rounded-2xl">
            <LessonInfoModal
              date={selectedEvent?.resource?.eventDate?.startAt ?? new Date()}
              data={selectedEvent?.resource}
              refetch={() => {
                getAppointments();
                closeModal();
              }}
              duration={selectedEvent?.resource?.eventDate?.duration ?? 0}
              userTimezone={userTimezone}
            />
          </div>
        </Modal>
      </div>
    );
  };

  const onSelectEvent = (e: EventClickArg) => {
    setCalendarEvent({ id: e.event.id });
    setIsOpen(true);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const data = eventInfo.event.extendedProps.resource;

    let content = <></>;

    if (user?.role === UserRoleType.Student) {
      content = (
        <p className="font-medium truncate">
          {getTranslatedTitle(data?.packageSubscription?.package?.course, i18n.language)}
        </p>
      );
    } else if (
      eventInfo.view.type === CalendarView.MONTH_VIEW &&
      user?.role === UserRoleType.Mentor
    ) {
      content = (
        <p className="font-medium truncate">
          {data?.startAt && format(data.startAt, 'hha')} {data?.student?.firstName}{' '}
          {data.student?.lastName}
        </p>
      );
    } else {
      content = (
        <div className="text-xs leading-4 truncate">
          <b className="block font-semibold truncate">
            {data?.student?.firstName} {data?.student?.lastName}
          </b>
          <p className="block truncate">
            {data?.eventDate.duration} min, {data?.student?.langLevel}
          </p>
        </div>
      );
    }
    return (
      <div
        className={cn(
          'flex items-center px-2 min-h-[28px] h-full w-full text-gray-800 bg-gray-800 bg-opacity-15 hover:bg-opacity-100 transition-all duration-150 ease-in-out hover:text-white rounded-[4px] border-l-4 border-l-gray-800 overflow-hidden truncate',
          data?.isTrial
            ? courseColorsDict[COURSE_COLORS.GREEN]?.event
            : getColorByCourseId(data.courseId)?.event,
        )}
      >
        {content}
      </div>
    );
  };

  if (!colorsReady) {
    return <Loader />;
  }

  return (
    <>
      <LessonsCalendarHeader calendarRef={calendarRef} />
      <Calendar
        ref={calendarRef}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={onSelectEvent}
      />

      {isOpen && <CustomModal />}
    </>
  );
};

export default LessonsCalendar;
