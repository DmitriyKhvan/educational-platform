import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../modules/auth/graphql';
import { useAuth } from '../../modules/auth';
import { ROLES, cancellationArr } from '../../constants/global';
import notify from '../../utils/notify';

const CancelLessonModal = ({
  setTabIndex,
  setIsOpen,
  id,
  fetchAppointments,
  setCanceledLessons,
  repeatLessons,
}) => {
  const [t] = useTranslation('common');
  const [cancel, setCancel] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === ROLES.MENTOR) {
      const cancellationArrMentor = [
        ...cancellationArr.slice(0, 5),
        ...cancellationArr.slice(7),
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

  const onCancelLesson = async () => {
    cancelLesson({
      variables: {
        id: id,
        cancelReason: cancel.value,
        repeat: repeatLessons,
      },
      onCompleted: async (data) => {
        if (setCanceledLessons) {
          // To update lessons in confirm lessons if you cancel lessons from the confirm lessons page
          setCanceledLessons(data.cancelLesson);
        } else {
          // To update lessons in the calendar if you cancel lessons from the calendar
          await fetchAppointments();
        }

        setIsOpen(false);
        notify('Your lesson has been cancelled successfully');
      },
      onError: (error) => {
        setIsOpen(false);
        notify(error.message, 'error');
      },
    });
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">
          <h2>Cancelling Lesson</h2>
        </div>
      </div>
      <p className="welcome-subtitle mb-4">
        Why are you cancelling this lesson?
      </p>
      {cancelReasons.map((x) => (
        <div className="flex mt-0.5 items-center" key={x}>
          <input
            className="form-check-input"
            type="checkbox"
            id={x}
            value={x}
            onChange={checkboxEvent}
            checked={x === cancel.value ? true : false}
          />
          <label className="form-check-label" htmlFor={x}>
            {x}
          </label>
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <button
          disabled={isLoading}
          className="enter-btn grey-border ms-0"
          onClick={() => setTabIndex(0)}
        >
          {t('back')}
        </button>
        <button
          className="enter-btn bg-pink text-white"
          disabled={!isChecked || isLoading}
          onClick={onCancelLesson}
        >
          {t('confirm')}
        </button>
      </div>
    </React.Fragment>
  );
};

export default CancelLessonModal;
