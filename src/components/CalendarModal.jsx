import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import ZoomWarningModal from './student-dashboard/ZoomWarningModal';
// import Swal from 'sweetalert2';
import RescheduleAndCancelModal from './student-dashboard/RescheduleAndCancelModal';
import { isBetween } from '../utils/isBetween';
import { LessonsStatusType } from 'src/constants/global';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { useAuth } from 'src/modules/auth';

const CalendarModal = ({
  index,
  lesson,
  startTime,
  endTime,
  zoom,
  closeModal,
  time,
  data,
  event,
  getAppointments,
}) => {
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [t] = useTranslation(['modals', 'lessons']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const isToday = moment(time).isSame(moment(), 'day');

  // const isLate = moment.duration(moment(time).diff(moment())).asHours() <= 24;

  const [tabIndex, setTabIndex] = useState(0);

  const joinLesson = async () => {
    //Time period when you can go to the lesson
    if (
      isBetween({
        dateStart: new Date(data.resource.eventDate.startAt),
        duration: data.resource.eventDate.duration,
        userTimezone,
      })
    ) {
      window.open(zoom?.joinUrl, '_blank');
    } else {
      setIsWarningOpen(true);
    }
  };

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [typeModal, setTypeModal] = useState('cancel');

  const onClose = () => {
    closeModal();
    setIsCancelModalOpen(false);
  };

  return (
    <>
      <div className="rounded-xl relative grey-border bg-white p-6" key={index}>
        <p
          className="absolute top-0 right-0 py-1 px-2 cursor-pointer text-xl"
          onClick={closeModal}
        >
          &times;
        </p>
        <div className="flex gap-2 items-start">
          <div className="flex-grow-[2]">
            <h1 className="text-black text-2xl">{lesson}</h1>
            {/* TODO: add this to translation.json */}
            <h3 className="text-muted text-lg">
              {isToday ? 'Today' : moment(time).format('ddd')} at {startTime} →{' '}
              {endTime}
            </h3>
            {(event.resource.status === LessonsStatusType.SCHEDULED ||
              event.resource.status === LessonsStatusType.RESCHEDULED) && (
              <p className="text-md text-red-500 font-bold">
                {t('lesson_not_approved', { ns: 'lessons' })}
              </p>
            )}
          </div>
          <div className="w-[65px] h-[65px] rounded-full overflow-hidden">
            <Avatar
              avatarUrl={data?.resource?.mentor?.avatar?.url}
              gender={data?.resource?.mentor?.gender}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex mt-4 gap-2 flex-wrap">
          <button
            className="enter-btn m-0 p-0 py-2 px-3 text-sm grey-border text-black"
            onClick={() => {
              // if (isLate) {
              //   closeModal();
              //   Swal.fire({
              //     title: t('cannot_cancel'),
              //     text: t('cancel_error'),
              //     icon: 'error',
              //     confirmButtonText: t('ok'),
              //   });
              // } else setIsCancelModalOpen(true);
              setIsCancelModalOpen(true);
            }}
          >
            {t('cancel_lesson')}
          </button>

          <a
            className="enter-btn m-0 p-0 py-2 px-2 text-sm grey-border text-black"
            onClick={(e) => {
              e.preventDefault();
              // if (isLate) {
              //   e.preventDefault();
              //   closeModal();
              //   Swal.fire({
              //     title: t('cannot_reschedule'),
              //     text: t('reschedule_error'),
              //     icon: 'error',
              //     confirmButtonText: t('ok'),
              //   });
              // } else {
              //   setIsCancelModalOpen(true);
              //   setTypeModal('reschedule');
              // }
              setIsCancelModalOpen(true);
              setTypeModal('reschedule');
            }}
          >
            {t('reschedule')}
          </a>
          <a
            onClick={
              event.resource.status === LessonsStatusType.APPROVED
                ? joinLesson
                : undefined
            }
            target="_blank"
            rel="noreferrer"
            className="enter-btn m-0 p-0 py-2 px-2 text-sm grey-border text-black aria-disabled:brightness-75"
            aria-disabled={event.resource.status !== LessonsStatusType.APPROVED}
          >
            {t('join_lesson')}
          </a>
        </div>
        {isWarningOpen && (
          <ZoomWarningModal
            isWarningOpen={isWarningOpen}
            closeModal={closeModal}
            setIsWarningOpen={setIsWarningOpen}
          />
        )}
      </div>

      <RescheduleAndCancelModal
        data={event.resource?.eventDate}
        isOpen={isCancelModalOpen}
        closeModal={closeModal}
        setTabIndex={setTabIndex}
        setIsOpen={onClose}
        fetchAppointments={getAppointments}
        tabIndex={tabIndex}
        type={typeModal}
        duration={event.resource?.eventDate?.duration}
      />
    </>
  );
};

export default CalendarModal;
