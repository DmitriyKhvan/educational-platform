import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../shared/apollo/graphql';
import { useAuth } from 'src/app/providers/AuthProvider';
import { Roles, cancellationArr } from '../../shared/constants/global';
import notify from '../../shared/utils/notify';
import Button from '../Form/Button';
import CheckboxField from '../Form/CheckboxField';
import Loader from '../Loader/Loader';
import { FaChevronLeft } from 'react-icons/fa6';
import { TextareaField } from '../Form/TextareaField';
import { MENTOR_CANCEL_APPOINTMENT } from 'src/shared/apollo/mutations/lessons/mentorCancelLessons';

const CancelLessonModal = ({
  setTabIndex,
  setIsOpen,
  id,
  fetchAppointments,
  setCanceledLessons,
  repeatLessons,
}) => {
  const [t] = useTranslation(['common', 'lessons']);
  const [cancel, setCancel] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [reasonOther, setReasonOther] = useState('');
  const [messageForStudent, setMessageForStudent] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === Roles.MENTOR) {
      const cancellationArrMentor = [
        ...cancellationArr.slice(0, 5),
        ...cancellationArr.slice(6),
      ];
      setCancelReasons(cancellationArrMentor);
    } else {
      setCancelReasons(cancellationArr);
    }
  }, [user]);

  const checkboxEvent = ({ target }) => {
    const { value } = target;
    if (value === cancel.value) {
      setCancel({});
      setIsChecked(false);
    } else {
      setCancel({ value });
      setIsChecked(true);
    }
  };

  const [cancelLesson, { loading: isLoading }] =
    useMutation(CANCEL_APPOINTMENT);
  const [mentorCancelLesson, { loading: isLoadingMentor }] = useMutation(
    MENTOR_CANCEL_APPOINTMENT,
  );

  const onCancelCompleted = (data) => {
    setIsOpen(false);

    if (setCanceledLessons) {
      // To update lessons in confirm lessons if you cancel lessons from the confirm lessons page
      setCanceledLessons(data.cancelLessons);
    } else {
      // To update lessons in the calendar if you cancel lessons from the calendar
      fetchAppointments();
    }
    notify('Your lesson has been cancelled successfully');
  };

  const onCancelLesson = () => {
    if (user?.role === Roles.STUDENT) {
      cancelLesson({
        variables: {
          id: id,
          cancelReason: cancel.value,
          repeat: repeatLessons,
        },
        onCompleted: onCancelCompleted,
        onError: (error) => {
          notify(error.message, 'error');
        },
      });
    } else {
      mentorCancelLesson({
        variables: {
          id: id,
          studentMessage: messageForStudent,
          cancelReason:
            cancel.value === t('reason_7', { ns: 'lessons' })
              ? reasonOther
              : cancel.value,
        },
        onCompleted: onCancelCompleted,
        onError: (error) => {
          notify(error.message, 'error');
        },
      });
    }
  };

  return (
    <div className="max-w-[416px] w-full sm:w-[416px] mx-auto">
      {isLoading ||
        (isLoadingMentor && (
          <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
            <Loader />
          </div>
        ))}

      <h2 className="text-[22px] font-bold justify-center relative flex items-center">
        <button className="absolute left-0 ms-0" onClick={() => setTabIndex(0)}>
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
              checked={
                t(reason, { ns: 'lessons' }) === cancel.value ? true : false
              }
              dot
            />
          </label>
        ))}
      </div>
      {user?.role === Roles.MENTOR &&
        t('reason_7', { ns: 'lessons' }) === cancel.value && (
          <div>
            <p className="text-color-light-grey text-sm">
              Reason for cancellation
            </p>
            <TextareaField
              value={reasonOther}
              onChange={(e) => setReasonOther(e.target.value)}
              placeholder="Please provide a reason"
              className="w-full text-sm min-h-[144px] font-inter"
            />
          </div>
        )}

      {user?.role === Roles.MENTOR && (
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
            !isChecked ||
            isLoading ||
            (user?.role === Roles.MENTOR && !messageForStudent)
          }
          onClick={onCancelLesson}
        >
          {t('confirm')}
        </Button>
      </div>
    </div>
  );
};

export default CancelLessonModal;
