import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CancellationPolicyModal from './CancellationPolicyModal';
import CancelLessonModal from './CancelLessonModal';
import CancelWarningModal from './CancelWarningModal';
import ModalWrapper from '../ModalWrapper';
import ReschedulingTimeModal from './ReschedulingTimeModal';
import ReschedulingTutorModal from './ReschedulingTutorModal';
import RescheduleConfirmationModal from './RescheduleConfirmationModal';

const RescheduleAndCancelModal = ({
  data,
  isOpen,
  closeModal,
  setTabIndex,
  setIsOpen,
  fetchAppointments,
  tabIndex,
  type,
  cancelled,
  duration,
}) => {
  const [schedule, setSchedule] = useState();
  const [selectTutor, setSelectTutor] = useState();
  const tutors = useSelector((state) => state.tutor.list);
  const [isLoading] = useState(false);

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {tabIndex === 0 ? (
        <CancelWarningModal
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          duration={data.duration}
          type={type}
        />
      ) : tabIndex === 1 ? (
        <CancelLessonModal
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          id={data.id}
          fetchAppointments={fetchAppointments}
          cancelled={cancelled}
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
