import React, { useState, useEffect } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from '../AdaptiveDialog';
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
import { FaCheck, FaRegClock, FaStar } from 'react-icons/fa6';
import LessonReviewModal from './LessonReviewModal';
import MentorFeedbackModal from '../MentorFeedbackModal';
import { useNavigate } from 'react-router-dom';
import { cn } from 'src/shared/utils/functions';

const LessonControls = ({
  date,
  data,
  refetch,
  duration,
  setCanceledLessons,
  pattern = 'card', // card, table, info
}) => {
  console.log('🚀 ~ data:', data);
  const dateLesson = new Date(date);
  const navigate = useNavigate();

  const { user } = useAuth();

  const [t] = useTranslation(['modals', 'common']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [controls, setControls] = useState([]);

  const [mentorReviewOpen, setMentorReviewOpen] = useState(false);
  const [openStudentReview, setOpenStudentReview] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  // НЕ ЗАБЫТЬ УДАЛИТЬ!!!
  // const isAfterLesson = true;
  const isAfterLesson = isAfter(
    new Date(),
    addMinutes(new Date(date), data.duration),
  );

  const gridStyle = {
    gridTemplateColumns: `repeat(${pattern === 'table' && user.role === Roles.STUDENT && isAfterLesson ? 3 : controls}, minmax(0, 1fr))`,
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

  const isWithin24Hours = isWithinHours({
    dateStart: new Date(),
    dateEnd: dateLesson,
    hours: 24,
    userTimezone,
  });

  const rescheduleAndCancelModal = (
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
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      fetchAppointments={refetch}
    />
  );

  useEffect(() => {
    let controls = 0;

    if (
      !isAfterLesson &&
      isWithin24Hours &&
      data.status === LessonsStatusType.APPROVED
    ) {
      controls++;
    }
    if (pattern === 'info' && !isAfterLesson) {
      controls++;
    }
    if (
      !isAfterLesson &&
      !isWithin24Hours &&
      !data.isTrial &&
      user.role !== Roles.MENTOR
    ) {
      controls++;
    }
    if (isAfterLesson && user.role === Roles.MENTOR) {
      controls++;
    }
    if (isAfterLesson && user.role === Roles.STUDENT) {
      controls += 2;
    }
    if (!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial)) {
      controls++;
    }

    setControls(controls);
  }, [modalType, tabIndex, isOpen, t]);

  return (
    <>
      <div style={gridStyle} className={cn('gap-2 xl:gap-3 h-[52px] grid')}>
        {!isAfterLesson &&
          isWithin24Hours &&
          data.status === LessonsStatusType.APPROVED && (
            <Button
              className="w-full text-xs sm:text-sm px-2"
              onClick={joinLesson}
            >
              {t('join_lesson')}
            </Button>
          )}

        {pattern === 'info' && !isAfterLesson && (
          <AdaptiveDialog
            button={
              <Button
                className="grow text-xs sm:text-sm px-2"
                theme="dark_purple"
              >
                {t('info')}
              </Button>
            }
            open={openInfo}
            setOpen={setOpenInfo}
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

        {!isAfterLesson &&
          !isWithin24Hours &&
          !data.isTrial &&
          user.role !== Roles.MENTOR && (
            <AdaptiveDialog
              open={openReschedule}
              setOpen={setOpenReschedule}
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
            </AdaptiveDialog>
          )}

        {isAfterLesson && user.role === Roles.STUDENT && (
          <>
            <Button
              disabled={!data?.mentorReview}
              className={cn(
                'grow text-xs sm:text-sm px-2 gap-2',
                pattern === 'table' && 'col-span-2',
              )}
              theme="dark_purple"
              onClick={() =>
                navigate(`/student/lesson-calendar/feedback/${data.id}`)
              }
            >
              {data?.mentorReview ? (
                'Lesson Feedback'
              ) : (
                <>
                  <FaRegClock /> Feedback pending
                </>
              )}
            </Button>
            <AdaptiveDialog
              button={
                <Button
                  // disabled={true}
                  disabled={data?.studentReview}
                  className={cn(
                    'grow text-xs sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]',
                    pattern === 'table' && 'col-span-1',
                  )}
                >
                  {data?.studentReview ? <FaCheck /> : <FaStar />}{' '}
                  {pattern !== 'table' &&
                    (data?.studentReview ? 'Review submited' : 'Submit review')}
                </Button>
              }
              open={openStudentReview}
              setOpen={setOpenStudentReview}
            >
              <LessonReviewModal
                studentId={data?.student?.id}
                lessonId={data?.id}
                closeModal={() => {
                  setOpenStudentReview(false);
                  refetch();
                }}
              />
            </AdaptiveDialog>
          </>
        )}

        {!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial) && (
          <AdaptiveDialog
            open={openCancel}
            setOpen={setOpenCancel}
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
          </AdaptiveDialog>
        )}

        {isAfterLesson && user.role === Roles.MENTOR && (
          <AdaptiveDialog
            open={mentorReviewOpen}
            setOpen={setMentorReviewOpen}
            button={
              <Button
                disabled={data?.mentorReview}
                className={cn(
                  'grow text-xs sm:text-sm px-2 gap-2 disabled:bg-[#039855] disabled:bg-opacity-10 disabled:text-[#0EC541]',
                )}
              >
                {!data?.mentorReview && <FaStar />}{' '}
                {data?.mentorReview ? 'Feedback submitted' : 'Submit feedback'}
              </Button>
            }
          >
            <MentorFeedbackModal
              data={data}
              closeModal={() => setMentorReviewOpen(false)}
            />
          </AdaptiveDialog>
        )}
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
