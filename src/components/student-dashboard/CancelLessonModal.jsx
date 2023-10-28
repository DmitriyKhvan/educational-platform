import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../modules/auth/graphql';
import { useAuth } from '../../modules/auth';
import { Roles, cancellationArr } from '../../constants/global';
import notify from '../../utils/notify';
import Button from '../Form/Button';
import CheckboxField from '../Form/CheckboxField';

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
    if (user && user.role === Roles.MENTOR) {
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
          setCanceledLessons(data.cancelLessons);
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
      <div className="flex flex-col gap-y-1">
        {cancelReasons.map((reason) => (
          <CheckboxField
            key={reason}
            label={reason}
            value={reason}
            name="reason"
            onChange={checkboxEvent}
            checked={reason === cancel.value ? true : false}
          />
        ))}
      </div>
      <div className="flex gap-x-8 pt-4">
        <Button
          disabled={isLoading}
          theme="outline"
          className="h-[38px] px-[10px]"
          onClick={() => setTabIndex(0)}
        >
          {t('back')}
        </Button>
        <Button
          className="h-[38px] px-[10px]"
          disabled={!isChecked || isLoading}
          onClick={onCancelLesson}
        >
          {t('confirm')}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default CancelLessonModal;
