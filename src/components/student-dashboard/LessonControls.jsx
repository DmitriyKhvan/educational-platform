import React, { useState, useEffect } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from '../AdaptiveDialog';
import { FaPlay } from 'react-icons/fa6';
import { ModalType, Roles } from 'src/constants/global';
import { isBetween } from 'src/utils/isBetween';
import { useAuth } from 'src/modules/auth';
import { useTranslation } from 'react-i18next';
import RescheduleAndCancelModal from './RescheduleAndCancelModalRebranding';
import ZoomWarningModal from './ZoomWarningModal';
import LessonInfoModal from './LessonInfoModal';
import { addMinutes, isAfter } from 'date-fns';
import { isWithinHours } from 'src/utils/isWithinHours';

const LessonControls = ({
  date,
  data,
  refetch,
  duration,
  setCanceledLessons,
  pattern = 'card', // card, table, info
}) => {
  const dateLesson = new Date(date);

  const { user } = useAuth();

  const [t] = useTranslation(['modals', 'common']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [controls, setControls] = useState([]);

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  function onSelect() {
    setIsOpen(true);

    setModalType(ModalType.RESCHEDULE);
  }

  const closeModal = () => {
    setIsOpen(false);
    setIsWarningOpen(false);
    setTabIndex(0);
  };

  const onCancel = () => {
    setIsOpen(true);
    setModalType(ModalType.CANCEL);
  };

  const joinLesson = () => {
    //Time period when you can go to the lesson
    if (
      isBetween({
        dateStart: dateLesson,
        duration: data.duration,
        userTimezone,
      })
    ) {
      window.open(
        user.role === Roles.MENTOR ? data?.zoom?.startUrl : data?.zoom?.joinUrl,
        '_blank',
      );
    } else {
      setIsWarningOpen(true);
    }
  };

  const isAfterLesson = isAfter(
    new Date(),
    addMinutes(new Date(date), data.duration),
  );

  const isWithin24Hours = isWithinHours({
    dateStart: new Date(),
    dateEnd: dateLesson,
    hours: 24,
    userTimezone,
  });

  const rescheduleAndCancelModal = (
    <RescheduleAndCancelModal
      data={data}
      isOpen={isOpen}
      closeModal={closeModal}
      setTabIndex={setTabIndex}
      setIsOpen={setIsOpen}
      fetchAppointments={refetch}
      tabIndex={tabIndex}
      type={modalType}
      // cancelled={cancelled}
      setCanceledLessons={setCanceledLessons}
      duration={duration}
    />
  );

  useEffect(() => {
    let controls = [];

    if (!isAfterLesson && isWithin24Hours) {
      controls.push(
        <Button className="w-full text-xs sm:text-sm p-0" onClick={joinLesson}>
          {t('join_lesson')}
        </Button>,
      );
    }

    if (pattern === 'info') {
      controls.push(
        <AdaptiveDialog
          button={
            <Button className="grow text-xs sm:text-sm p-0" theme="dark_purple">
              Info
            </Button>
          }
        >
          <LessonInfoModal
            date={date}
            data={data}
            refetch={refetch}
            duration={duration}
            setCanceledLessons={setCanceledLessons}
            userTimezone={userTimezone}
          />
        </AdaptiveDialog>,
      );
    }

    if (!isAfterLesson && !isWithin24Hours) {
      controls.push(
        <AdaptiveDialog
          button={
            <Button
              theme="dark_purple"
              className="grow text-xs sm:text-sm p-0"
              onClick={onSelect}
            >
              {t('reschedule')}
            </Button>
          }
        >
          {rescheduleAndCancelModal}
        </AdaptiveDialog>,
      );
    }

    if (isAfterLesson) {
      controls.push(
        <AdaptiveDialog
          button={
            <Button
              // TODO: implement onClick
              disabled={!data?.zoom?.recordingUrl}
              className="grow gap-1 sm:gap-2 text-xs sm:text-sm p-0"
            >
              <FaPlay />
              {t('watch_recording')}
            </Button>
          }
        >
          <LessonInfoModal
            date={date}
            data={data}
            zoom={data?.zoom}
            refetch={refetch}
            duration={duration}
            setCanceledLessons={setCanceledLessons}
            userTimezone={userTimezone}
          />
        </AdaptiveDialog>,
      );
    }

    if (!isAfterLesson) {
      controls.push(
        <AdaptiveDialog
          button={
            <Button
              theme="red"
              className="grow text-xs sm:text-sm p-0"
              onClick={onCancel}
            >
              {t('cancel', { ns: 'common' })}
            </Button>
          }
        >
          {rescheduleAndCancelModal}
        </AdaptiveDialog>,
      );
    }

    setControls(controls);
  }, []);

  return (
    <>
      <div
        className={`grid gap-2 xl:gap-3 h-[52px] grid-cols-${controls.length}`}
      >
        {controls.map((control, index) => (
          <div className="grid" key={index}>
            {control}
          </div>
        ))}
      </div>

      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </>
  );
};

export default LessonControls;
