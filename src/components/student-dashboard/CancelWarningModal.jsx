import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from 'src/app/providers/AuthProvider';
import {
  HOURS_IN_WEEK,
  MAX_MODIFY_COUNT,
  ModalType,
  Roles,
} from '../../shared/constants/global';
import CheckboxField from '../Form/CheckboxField';
import { FaXmark } from 'react-icons/fa6';
import Button from '../Form/Button/Button';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { isWithinHours } from 'src/shared/utils/isWithinHours';
import { useQuery } from '@apollo/client';
import { MENTOR_CONTRACT } from 'src/shared/apollo/queries/contract/mentorContract';

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

  const { data: contractData } = useQuery(MENTOR_CONTRACT, {
    fetchPolicy: 'network-only',
    skip: user?.role !== Roles.MENTOR,
  });

  const isLate = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: 24,
    userTimezone,
  });

  const isWithinTwoWeeks = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: HOURS_IN_WEEK * 2,
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

    if (type === 'cancel') {
      setTabIndex(1);
    }
  };

  const disableCancelLesson =
    user.role === Roles.MENTOR || modifyCredits !== 0 ? false : true;

  const penaltiesCount = contractData?.mentorContract?.penalties?.length ?? 0;

  return (
    <div className="w-full max-w-[416px] mx-auto">
      <div className="mb-5 text-2xl font-bold text-center">
        {type === ModalType.CANCEL
          ? t('cancel_lesson')
          : t('reschedule_lesson')}
      </div>

      {/* ======================= Mentor ==================== */}
      {user.role === Roles.MENTOR && (
        <>
          <p className="text-[#464752] text-[15px] text-center mb-4">
            {isWithinTwoWeeks
              ? isLate
                ? 'Warning you are cancelling a lesson within 24 hours.'
                : 'Warning you are cancelling a lesson outside of 24 hours but within 2 weeks.'
              : 'Are you sure you want to cancel this lesson more than two weeks in advance?'}
          </p>
          {isWithinTwoWeeks && (
            <>
              <p className="text-[#464752] text-[15px] text-center font-semibold mb-4">
                1 day of classes equals 1 strike
              </p>

              <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
                <span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
                  !
                </span>
                <div className="max-w-[300px] space-y-3 font-medium text-color-dark-purple leading-5">
                  <p>
                    {user?.role === Roles.MENTOR
                      ? isLate
                        ? 'You will be fined $5 for this 25 min lesson'
                        : 'After 6 cancellations, you will be fined for each additional cancellation.'
                      : 'You cannot reschedule within 24 hours.'}
                  </p>
                </div>
              </div>

              <div className="w-full p-4 mt-5 rounded-lg bg-color-purple bg-opacity-20">
                <p className="block text-[15px] font-semibold text-color-purple">
                  {penaltiesCount}/6 cancellations
                </p>
                <p className="block text-sm text-color-purple mb-4">
                  {format(
                    contractData?.mentorContract?.startDate ?? new Date(),
                    'MM-dd-yyyy',
                  )}{' '}
                  to{' '}
                  {format(
                    contractData?.mentorContract?.endDate ?? new Date(),
                    'MM-dd-yyyy',
                  )}{' '}
                  (6 month contract)
                </p>
                <div className="flex gap-3 justify-between">
                  {contractData?.mentorContract?.penalties
                    ?.slice(0, 6)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="w-[50px] h-[50px] text-xs bg-[#F14E1C] rounded-[4px] text-white flex flex-col justify-center items-center gap-1"
                      >
                        <FaXmark />
                        <p>{format(p?.createdAt ?? new Date(), 'MMM dd')}</p>
                      </div>
                    ))}
                  {contractData?.mentorContract?.penalties &&
                    [...Array(penaltiesCount > 6 ? 0 : 6 - penaltiesCount)].map(
                      (_, idx) => (
                        <div
                          key={idx}
                          className="w-[50px] h-[50px] bg-color-purple bg-opacity-30 rounded-[4px]"
                        ></div>
                      ),
                    )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ====================================================== */}

      {/* ======================= Student ==================== */}
      {user.role === Roles.STUDENT && (
        <>
          <p className="text-base text-center mb-4">
            <Trans
              t={t}
              i18nKey="are_you_sure_reschedule_cancel"
              values={{
                cancelReschedule:
                  type === 'cancel'
                    ? t('swal_cancel_Button_Text').toLowerCase()
                    : t('reschedule').toLowerCase(),
                date: format(
                  toZonedTime(
                    new Date(data?.startAt ?? new Date()),
                    userTimezone,
                  ),
                  'eee, MMM do',
                  { timeZone: userTimezone },
                ),
              }}
              components={{
                strong: <span className="font-semibold" />,
              }}
            />
          </p>
          <div className="space-y-3">
            {(type === ModalType.CANCEL || isLate) && (
              <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
                <span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
                  !
                </span>
                <div className="max-w-[300px] space-y-3 font-medium text-color-dark-purple leading-5">
                  {type === 'cancel' ? (
                    isLate ? (
                      <>
                        <p>{t('cancel_modal_desc3')}</p>
                        <p>{t('cancel_modal_desc2')}</p>
                      </>
                    ) : (
                      <p>{t('cancel_modal_desc4')}</p>
                    )
                  ) : (
                    <p>You cannot reschedule within 24 hours.</p>
                  )}
                </div>
              </div>
            )}

            <div className="w-full p-4 flex items-center justify-between mt-5 rounded-lg bg-color-purple bg-opacity-20">
              <div>
                <Trans
                  t={t}
                  i18nKey="n_cancelations_left"
                  values={{
                    count: cancellationCount,
                  }}
                  components={{
                    primary: (
                      <p className="font-semibold text-[15px] text-color-purple" />
                    ),
                    secondary: (
                      <span className="text-[14px] text-color-purple" />
                    ),
                  }}
                />
              </div>
              <div className="flex">{cancellationDots}</div>
            </div>
          </div>
        </>
      )}
      {/* ====================================================== */}

      <Button
        className="h-[56px] px-[10px] w-full mt-6"
        theme="purple"
        onClick={
          disableCancelLesson || (isLate && type === ModalType.RESCHEDULE)
            ? undefined
            : onClick
        }
        disabled={
          disableCancelLesson || (isLate && type === ModalType.RESCHEDULE)
        }
      >
        {t('continue_cancel')}
      </Button>

      {user.role === Roles.STUDENT && (
        <div className="mt-6 flex justify-center">
          <CheckboxField
            label={
              type === ModalType.CANCEL
                ? t('cancel_lessons')
                : t('reschedule_lessons')
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
      )}

      <div className="flex items-center justify-center gap-x-8 mt-4">
        {type !== ModalType.RESCHEDULE && (
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
