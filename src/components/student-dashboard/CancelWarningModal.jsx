import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../modules/auth';
import { ROLES } from '../../constants/global';
import CheckboxField from '../Form/CheckboxField';
import { FaXmark } from 'react-icons/fa6';
import Button from '../Form/Button/Button';

const MAX_MODIFY_COUNT = 3;

const CancelWarningModal = ({
  data,
  setTabIndex,
  type,
  modifyCredits,
  setRepeatLessons,
  repeatLessons,
}) => {
  const [t] = useTranslation('modals');
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [cancellationDots, setCancellationDots] = useState([]);

  useEffect(() => {
    if (modifyCredits !== undefined) {
      const cancellationDots = [];
      for (let i = 0; i < MAX_MODIFY_COUNT; i++) {
        if (i < modifyCredits) {
          cancellationDots.unshift(
            <span
              className="w-5 h-5 mr-[6px] rounded-full border-2 border-solid border-color-purple"
              key={i}
            ></span>,
          );
        } else {
          cancellationDots.unshift(
            <span
              className="flex items-center justify-center w-5 h-5 mr-[6px] bg-color-light-purple rounded-full border border-color-purple"
              key={i}
            >
              <FaXmark className="text-color-purple" />
            </span>,
          );
        }
      }
      setCancellationDots(cancellationDots);
    }
  }, [modifyCredits]);

  const checkboxEvent = () => {
    setIsChecked(!isChecked);
  };

  const onClick = () => {
    if (type === 'reschedule') {
      //We need exactly window.location, so that the page with this id is reloaded
      window.location.replace(
        `/student/schedule-lesson/select/${data.id}/?repeatLessons=${repeatLessons}`,
      );
    }

    if (type === 'reschedule-time') {
      setTabIndex(2);
    }

    if (type === 'cancel') {
      setTabIndex(1);
    }
  };

  return (
    <div className="w-[360px]">
      <div className="mb-5 text-xl font-semibold">{t('warning')}</div>
      <div className="font-semibold leading-[18px] tracking-[-0.2px]">
        {user.role !== ROLES.MENTOR ? t('cancel_modal_desc') : null}
      </div>
      {user.role !== ROLES.MENTOR && (
        <div className="w-full flex items-center justify-center mt-5">
          {cancellationDots}
        </div>
      )}

      {type !== 'reschedule' && (
        <div className="mt-8">
          <CheckboxField
            label={t('confirm_cancel')}
            id="cancel"
            value="cancel"
            onChange={checkboxEvent}
            checked={isChecked}
            disabled={user.role !== ROLES.MENTOR && modifyCredits === 0}
          />
        </div>
      )}

      <div className="mt-8">
        <p className="font-semibold leading-[18px] tracking-[-0.2px] mb-3">
          Choose Below:
        </p>
        <div className="flex flex-col gap-y-1">
          <CheckboxField
            label={
              type === 'cancel'
                ? t('cancel_this_lesson')
                : t('reschedule_this_lesson')
            }
            type="radio"
            name="lesson"
            onChange={() => setRepeatLessons(false)}
            disabled={modifyCredits === 0}
          />
          <CheckboxField
            label={
              type === 'cancel' ? t('cancel_lessons') : t('reschedule_lessons')
            }
            type="radio"
            name="lesson"
            onChange={() => setRepeatLessons(true)}
            disabled={modifyCredits === 0}
          />
        </div>
      </div>

      <div className="flex items-center gap-x-8 mt-4">
        {type !== 'reschedule' && (
          <Button theme="outline" onClick={() => setTabIndex(10)}>
            {t('review_cancellation_policy')}
          </Button>
        )}

        <Button
          theme="purple"
          onClick={onClick}
          disabled={
            (!isChecked && type !== 'reschedule') || modifyCredits === 0
          }
        >
          {t('continue_cancel')}
        </Button>
      </div>
    </div>
  );
};

export default CancelWarningModal;
