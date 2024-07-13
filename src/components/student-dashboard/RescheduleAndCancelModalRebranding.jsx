import React, { useState } from 'react';
import CancellationPolicyModal from './CancellationPolicyModal';
import CancelLessonModal from './CancelLessonModal';
import { CancelWarningModal } from 'src/entities/CancelWarningModal';

// import ModalWrapper from '../ModalWrapper/ModalWrapper';

const RescheduleAndCancelModal = ({
  data,
  // isOpen,
  // closeModal,
  setTabIndex,
  setIsOpen,
  fetchAppointments,
  tabIndex,
  type,
  // cancelled,
  setCanceledLessons,
  duration,
}) => {
  const [repeatLessons, setRepeatLessons] = useState(false);

  return (
    <>
      {tabIndex === 0 ? (
        <CancelWarningModal
          data={data}
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          duration={duration}
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
      ) : (
        tabIndex === 10 && (
          <CancellationPolicyModal
            setTabIndex={setTabIndex}
            setIsOpen={setIsOpen}
          />
        )
      )}
    </>
  );
};

export default RescheduleAndCancelModal;
