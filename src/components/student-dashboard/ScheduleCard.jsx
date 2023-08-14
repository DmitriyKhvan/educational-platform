import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
// import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import RescheduleAndCancelModal from './RescheduleAndCancelModal';
import ZoomWarningModal from './ZoomWarningModal';
import { useAuth } from '../../modules/auth';
import Swal from 'sweetalert2';

const ScheduleCard = ({
  index,
  lesson,
  zoomlink,
  date,
  mentor,
  data,
  fetchAppointments,
  cancelled,
  duration,
  subscription, // TODO no subscription given as a prop ???
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [t] = useTranslation('modals');
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isLate = moment.duration(moment(date).diff(moment())).asHours() <= 24;

  function onSelect() {
    if (isLate) {
      Swal.fire({
        title: t('cannot_reschedule'),
        text: t('reschedule_error'),
        icon: 'error',
        confirmButtonText: t('ok'),
      });
    } else {
      // setIsOpen(true);
      window.location.replace('/student/schedule-lesson/select/' + data.id);
      setModalType('reschedule-time');
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

  const today = moment();
  const tenMinuteBeforeStart = moment(date).subtract(10, 'minutes');
  const fiveMinuteBeforeEnd = moment(date).add(data.duration - 5, 'minutes');

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

  console.log('lesson', lesson);

  const displayDate = () => {
    const eventDate = moment(date).tz(userTimezone).format('MMM Do');
    const start = moment(date).tz(userTimezone).format('hh:mm A');

    const end = moment(date)
      .tz(userTimezone)
      .add(subscription?.package?.sessionTime, 'minutes')
      .format('hh:mm A');

    console.log('end', end);
    return `${eventDate} at ${start} → ${end}`;
  };

  return (
    <div
      className={`page-card_schedule ${
        index === 0 ? 'purple' : 'grey-border bg-white'
      } small-card pt-2 mt-4`}
    >
      <div className="container mb-2">
        <div className="row justify-between">
          <div className="col-10 mobile-schedule_dash">
            <h1
              className={`${index === 0 ? 'text-white m-0' : 'text-black m-0'}`}
            >
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3
              className={`${
                index === 0
                  ? 'text-white m-0 font_schedule_text'
                  : 'text-muted m-0 font_schedule_text'
              }`}
            >
              {displayDate()}
            </h3>
          </div>
          <div className="col-2 cols-image-schedule mobile-schedule_dash overflow-hidden rounded-full relative">
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
      <div className="flex lg:gap-2 xl:gap-3">
        {/* <div className="">
          <a
            onClick={joinLesson}
            className={`schedule_copy-button ${
              index === 0
                ? 'text-purple mobile-schedule_dash'
                : 'grey-border text-black'
            }`}
          >
            {t('join_lesson')}
          </a>
        </div> */}
        <div className="">
          <a
            className={`schedule_copy-button ${
              isLate
                ? 'text-purpless back_schedule-button mobile-schedule_dash'
                : 'grey-border text-black'
            }`}
            onClick={onSelect}
          >
            {t('reschedule')}
          </a>
        </div>
        <div className="">
          <a
            onClick={onCancel}
            className={`schedule_copy-button ${
              isLate
                ? 'text-purpless back_schedule-button m-0 mobile-schedule_dash'
                : 'grey-border text-black m-0'
            }`}
          >
            {t('cancel_lesson')}
          </a>
        </div>
        <a
          onClick={data.status !== 'scheduled' ? joinLesson : undefined}
          target="_blank"
          rel="noreferrer"
          className={`schedule_copy-button ${
            data.status === 'scheduled'
              ? 'text-purpless back_schedule-button m-0 mobile-schedule_dash'
              : 'grey-border text-black m-0'
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
