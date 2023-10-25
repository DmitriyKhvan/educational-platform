import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import ZoomWarningModal from './student-dashboard/ZoomWarningModal';
import femaleAvatar from '../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../assets/images/avatars/img_avatar_male.png';
import Swal from 'sweetalert2';
import RescheduleAndCancelModal from './student-dashboard/RescheduleAndCancelModal';
import { isBetween } from '../utils/isBetween';

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
  const [t] = useTranslation('modals');
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const isToday = moment(time).isSame(moment(), 'day');
  const [profileImage, setProfileImage] = React.useState('');

  const isLate = moment.duration(moment(time).diff(moment())).asHours() <= 24;

  const avatar = data?.resource?.mentor?.avatar;

  const [tabIndex, setTabIndex] = useState(0);

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar?.url);
    } else if (data?.resource?.mentor?.gender?.toLowerCase() === 'female') {
      setProfileImage(femaleAvatar);
    } else if (data?.resource?.mentor?.gender?.toLowerCase() === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [avatar]);

  const joinLesson = async () => {
    //Time period when you can go to the lesson
    if (
      isBetween(
        data.resource.eventDate.startAt,
        data.resource.eventDate.duration,
      )
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
      <div
        className="rounded-xl relative grey-border bg-white p-6"
        key={index}
        style={{ maxWidth: '33vw', zIndex: '-1' }}
      >
        <p
          className="absolute top-0 right-0 py-1 px-2 cursor-pointer text-xl"
          onClick={closeModal}
        >
          &times;
        </p>
        <div className="flex gap-2 items-start">
          <div className="w-full flex-grow-[2]">
            <h1 className="text-black text-2xl">{lesson}</h1>
            {/* TODO: add this to translation.json */}
            <h3 className="text-muted text-lg">
              {isToday ? 'Today' : moment(time).format('ddd')} at {startTime} →{' '}
              {endTime}
            </h3>
            {event.resource.status === 'scheduled' && (
              <p className="text-md text-red-500 font-bold">
                Lesson has not been approved yet!
              </p>
            )}
          </div>
          <div className="max-w-[4rem]">
            <img src={profileImage} alt="" />
          </div>
        </div>
        <div className="flex mt-4 gap-2 flex-wrap">
          <button
            className="enter-btn m-0 p-0 py-2 px-3 text-sm grey-border text-black"
            onClick={() => {
              if (isLate) {
                closeModal();
                Swal.fire({
                  title: t('cannot_cancel'),
                  text: t('cancel_error'),
                  icon: 'error',
                  confirmButtonText: t('ok'),
                });
              } else setIsCancelModalOpen(true);
            }}
          >
            {t('cancel_lesson')}
          </button>

          <a
            className="enter-btn m-0 p-0 py-2 px-2 text-sm grey-border text-black"
            onClick={(e) => {
              if (isLate) {
                e.preventDefault();
                closeModal();
                Swal.fire({
                  title: t('cannot_reschedule'),
                  text: t('reschedule_error'),
                  icon: 'error',
                  confirmButtonText: t('ok'),
                });
              } else {
                setIsCancelModalOpen(true);
                setTypeModal('reschedule');
              }
            }}
          >
            {t('reschedule')}
          </a>
          <a
            onClick={
              event.resource.status !== 'scheduled' ? joinLesson : undefined
            }
            target="_blank"
            rel="noreferrer"
            className="enter-btn m-0 p-0 py-2 px-2 text-sm grey-border text-black aria-disabled:brightness-75"
            aria-disabled={event.resource.status === 'scheduled'}
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
      {isCancelModalOpen && (
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
      )}
    </>
  );
};

export default CalendarModal;
