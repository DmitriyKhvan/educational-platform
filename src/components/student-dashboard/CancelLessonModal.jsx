import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { CANCEL_APPOINTMENT } from '../../modules/auth/graphql';
import { useAuth } from '../../modules/auth';
import { Roles, cancellationArr } from '../../constants/global';
import notify from '../../utils/notify';
import Button from '../Form/Button';
import CheckboxField from '../Form/CheckboxField';
import Loader from '../Loader/Loader';
import { FaChevronLeft } from 'react-icons/fa6';

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
      {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="w-[400px] px-4 flex items-center justify-between mb-2 mt-[15px]">
        <div className="w-full text-lg font-semibold">
          {/* <h2>Cancelling Lesson</h2> */}
          <h2 className="text-[22px] font-bold justify-center relative flex items-center">
            <button
              className="absolute left-0 ms-0"
              onClick={() => setTabIndex(0)}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            Lesson cancellation
          </h2>
        </div>
      </div>
      <p className="welcome-subtitle px-4 mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px]">
        {t('reason_subtitle', { ns: 'lessons' })}
      </p>
      <div className="flex px-4 flex-col gap-y-3">
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
            />
          </label>
        ))}
      </div>
      <div className="flex px-4 gap-x-8 pt-4 mb-[15px]">
        {/* <Button
          disabled={isLoading}
          theme="outline"
          className="h-[38px] px-[10px]"
          onClick={() => setTabIndex(0)}
        >
          {t('back')}
        </Button> */}
        <Button
          className="h-[56px] w-full"
          theme="destructive"
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
