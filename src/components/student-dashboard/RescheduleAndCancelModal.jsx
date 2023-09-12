import React, { useState } from 'react';
import CancellationPolicyModal from './CancellationPolicyModal';
import CancelLessonModal from './CancelLessonModal';
import CancelWarningModal from './CancelWarningModal';
import ReschedulingTimeModal from './ReschedulingTimeModal';
import ReschedulingTutorModal from './ReschedulingTutorModal';
import RescheduleConfirmationModal from './RescheduleConfirmationModal';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../modules/auth/graphql';
import ModalWrapper from '../ModalWrapper/ModalWrapper';

const RescheduleAndCancelModal = ({
  data,
  isOpen,
  closeModal,
  setTabIndex,
  setIsOpen,
  fetchAppointments,
  tabIndex,
  type,
  // cancelled,
  setCanceledLessons,
  duration,
}) => {
  const [schedule, setSchedule] = useState();
  const [selectTutor, setSelectTutor] = useState();
  const { data: tutors } = useQuery(MENTORS_QUERY);
  const [isLoading] = useState(false);
  const [repeatLessons, setRepeatLessons] = useState(false);

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {tabIndex === 0 ? (
        <CancelWarningModal
          data={data}
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          duration={data.duration}
          type={type}
          modifyCredits={data?.packageSubscription?.modifyCredits}
          setRepeatLessons={setRepeatLessons}
          repeatLessons={repeatLessons}
        />
      ) : tabIndex === 1 ? (
        <CancelLessonModal
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          id={data.id}
          fetchAppointments={fetchAppointments}
          // cancelled={cancelled}
          setCanceledLessons={setCanceledLessons}
          repeatLessons={repeatLessons}
        />
      ) : tabIndex === 2 ? (
        <ReschedulingTimeModal
          setSchedule={setSchedule}
          setTabIndex={setTabIndex}
          type={type}
          duration={duration}
        />
      ) : tabIndex === 3 ? (
        <ReschedulingTutorModal
          tutors={tutors}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
          isLoading={isLoading}
        />
      ) : tabIndex === 4 ? (
        <RescheduleConfirmationModal
          setTabIndex={setTabIndex}
          data={data}
          schedule={schedule}
          tutor={selectTutor}
          closeModal={closeModal}
        />
      ) : (
        tabIndex === 10 && (
          <CancellationPolicyModal
            setTabIndex={setTabIndex}
            setIsOpen={setIsOpen}
          />
        )
      )}
    </ModalWrapper>
  );
};

export default RescheduleAndCancelModal;
