import React, { useState, useEffect } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from '../AdaptiveDialog';
import { FaPlay } from 'react-icons/fa6';
import { LessonsStatusType, ModalType, Roles } from 'src/constants/global';
import { isBetween } from 'src/utils/isBetween';
import { useAuth } from 'src/modules/auth';
import { useTranslation } from 'react-i18next';
import RescheduleAndCancelModal from './RescheduleAndCancelModalRebranding';
import PlaygroundWarningModal from './PlaygroundWarningModal';
import LessonInfoModal from './LessonInfoModal';
import { addMinutes, isAfter } from 'date-fns';
import { isWithinHours } from 'src/utils/isWithinHours';
import { CancelTrialLessonModal } from './CancelTrialLessonModal';

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

  const gridStyle = {
    gridTemplateColumns: `repeat(${controls.length}, minmax(0, 1fr))`,
  };

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

  useEffect(() => {
    setTabIndex(0);
  }, [isOpen]);

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
        user.role === Roles.MENTOR
          ? data?.playground?.startUrl
          : data?.playground?.joinUrl,
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
      // isOpen={isOpen}
      // closeModal={closeModal}
      setTabIndex={setTabIndex}
      setIsOpen={setIsOpen}
      fetchAppointments={refetch}
      tabIndex={tabIndex}
      type={modalType}
      setCanceledLessons={setCanceledLessons}
      duration={duration}
    />
  );

  const cancelTrialLessonModal = (
    <CancelTrialLessonModal
      data={data}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      fetchAppointments={refetch}
    />
  );

  useEffect(() => {
    let controls = [];

    if (
      !isAfterLesson &&
      isWithin24Hours &&
      data.status === LessonsStatusType.APPROVED
    ) {
      controls.push(
        <Button className="w-full text-xs sm:text-sm px-2" onClick={joinLesson}>
          {t('join_lesson')}
        </Button>,
      );
    }

    if (pattern === 'info') {
      controls.push(
        <AdaptiveDialog
          button={
            <Button
              className="grow text-xs sm:text-sm px-2"
              theme="dark_purple"
            >
              {t('info')}
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

    if (
      !isAfterLesson &&
      !isWithin24Hours &&
      !data.isTrial &&
      user.role !== Roles.MENTOR
    ) {
      controls.push(
        <AdaptiveDialog
          // open={isOpen}
          // setOpen={setIsOpen}
          button={
            <Button
              theme="dark_purple"
              className="grow text-xs sm:text-sm px-2"
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
              disabled={!data?.playground?.recordingUrl}
              className="grow gap-1 sm:gap-2 text-xs sm:text-sm px-2"
            >
              <FaPlay />
              {t('watch_recording')}
            </Button>
          }
        >
          <LessonInfoModal
            date={date}
            data={data}
            playground={data?.playground}
            refetch={refetch}
            duration={duration}
            setCanceledLessons={setCanceledLessons}
            userTimezone={userTimezone}
          />
        </AdaptiveDialog>,
      );
    }

    if (!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial)) {
      controls.push(
        <AdaptiveDialog
          // open={isOpen}
          // setOpen={setIsOpen}
          button={
            <Button
              theme="red"
              className="grow text-xs sm:text-sm px-2"
              onClick={onCancel}
            >
              {t('cancel', { ns: 'common' })}
            </Button>
          }
        >
          {data.isTrial ? cancelTrialLessonModal : rescheduleAndCancelModal}
        </AdaptiveDialog>,
      );
    }

    setControls(controls);
  }, [modalType, tabIndex, isOpen, t]);

  return (
    <>
      <div style={gridStyle} className="grid gap-2 xl:gap-3 h-[52px]">
        {controls.map((control, index) => (
          <div className="grid" key={index}>
            {control}
          </div>
        ))}
      </div>

      {isWarningOpen && (
        <PlaygroundWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </>
  );
};

export default LessonControls;
