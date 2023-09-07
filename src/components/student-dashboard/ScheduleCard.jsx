import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import RescheduleAndCancelModal from './RescheduleAndCancelModal';
import ZoomWarningModal from './ZoomWarningModal';
import { useAuth } from '../../modules/auth';
import Swal from 'sweetalert2';
import { GET_ZOOMLINK } from '../../modules/auth/graphql';
import { useLazyQuery } from '@apollo/client';
import ReactLoader from '../common/Loader';
import notify from '../../utils/notify';
import { ROLES } from '../../constants/global';
import {
  addMinutes,
  differenceInHours,
  isWithinInterval,
  subMinutes,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

const ScheduleCard = ({
  index,
  lesson,
  zoomlinkId,
  date,
  mentor,
  data,
  fetchAppointments,
  cancelled,
  duration,
  subscription,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [t] = useTranslation(['modals', 'common']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isLate = differenceInHours(date, new Date()) <= 24;

  function onSelect() {
    if (isLate) {
      Swal.fire({
        title: t('cannot_reschedule'),
        text: t('reschedule_error'),
        icon: 'error',
        confirmButtonText: t('ok'),
      });
    } else {
      setIsOpen(true);
      // window.location.replace('/student/schedule-lesson/select/' + data.id);
      setModalType('reschedule');
    }
  }

  const closeModal = () => {
    setIsOpen(false);
    setIsWarningOpen(false);
    setTabIndex(0);
  };

  const onCancel = () => {
    if (isLate) {
      Swal.fire({
        title: t('cannot_cancel'),
        text: t('cancel_error'),
        icon: 'error',
        confirmButtonText: t('ok'),
      });
    } else {
      setIsOpen(true);
      setModalType('cancel');
    }
  };

  //Time period when you can go to the lesson
  const today = new Date();
  const tenMinuteBeforeStart = subMinutes(date, 10);
  const beforeEndLesson = addMinutes(date, data.duration);

  const isBetween = isWithinInterval(today, {
    start: tenMinuteBeforeStart,
    end: beforeEndLesson,
  });
  const [getZoomLink, { loading, error }] = useLazyQuery(GET_ZOOMLINK, {
    fetchPolicy: 'no-cache',
  });

  const joinLesson = () => {
    if (isBetween) {
      getZoomLink({
        variables: {
          id: parseInt(zoomlinkId),
        },
        onCompleted: (data) => {
          window.open(data.zoomLink.url, '_blank');
        },
      });
    } else {
      setIsWarningOpen(true);
    }
  };

  const displayDate = () => {
    const eventDate = format(
      utcToZonedTime(new Date(date), userTimezone),
      'MMM do',
      { timeZone: userTimezone },
    );
    const start = format(
      utcToZonedTime(new Date(date), userTimezone),
      'hh:mm a',
      { timeZone: userTimezone },
    );

    const end = format(
      addMinutes(
        utcToZonedTime(new Date(date), userTimezone),
        subscription?.package?.sessionTime || duration,
      ),
      'hh:mm a',
      { timeZone: userTimezone },
    );
    return `${eventDate} at ${start} → ${end}`;
  };

  if (error) {
    notify(error.message, 'error');
  }

  if (loading) {
    return <ReactLoader />;
  }

  return (
    <div
      className={`mb-5 rounded-[10px] p-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)] ${
        index === 0
          ? 'bg-color-purple'
          : 'border border-color-border-grey bg-white'
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-[30px] font-normal ${
                index === 0 ? 'text-white m-0' : 'text-black m-0'
              }`}
            >
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3
              className={`text-base font-semibold tracking-tight ${
                index === 0
                  ? 'text-color-light-purple'
                  : 'text-color-light-grey'
              }`}
            >
              {displayDate()}
            </h3>
          </div>
          <div className="w-[65px] h-[65px] overflow-hidden rounded-full relative">
            <img
              src={
                mentor?.avatar ? mentor?.avatar?.url : maleAvatar
                // ? maleAvatar
                // : femaleAvatar
              }
              className="object-cover "
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 xl:gap-3">
        {user.role !== ROLES.MENTOR && (
          <a
            className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px] bg-white rounded-[5px] ${
              index === 0
                ? 'text-color-purple'
                : 'border border-color-border-grey text-black'
            } ${isLate ? 'opacity-50' : ''}`}
            onClick={onSelect}
          >
            {t('reschedule')}
          </a>
        )}
        <a
          onClick={onCancel}
          className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px] bg-white rounded-[5px] ${
            index === 0
              ? 'text-color-purple'
              : 'border border-color-border-grey text-black'
          } ${isLate ? 'opacity-50' : ''}`}
        >
          {t('cancel', { ns: 'common' })}
        </a>
        <a
          onClick={data.status !== 'scheduled' ? joinLesson : undefined}
          target="_blank"
          rel="noreferrer"
          className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px]  rounded-[5px]
          ${
            index === 0
              ? 'text-color-purple'
              : 'border border-color-border-grey text-black'
          } ${
            data.status === 'scheduled'
              ? 'text-color-purple bg-[#b099d7]'
              : 'grey-border text-black bg-white'
          }`}
        >
          {t('join_lesson')}
        </a>
      </div>
      {isOpen && (
        <RescheduleAndCancelModal
          data={data}
          isOpen={isOpen}
          closeModal={closeModal}
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          fetchAppointments={fetchAppointments}
          tabIndex={tabIndex}
          type={modalType}
          cancelled={cancelled}
          duration={subscription?.duration || duration}
        />
      )}
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </div>
  );
};

export default ScheduleCard;
