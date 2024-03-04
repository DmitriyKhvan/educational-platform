import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../modules/auth';
import { MAX_MODIFY_COUNT, Roles } from '../../constants/global';
import CheckboxField from '../Form/CheckboxField';
import { FaXmark } from 'react-icons/fa6';
import Button from '../Form/Button/Button';
import { differenceInHours, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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
  const [cancellationCount, setCancellationCount] = useState(3);

  const isLate =
    differenceInHours(
      utcToZonedTime(new Date(data.startAt), userTimezone),
      utcToZonedTime(new Date(), userTimezone),
    ) <= 24;

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
  console.log(data);
  return (
    <div className="max-w-[400px] w-full py-[15px] px-[12px]">
      {/* <div className="mb-5 text-2xl font-bold text-center">
        {t('cancel_lesson')}
      </div>
      <p className="text-base text-center mb-4">
        Are you sure want to cancel
        <br />
        <span className="font-semibold">
          {format(
            utcToZonedTime(new Date(data.startAt), userTimezone),
            'eee, MMM do',
            { timeZone: userTimezone },
          )}
        </span>{' '}
        lesson?
      </p> */}
      {user.role !== Roles.MENTOR && (
        <div className="space-y-3">
          {type === 'cancel' ? (
            <>
              <div className="mb-5 text-2xl font-bold text-center">
                {t('cancel_lesson')}
              </div>
              <p className="text-base text-center mb-4">
                Are you sure want to cancel
                <br />
                <span className="font-semibold">
                  {format(
                    utcToZonedTime(new Date(data.startAt), userTimezone),
                    'eee, MMM do',
                    { timeZone: userTimezone },
                  )}
                </span>{' '}
                lesson?
              </p>
              <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
                <span className="bg-color-red w-6 h-6 rounded-full text-center text-white mr-4 text-base">
                  !
                </span>
                <p className="font-semibold">
                  Cancelling within 24 hours forfeits your credit.
                </p>
              </div>
            </>
          ) : (
            // isLate ? (
            //   <>
            //     <div className="font-semibold leading-[18px] tracking-[-0.2px]">
            //       {t('cancel_modal_desc3')}
            //     </div>

            //     <div className="font-semibold leading-[18px] tracking-[-0.2px]">
            //       {t('cancel_modal_desc2')}
            //     </div>
            //   </>
            // ) : (
            //   <div className="font-semibold leading-[18px] tracking-[-0.2px]">
            //     {t('cancel_modal_desc4')}
            //   </div>
            // )
            isLate && (
              <div className="font-semibold leading-[18px] tracking-[-0.2px]">
                You cannot reschedule within 24 hours.
              </div>
            )
          )}

          {/* <div className="font-semibold leading-[18px] tracking-[-0.2px]">
            {t('cancel_modal_desc')}
          </div> */}

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

      {/* {type === 'cancel' && (
        <div className="mt-8">
          <CheckboxField
            label={t('confirm_cancel')}
            id="cancel"
            value="cancel"
            onChange={checkboxEvent}
            checked={isChecked}
            disabled={disableCancelLesson}
          />
        </div>
      )} */}

      <Button
        className="h-[56px] px-[10px] w-full mt-6"
        theme="purple"
        onClick={
          disableCancelLesson || (isLate && type === 'reschedule')
            ? undefined
            : onClick
        }
        disabled={
          // (!isChecked && type === 'cancel') ||
          disableCancelLesson || (isLate && type === 'reschedule')
        }
      >
        {t('continue_cancel')}
      </Button>

      <div className="mt-6 flex justify-center">
        {/* <p className="font-semibold leading-[18px] tracking-[-0.2px] mb-3">
          Choose Below:
        </p> */}
        {/* <div className="flex flex-col gap-y-1"> */}
        {/* <CheckboxField
            label={
              type === 'cancel'
                ? t('cancel_this_lesson')
                : t('reschedule_this_lesson')
            }
            type="radio"
            name="lesson"
            onChange={() => setRepeatLessons(false)}
            disabled={disableCancelLesson}
          /> */}
        <CheckboxField
          label={
            type === 'cancel' ? t('cancel_lessons') : t('reschedule_lessons')
          }
          // type="radio"

          id="cancel"
          value="cancel"
          onChange={() => setRepeatLessons((v) => !v)}
          checked={repeatLessons}
          disabled={disableCancelLesson}
          name="lesson"
          square
          // onChange={() => setRepeatLessons(true)}
          // disabled={disableCancelLesson}
        />

        {/* </div> */}
      </div>

      <div className="flex items-center justify-center gap-x-8 mt-4">
        {type !== 'reschedule' && (
          <button
            className="h-[38px] px-[10px] text-color-purple text-sm hover:underline"
            // theme="outline"
            onClick={() => setTabIndex(10)}
          >
            {t('review_cancellation_policy')}
          </button>
        )}

        {/* <Button
          className="h-[38px] px-[10px]"
          theme="purple"
          onClick={
            disableCancelLesson || (isLate && type === 'reschedule')
              ? undefined
              : onClick
          }
          disabled={
            // (!isChecked && type === 'cancel') ||
            disableCancelLesson || (isLate && type === 'reschedule')
          }
        >
          {t('continue_cancel')}
        </Button> */}
      </div>
    </div>
  );
};

export default CancelWarningModal;
