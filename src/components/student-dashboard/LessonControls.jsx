import React, { useState, useEffect } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from 'src/shared/ui/AdaptiveDialog';
import {
  LessonsStatusType,
  ModalType,
  Roles,
} from 'src/shared/constants/global';
import { isBetween } from 'src/shared/utils/isBetween';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import RescheduleAndCancelModal from './RescheduleAndCancelModalRebranding';
import PlaygroundWarningModal from './PlaygroundWarningModal';
import LessonInfoModal from './LessonInfoModal';
import { addMinutes, isAfter } from 'date-fns';
import { isWithinHours } from 'src/shared/utils/isWithinHours';
import { CancelTrialLessonModal } from './CancelTrialLessonModal';
import { FaCheck, FaPlay, FaStar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { cn } from 'src/shared/utils/functions';
import { MentorFeedbackModal } from 'src/entities/MentorFeedbackModal';

const LessonControls = ({
  date,
  data,
  refetch,
  duration,
  setCanceledLessons,
  pattern = 'card', // card, table, info
}) => {
  const dateLesson = new Date(date);
  const navigate = useNavigate();

  const { user } = useAuth();

  const [t] = useTranslation(['modals', 'common', 'feedback']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [controls, setControls] = useState([]);

  const [mentorReviewOpen, setMentorReviewOpen] = useState(false);

  const isAfterLesson = isAfter(
    new Date(),
    addMinutes(new Date(date), data.duration),
  );

  const gridStyle =
    pattern === 'table' && isAfterLesson
      ? { display: 'flex' }
      : {
          gridTemplateColumns: `repeat(${controls.length}, minmax(0, 1fr))`,
          display: 'grid',
        };

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <effect must be triggered on isOpen change>
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

  const isWithin24Hours = isWithinHours({
    dateStart: new Date(),
    dateEnd: dateLesson,
    hours: 24,
    userTimezone,
  });

  const rescheduleAndCancelModal = (modalType) => (
    <RescheduleAndCancelModal
      data={data}
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
      setIsOpen={setIsOpen}
      fetchAppointments={refetch}
    />
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
    if (pattern === 'info' && !isAfterLesson) {
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
          button={
            <Button
              theme="dark_purple"
              className="grow text-xs sm:text-sm px-2"
            >
              {t('reschedule')}
            </Button>
          }
        >
          {rescheduleAndCancelModal(ModalType.RESCHEDULE)}
        </AdaptiveDialog>,
      );
    }

    if (isAfterLesson) {
      controls.push(
        <AdaptiveDialog
          button={
            <Button
              disabled={!data?.playground?.recordingUrl}
              className="grow gap-1 sm:gap-2 text-xs sm:text-sm min-w-10 min-h-10"
            >
              <FaPlay />
              {pattern !== 'table' && t('watch_recording')}
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

    if (isAfterLesson && user.role === Roles.STUDENT) {
      controls.push(
        <Button
          disabled={!data?.mentorReview}
          className={cn('grow text-xs sm:text-sm px-2 gap-2')}
          theme="purple"
          onClick={() =>
            navigate(`/student/lesson-calendar/feedback/${data.id}`)
          }
        >
          <FaStar className="min-w-5 min-h-5" />{' '}
          <span className="text-[13px] truncate">
            {t('feedback', { ns: 'feedback' })}
          </span>
        </Button>,
      );
    }

    if (isAfterLesson && user.role === Roles.MENTOR) {
      controls.push(
        <AdaptiveDialog
          open={mentorReviewOpen}
          setOpen={setMentorReviewOpen}
          classNameDrawer="h-[95%]"
          button={
            <Button
              disabled={data?.mentorReview}
              className={cn(
                'grow text-xs sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]',
              )}
            >
              {!data?.mentorReview && (
                <>
                  <FaStar className="min-w-5 min-h-5" />
                  <span className="truncate">Feedback</span>
                </>
              )}
              {data?.mentorReview && (
                <>
                  <FaCheck className="" />
                  <span className="truncate">Submitted</span>
                </>
              )}
            </Button>
          }
        >
          <MentorFeedbackModal
            data={data}
            closeModal={() => {
              setMentorReviewOpen(false);
              refetch();
            }}
          />
        </AdaptiveDialog>,
      );
    }

    if (
      data.status !== LessonsStatusType.CANCELED &&
      data.status !== LessonsStatusType.COMPLETED &&
      !(user.role === Roles.MENTOR && data.isTrial)
    ) {
      controls.push(
        <AdaptiveDialog
          button={
            <Button theme="red" className="grow text-xs sm:text-sm px-2">
              {t('cancel', { ns: 'common' })}
            </Button>
          }
        >
          {data.isTrial
            ? cancelTrialLessonModal(ModalType.CANCEL)
            : rescheduleAndCancelModal(ModalType.CANCEL)}
        </AdaptiveDialog>,
      );
    }

    setControls(controls);
  }, [tabIndex, mentorReviewOpen, isOpen, t]);

  return (
    <>
      <div style={gridStyle} className={cn('gap-2 xl:gap-3 h-[52px]')}>
        {controls.map((control, index) => (
          <div key={index} className="flex">
            {control}
          </div>
        ))}
      </div>

      <AdaptiveDialog open={isWarningOpen} setOpen={setIsWarningOpen}>
        <PlaygroundWarningModal />
      </AdaptiveDialog>
    </>
  );
};

export default LessonControls;
``;
