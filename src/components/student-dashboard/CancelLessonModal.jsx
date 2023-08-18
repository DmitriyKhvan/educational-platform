import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../modules/auth/graphql';
import NotificationManager from '../NotificationManager';
import { useAuth } from '../../modules/auth';
import { ROLES, cancellationArr } from '../../constants/global';
import toast from 'react-hot-toast';

const CancelLessonModal = ({
  setTabIndex,
  setIsOpen,
  id,
  fetchAppointments,
  cancelled,
}) => {
  const [t] = useTranslation('common');
  const [cancel, setCancel] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const [cancelLesson] = useMutation(CANCEL_APPOINTMENT, {
    variables: {
      id: id,
      cancelReason: cancel.value,
    },
    onError: (error) => {
      NotificationManager.error(error.message, t);
    },
    onCompleted: () => {
      toast.success('Your lesson has been cancelled successfully');
    },
  });

  const onCancelLesson = async () => {
    setIsLoading(true);
    const { errors } = await cancelLesson();
    setIsLoading(false);
    if (cancelled) {
      cancelled();
    }
    if (errors?.length == 0 || !errors) {
      await fetchAppointments();
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">
          <h2>Cancelling Lesson</h2>
        </div>
        <div className="col-auto text-end pt-2 ps-5">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          ></button>
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
