/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '../Form/Button';
import { AdaptiveDialog } from '../AdaptiveDialog';
// import { FaPlay } from 'react-icons/fa6';
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
import { FaStar } from 'react-icons/fa6';
// import { cn } from 'src/utils/functions';
import LessonReviewModal from './LessonReviewModal';
// import { useHistory } from 'react-router-dom';
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
  // const [openReview, setOpenReview] = useState(false);
  // console.log('🚀 ~ openReview:', openReview);

  // НЕ ЗАБЫТЬ УБРАТЬ ЭТО
  const isAfterLesson = true;
  // const isAfterLesson = isAfter(
  //   new Date(),
  //   addMinutes(new Date(date), data.duration),
  // );

  const gridStyle = {
    gridTemplateColumns: `repeat(${pattern === 'table' && user.role === Roles.STUDENT && isAfterLesson ? 3 : controls.length}, minmax(0, 1fr))`,
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
        <Button
          key="join"
          className="w-full text-xs sm:text-sm px-2"
          onClick={joinLesson}
        >
          {t('join_lesson')}
        </Button>,
      );
    }

    if (pattern === 'info' && !isAfterLesson) {
      // if (pattern === 'info') {
      controls.push(
        <AdaptiveDialog
          key="info"
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
          key="reschedule"
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

    // if (isAfterLesson) {
    //   controls.push(
    //     <AdaptiveDialog
    //       button={
    //         <Button
    //           disabled={!data?.playground?.recordingUrl}
    //           className="grow gap-1 sm:gap-2 text-xs sm:text-sm px-2"
    //         >
    //           <FaPlay />
    //           {t('watch_recording')}
    //         </Button>
    //       }
    //     >
    //       <LessonInfoModal
    //         date={date}
    //         data={data}
    //         playground={data?.playground}
    //         refetch={refetch}
    //         duration={duration}
    //         setCanceledLessons={setCanceledLessons}
    //         userTimezone={userTimezone}
    //       />
    //     </AdaptiveDialog>,
    //   );
    // }

    if (isAfterLesson && user.role === Roles.MENTOR) {
      controls.push(
        <AdaptiveDialog
          key="review"
          button={
            <Button
              className={cn(
                'grow text-xs sm:text-sm px-2 gap-2',
                // pattern === 'table' && 'col-span-1',
              )}
            >
              <FaStar /> Submit feedback
            </Button>
          }
          // open={openReview}
          // setOpen={setOpenReview}
        >
          <MentorFeedbackModal data={data} />
        </AdaptiveDialog>,
      );
    }

    if (isAfterLesson && user.role === Roles.STUDENT) {
      controls.push(
        <Button
          key="feedback"
          className={cn(
            'grow text-xs sm:text-sm px-2',
            pattern === 'table' && 'col-span-2',
          )}
          theme="dark_purple"
          onClick={() =>
            navigate(`/student/lesson-calendar/feedback/${data.id}`)
          }
        >
          Lesson Feedback
        </Button>,
        <AdaptiveDialog
          key="review"
          button={
            <Button
              className={cn(
                'grow text-xs sm:text-sm px-2 gap-2',
                pattern === 'table' && 'col-span-1',
              )}
            >
              <FaStar /> {pattern !== 'table' && 'Submit review'}
            </Button>
          }
          // open={openReview}
          // setOpen={setOpenReview}
        >
          <LessonReviewModal
            studentId={data?.student?.id}
            lessonId={data?.id}
            closeModal={() => window.location.reload()}
          />
        </AdaptiveDialog>,
        // <Button
        //   key="review"
        // className={cn(
        //   'grow text-xs sm:text-sm px-2 gap-2',
        //   pattern === 'table' && 'col-span-1',
        // )}
        // >
        //   <FaStar /> {pattern !== 'table' && 'Submit review'}
        // </Button>,
      );
    }

    if (!isAfterLesson && !(user.role === Roles.MENTOR && data.isTrial)) {
      controls.push(
        <AdaptiveDialog
          key="cancel"
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
      <div
        style={gridStyle}
        className={cn(
          'gap-2 xl:gap-3 h-[52px] grid',
          // pattern === 'table' ? 'flex' : 'grid',
        )}
      >
        {controls}
        {/* {controls.map((control, index) => (
          <div className="grid" key={index}>
            {control}
          </div>
        ))} */}
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
