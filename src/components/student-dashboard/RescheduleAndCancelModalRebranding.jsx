import React, { useState } from 'react';
import CancellationPolicyModal from './CancellationPolicyModal';
import CancelLessonModal from './CancelLessonModal';
import { useAuth } from 'src/app/providers/AuthProvider';
import { Roles } from 'src/shared/constants/global';
import {
  MentorCancelWarningModal,
  StudentCancelWarningModal,
} from 'src/entities/CancelWarningModal';

// import ModalWrapper from '../ModalWrapper/ModalWrapper';

const RescheduleAndCancelModal = ({
  data,
  // isOpen,
  // closeModal,
  setTabIndex,
  fetchAppointments,
  tabIndex,
  type,
  // cancelled,
  duration,
}) => {
  const { user } = useAuth();
  const [repeatLessons, setRepeatLessons] = useState(false);

  return (
    <>
      {tabIndex === 0 ? (
        user?.role === Roles.MENTOR ? (
          <MentorCancelWarningModal data={data} setTabIndex={setTabIndex} />
        ) : (
          <StudentCancelWarningModal
            data={data}
            setTabIndex={setTabIndex}
            duration={duration}
            type={type}
            modifyCredits={data?.packageSubscription?.modifyCredits}
            setRepeatLessons={setRepeatLessons}
            repeatLessons={repeatLessons}
          />
        )
      ) : tabIndex === 1 ? (
        <CancelLessonModal
          setTabIndex={setTabIndex}
          id={data.id}
          fetchAppointments={fetchAppointments}
          // cancelled={cancelled}
          repeatLessons={repeatLessons}
        />
      ) : (
        tabIndex === 10 && <CancellationPolicyModal setTabIndex={setTabIndex} />
      )}
    </>
  );
};

export default RescheduleAndCancelModal;
