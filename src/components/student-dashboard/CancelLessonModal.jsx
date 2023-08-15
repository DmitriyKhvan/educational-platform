import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../modules/auth/graphql';
import NotificationManager from '../NotificationManager';

const CancelLessonModal = ({
  setTabIndex,
  setIsOpen,
  id,
  fetchAppointments,
}) => {
  const [t] = useTranslation('common');
  const [cancel, setCancel] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cancellationArr = [
    'Need to reschedule the lesson',
    'Not prepared for the lesson',
    'Urgent personal matter',
    'Technical or internet connection issues',
    'Health related matter',
    'Tutor has not confirmed the lesson',
    'I do not like the matched tutor',
    'Other',
  ];

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
  });

  const onCancelLesson = async () => {
    setIsLoading(true);
    const { errors } = await cancelLesson();
    setIsLoading(false)
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
      {cancellationArr.map((x) => (
        <div className='flex mt-0.5 items-center' key={x}>
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
