import { useAuth } from '@/app/providers/auth-provider';
import {
  MentorCancelWarningModal,
  StudentCancelWarningModal,
} from '@/entities/cancel-warning-modal';
import { type ModalType, Roles } from '@/shared/constants/global';
import type { Lesson } from '@/types/types.generated';
import { useState } from 'react';
import CancelLessonModal from './cancel-lesson-modal';
import CancellationPolicyModal from './cancellation-policy-modal';

interface RescheduleAndCancelModalProps {
  data: Lesson;
  setTabIndex: (index: number) => void;
  fetchAppointments: () => void;
  tabIndex: number;
  type: ModalType;
  // cancelled: boolean;
  duration: number;
}

const RescheduleAndCancelModal: React.FC<RescheduleAndCancelModalProps> = ({
  data,
  setTabIndex,
  fetchAppointments,
  tabIndex,
  type,
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
            type={type}
            modifyCredits={data?.packageSubscription?.modifyCredits || 0}
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
