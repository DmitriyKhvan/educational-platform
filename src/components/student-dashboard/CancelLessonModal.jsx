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
    const { errors } = await cancelLesson();
    if (errors?.length == 0 || !errors) {
      await fetchAppointments();
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-auto">
          <div className="row">
            <div className="col-auto ps-2 pe-5">
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
            <div className="form-check pt-1" key={x}>
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
        </div>
      </div>
      <div className="row pt-4">
        <div className="col-auto">
          <button
            className="enter-btn grey-border ms-0"
            onClick={() => setTabIndex(0)}
          >
            {t('back')}
          </button>
        </div>
        <div className="col-auto">
          <button
            className="enter-btn bg-pink text-white"
            disabled={!isChecked}
            onClick={onCancelLesson}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CancelLessonModal;
