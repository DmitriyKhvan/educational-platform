import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../modules/auth';
import { MAX_MODIFY_COUNT, Roles } from '../../constants/global';
import CheckboxField from '../Form/CheckboxField';
import { FaXmark } from 'react-icons/fa6';
import Button from '../Form/Button/Button';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { isWithinHours } from 'src/utils/isWithinHours';

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

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [cancellationDots, setCancellationDots] = useState([]);
  const [cancellationCount, setCancellationCount] = useState(MAX_MODIFY_COUNT);

  const isLate = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: 24,
    userTimezone,
  });

  useEffect(() => {
    if (modifyCredits !== undefined) {
      const cancellationDots = [];
      for (let i = 0; i < MAX_MODIFY_COUNT; i++) {
        if (i < modifyCredits) {
          cancellationDots.unshift(
            <span
              className="w-7 h-7 mr-[6px] rounded-[4px] bg-color-purple bg-opacity-30"
              key={i}
            ></span>,
          );
        } else {
          setCancellationCount((v) => v - 1);
          cancellationDots.unshift(
            <span
              className="w-7 h-7 mr-[6px] flex justify-center items-center rounded-[4px] bg-color-red"
              key={i}
            >
              <FaXmark className="text-white" />
            </span>,
          );
        }
      }
      setCancellationDots(cancellationDots);
    }
  }, [modifyCredits]);

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

  const disableCancelLesson =
    user.role === Roles.MENTOR || modifyCredits !== 0 ? false : true;
  return (
    <div className="max-w-[400px] w-full mx-auto py-[15px] px-[12px]">
      <div className="mb-5 text-2xl font-bold text-center">
        {type === 'cancel' ? t('cancel_lesson') : t('reschedule_lesson')}
      </div>
      <p className="text-base text-center mb-4">
        Are you sure want to {type === 'cancel' ? 'cancel' : 'recshedule'}
        <br />
        <span className="font-semibold">
          {format(
            utcToZonedTime(new Date(data?.startAt ?? new Date()), userTimezone),
            'eee, MMM do',
            { timeZone: userTimezone },
          )}
        </span>{' '}
        lesson?
      </p>
      {user.role !== Roles.MENTOR && (
        <div className="space-y-3">
          {(type === 'cancel' || isLate) && (
            <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
              <span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
                !
              </span>
              {type === 'cancel' ? (
                <div className="max-w-[300px] space-y-3">
                  <p className="font-semibold">{t('cancel_modal_desc3')}</p>

                  <p className="font-semibold">{t('cancel_modal_desc2')}</p>
                </div>
              ) : (
                <div className="font-semibold leading-[18px] tracking-[-0.2px]">
                  You cannot reschedule within 24 hours.
                </div>
              )}
            </div>
          )}

          <div className="w-full p-4 flex items-center justify-between mt-5 rounded-lg bg-color-purple bg-opacity-20">
            <div>
              <p className="font-semibold text-[15px] text-color-purple">
                {cancellationCount}/3 cancellations
              </p>
              <span className="text-[14px] text-color-purple">
                left this month
              </span>
            </div>
            <div className="flex">{cancellationDots}</div>
          </div>
        </div>
      )}

      <Button
        className="h-[56px] px-[10px] w-full mt-6"
        theme="purple"
        onClick={
          disableCancelLesson || (isLate && type === 'reschedule')
            ? undefined
            : onClick
        }
        disabled={disableCancelLesson || (isLate && type === 'reschedule')}
      >
        {t('continue_cancel')}
      </Button>

      <div className="mt-6 flex justify-center">
        <CheckboxField
          label={
            type === 'cancel' ? t('cancel_lessons') : t('reschedule_lessons')
          }
          id="cancel"
          value="cancel"
          onChange={() => setRepeatLessons((v) => !v)}
          checked={repeatLessons}
          disabled={disableCancelLesson}
          name="lesson"
          square
        />
      </div>

      <div className="flex items-center justify-center gap-x-8 mt-4">
        {type !== 'reschedule' && (
          <button
            className="h-[38px] px-[10px] text-color-purple text-sm hover:underline"
            onClick={() => setTabIndex(10)}
          >
            {t('review_cancellation_policy')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CancelWarningModal;
