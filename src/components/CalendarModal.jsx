import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import ZoomWarningModal from './student-dashboard/ZoomWarningModal';
import femaleAvatar from '../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../assets/images/avatars/img_avatar_male.png';
import { createPortal } from 'react-dom';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../modules/auth/graphql';
import { useAuth } from '../modules/auth';
import Swal from 'sweetalert2';

const CalendarModal = ({
  index,
  lesson,
  startTime,
  endTime,
  zoomlink,
  closeModal,
  time,
  data,
  event,
  onCancel,
}) => {
  const [t] = useTranslation('modals');
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const isToday = moment(time).isSame(moment(), 'day');
  const [profileImage, setProfileImage] = React.useState('');

  const isLate = moment.duration(moment(time).diff(moment())).asHours() <= 24;

  const avatar = data?.resource?.mentor?.avatar;

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar?.url);
    } else if (
      data?.resource?.mentor?.user?.gender?.toLowerCase() === 'female'
    ) {
      setProfileImage(femaleAvatar);
    } else if (data?.resource?.mentor?.user?.gender?.toLowerCase() === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [avatar]);

  const today = moment();
  const tenMinuteBeforeStart = moment(data.resource.eventDate.startAt).subtract(
    10,
    'minutes',
  );
  const fiveMinuteBeforeEnd = moment(data.resource.eventDate.startAt).add(
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

  const [isOpen, setIsOpen] = useState(false);

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
              } else setIsOpen(true);
            }}
          >
            {t('cancel_lesson')}
          </button>
          <Link
            to={
              '/student/schedule-lesson/select/' + data?.resource?.eventDate?.id
            }
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
              }
            }}
          >
            {t('reschedule')}
          </Link>
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
            closeModal={onCancel}
            setIsWarningOpen={setIsWarningOpen}
          />
        )}
      </div>
      {isOpen &&
        createPortal(
          <CancelWarningModal
            onCancel={onCancel}
            id={data?.resource?.eventDate?.id}
            setIsOpen={setIsOpen}
            duration={data?.resource?.eventDate?.duration}
          />,
          document.body,
        )}
    </>
  );
};

const CancelWarningModal = ({ onCancel, setIsOpen, duration, id }) => {
  const { user } = useAuth();
  const [t] = useTranslation('modals');
  const { data: payload } = useQuery(PACKAGE_QUERY, {
    variables: {
      userId: user.id,
    },
  });
  const [planLength, setPlanLength] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (payload && payload.results) {
      const [{ periodStart, periodEnd }] = payload.results.filter(
        (x) => parseInt(x.package.period, 10) === duration,
      );
      const diff = Math.round(
        (moment(periodStart).unix() - moment(periodEnd).unix()) / 2592000,
      );
      setPlanLength(diff);
    }
  }, [payload]);

  const cancellationDots = [];
  for (let i = 0; i < planLength; i++) {
    if (i <= planLength) {
      cancellationDots.push(<span className="dot dot-filled" key={i}></span>);
    } else {
      cancellationDots.push(<span className="dot dot-unfilled" key={i}></span>);
    }
  }

  const checkboxEvent = () => {
    setIsChecked(!isChecked);
  };

  const onClick = () => {
    onCancel(id);
  };

  return (
    <div className="row bg-white absolute z-[10000] px-4 py-2 rounded-lg border border-black/10 shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="col-auto">
        <div className="row">
          <div className="col-11 ps-2">
            <h2>{t('warning')}</h2>
          </div>
          <div className="col-auto text-end pt-2 absolute top-0 right-2">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
        </div>
        <div className="form-check pt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="cancel"
            value="cancel"
            onChange={checkboxEvent}
            checked={isChecked}
          />
          <label className="form-check-label" htmlFor="cancel">
            {t('confirm_cancel')}
          </label>
        </div>

        <div className="row pt-4">
          <div className="col-auto">
            <button
              className="enter-btn bg-pink text-white"
              onClick={onClick}
              disabled={!isChecked}
            >
              {t('continue_cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
