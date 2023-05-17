import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import ZoomWarningModal from './student-dashboard/ZoomWarningModal';
import femaleAvatar from '../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../assets/images/avatars/img_avatar_male.png';
import Swal from 'sweetalert2';

const CalendarModal = ({
  event,
  index,
  lesson,
  startTime,
  endTime,
  zoomlink,
  closeModal,
  time,
  mentors,
  data,
  onCancel,
}) => {
  const [t] = useTranslation('modals');
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const isToday = moment(time).isSame(moment(), 'day');
  const [profileImage, setProfileImage] = React.useState('');

  const isLate = moment.duration(moment(time).diff(moment())).asHours() <= 24;

  const avatar = mentors?.avatar;

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar?.url);
    } else if (
      data?.resource?.tutor?.user?.gender?.toLowerCase() === 'female'
    ) {
      setProfileImage(femaleAvatar);
    } else if (data?.resource?.tutor?.user?.gender?.toLowerCase() === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [avatar]);

  const today = moment();
  const tenMinuteBeforeStart = moment(
    data.resource.eventDate.start_at,
  ).subtract(10, 'minutes');
  const fiveMinuteBeforeEnd = moment(data.resource.eventDate.start_at).add(
    data.resource.eventDate.duration - 5,
    'minutes',
  );

  const isBetween = moment(today).isBetween(
    tenMinuteBeforeStart,
    fiveMinuteBeforeEnd,
  );

  const joinLesson = async () => {
    if (isBetween) {
      window.location.href = zoomlink.url;
    } else {
      setIsWarningOpen(true);
    }
  };

  return (
    <div
      className={'page-card grey-border bg-white pt-2 mt-4'}
      key={index}
      style={{ maxWidth: '33vw', zIndex: '-1' }}
    >
      <p className="close-sh" onClick={closeModal}>
        &times;
      </p>
      <div className="container">
        <div className="row">
          <div className="col-9">
            <h1 className={'text-black'}>{lesson}</h1>
            {/* TODO: add this to translation.json */}
            <h3 className={'text-muted'}>
              {isToday ? 'Today' : moment(time).format('ddd')} at {startTime} →{' '}
              {endTime}
            </h3>
          </div>
          <div className="col-3">
            <img
              src={profileImage}
              className="img-fluid align-middle"
              alt=""
              style={{ padding: '25px 0px 0px 0px' }}
            />
          </div>
        </div>
      </div>
      <div className="schedule-modal-ls">
        <button
          className="enter-btn grey-border text-black"
          onClick={() => {
            if (isLate) {
              closeModal();
              Swal.fire({
                title: t('cannot_cancel'),
                text: t('cancel_error'),
                icon: 'error',
                confirmButtonText: t('ok'),
              });
            } else onCancel(data?.resource?.eventDate?.id);
          }}
        >
          {t('cancel_lesson')}
        </button>
        <Link
          to={
            '/student/schedule-lesson/select/' + data?.resource?.eventDate?.id
          }
          className="enter-btn grey-border text-black"
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
            }
          }}
        >
          {t('reschedule')}
        </Link>
        <a
          onClick={joinLesson}
          target="_blank"
          rel="noreferrer"
          className="enter-btn grey-border text-black"
        >
          {t('join_lesson')}
        </a>
      </div>
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={onCancel}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </div>
  );
};

export default CalendarModal;
