import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import { cancellationArr } from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import { useMutation } from '@apollo/client';
import { FaChevronLeft } from 'react-icons/fa6';
import { TextareaField } from '@/components/form/textarea-field';
import { MENTOR_CANCEL_APPOINTMENT } from '@/shared/apollo/mutations/lessons/mentor-cancel-lessons';

import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CANCEL_APPOINTMENT } from '@/shared/apollo/mutations/lessons/cancelLessons';
import { UserRoleType } from '@/types/types.generated';

interface CancelLessonModalProps {
  setTabIndex: (index: number) => void;
  id?: string;
  fetchAppointments: () => void;
  repeatLessons: boolean;
}

const CancelLessonModal: React.FC<CancelLessonModalProps> = ({
  setTabIndex,
  id,
  fetchAppointments,
  repeatLessons,
}) => {
  const [t] = useTranslation(['common', 'lessons']);
  const [cancel, setCancel] = useState<{ value: string } | null>({ value: '' });
  const [isChecked, setIsChecked] = useState(false);
  const [cancelReasons, setCancelReasons] = useState<string[]>([]);
  const [reasonOther, setReasonOther] = useState('');
  const [messageForStudent, setMessageForStudent] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === UserRoleType.Mentor) {
      const cancellationArrMentor = [...cancellationArr.slice(0, 5), ...cancellationArr.slice(6)];
      setCancelReasons(cancellationArrMentor);
    } else {
      setCancelReasons(cancellationArr);
    }
  }, [user]);

  const checkboxEvent = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    if (value === cancel?.value) {
      setCancel({ value: '' });
      setIsChecked(false);
    } else {
      setCancel({ value });
      setIsChecked(true);
    }
  };

  const [cancelLesson] = useMutation(CANCEL_APPOINTMENT);
  const [mentorCancelLesson] = useMutation(MENTOR_CANCEL_APPOINTMENT);

  const onCancelCompleted = async () => {
    // To update lessons in the calendar if you cancel lessons from the calendar
    await fetchAppointments();
    notify('Your lesson has been cancelled successfully');
  };

  const onCancelLesson = async () => {
    setLoading(true);
    try {
      if (user?.role === UserRoleType.Student) {
        const response = await cancelLesson({
          variables: {
            id: id,
            cancelReason: cancel?.value,
            repeat: repeatLessons,
          },
        });

        if (response) {
          await onCancelCompleted();
        }
      } else {
        const response = await mentorCancelLesson({
          variables: {
            id: id,
            studentMessage: messageForStudent,
            cancelReason:
              cancel?.value === t('reason_7', { ns: 'lessons' }) ? reasonOther : cancel?.value,
          },
        });

        if (response) {
          await onCancelCompleted();
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* {(isLoading || isLoadingMentor) && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )} */}
      <div className="max-w-[416px] w-full sm:w-[416px] mx-auto">
        <h2 className="text-[22px] font-bold justify-center relative flex items-center">
          <button type="button" className="absolute left-0 ms-0" onClick={() => setTabIndex(0)}>
            <FaChevronLeft className="text-xl" />
          </button>
          Lesson cancellation
        </h2>
        <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px]">
          {t('reason_subtitle', { ns: 'lessons' })}
        </p>
        <div className="flex flex-col gap-y-3 mb-8">
          {cancelReasons.map((reason) => (
            <label
              key={reason}
              className="hover:cursor-pointer border px-4 py-5 pb-4 rounded-lg has-[:checked]:border-color-purple/50 has-[:checked]:bg-color-purple has-[:checked]:bg-opacity-10"
            >
              <CheckboxField
                label={t(reason, { ns: 'lessons' })}
                value={t(reason, { ns: 'lessons' })}
                name="reason"
                type="radio"
                onChange={checkboxEvent}
                checked={t(reason, { ns: 'lessons' }) === cancel?.value}
                dot
              />
            </label>
          ))}
        </div>
        {user?.role === UserRoleType.Mentor &&
          t('reason_7', { ns: 'lessons' }) === cancel?.value && (
            <div>
              <p className="text-color-light-grey text-sm">Reason for cancellation</p>
              <TextareaField
                value={reasonOther}
                onChange={(e) => setReasonOther(e.target.value)}
                placeholder="Please provide a reason"
                className="w-full text-sm min-h-[144px] font-inter"
              />
            </div>
          )}

        {user?.role === UserRoleType.Mentor && (
          <div>
            <p className="text-color-light-grey text-sm">Message for student</p>
            <p className="text-sm text-[#F14E1C]">
              This message will be sent directly to your student.
            </p>
            <TextareaField
              value={messageForStudent}
              onChange={(e) => setMessageForStudent(e.target.value)}
              placeholder="Please write a message for your student. "
              className="w-full text-sm min-h-[144px] font-inter"
            />
          </div>
        )}
        <div className="flex gap-x-8 pt-4 mb-[15px]">
          <Button
            className="h-[56px] w-full"
            theme="destructive"
            disabled={
              !isChecked || loading || (user?.role === UserRoleType.Mentor && !messageForStudent)
            }
            onClick={onCancelLesson}
          >
            {loading ? <ClipLoader loading={loading} size={20} color="white" /> : t('confirm')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CancelLessonModal;
