import React, { useState } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from '../AdaptiveDialog';
import { FaPlay } from 'react-icons/fa6';
import { LessonsStatusType, ModalType, Roles } from 'src/constants/global';
import { isBetween } from 'src/utils/isBetween';
import { useAuth } from 'src/modules/auth';
import { useTranslation } from 'react-i18next';
import RescheduleAndCancelModal from './RescheduleAndCancelModal';
import ZoomWarningModal from './ZoomWarningModal';
import LessonInfoModal from './LessonInfoModal';

const LessonControls = ({
  date,
  data,
  refetch,
  duration,
  setCanceledLessons,
  pattern = 'card', // card, grid, table, info
}) => {
  const dateLesson = new Date(date);

  const { user } = useAuth();

  const [t] = useTranslation(['modals', 'common']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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
    if (isBetween(dateLesson, data.duration, userTimezone)) {
      window.open(
        user.role === Roles.MENTOR ? data?.zoom?.startUrl : data?.zoom?.joinUrl,
        '_blank',
      );
    } else {
      setIsWarningOpen(true);
    }
  };
  return (
    <>
      <div
        className={`grid gap-2 xl:gap-3 h-[52px] ${
          pattern === 'info'
            ? 'grid-cols-1'
            : pattern === 'table'
            ? 'grid-cols-2'
            : data?.status === LessonsStatusType.SCHEDULED ||
              data?.status === LessonsStatusType.APPROVED
            ? 'grid-cols-3'
            : 'grid-cols-3 sm:grid-cols-2'
        }`}
      >
        {data.status === LessonsStatusType.APPROVED && (
          <Button onClick={joinLesson}>{t('join_lesson')}</Button>
        )}

        {data.status === LessonsStatusType.COMPLETED && (
          <AdaptiveDialog
            button={
              <Button
                // TODO: implement onClick
                disabled={!data?.zoom?.recordingUrl}
                className={`grow gap-1 sm:gap-2 col-span-2`}
              >
                <FaPlay />
                Watch
                {/* {t('watch_recording')} */}
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
          </AdaptiveDialog>
        )}

        {pattern !== 'info' && data.status !== LessonsStatusType.APPROVED && (
          <AdaptiveDialog
            button={
              <Button
                className={`grow gap-1 sm:gap-2 col-span-1`}
                theme="dark_purple"
              >
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
          </AdaptiveDialog>
        )}

        {pattern !== 'table' &&
          (data.status === LessonsStatusType.SCHEDULED ||
            data.status === LessonsStatusType.APPROVED) && (
            <Button theme="dark_purple" onClick={onSelect}>
              {t('reschedule')}
            </Button>
          )}

        {data.status !== LessonsStatusType.COMPLETED && (
          <Button theme="red" onClick={onCancel}>
            {t('cancel', { ns: 'common' })}
          </Button>
        )}
      </div>

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
