import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/app/providers/AuthProvider';
import { ModalType } from '../../../shared/constants/global';
import CheckboxField from '../../../components/Form/CheckboxField';
import Button from '../../../components/Form/Button/Button';
import { isWithinHours } from 'src/shared/utils/isWithinHours';

import { StrikeStudent } from './StrikeStudent';

const StudentCancelWarningModal = ({
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

  const isWithin24Hours = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: 24,
    userTimezone,
  });

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

  return (
    <div className="w-full max-w-[416px] mx-auto">
      <div className="mb-5 text-2xl font-bold text-center">
        {type === ModalType.CANCEL
          ? t('cancel_lesson')
          : t('reschedule_lesson')}
      </div>

      <StrikeStudent data={data} type={type} modifyCredits={modifyCredits} />

      <Button
        className="h-[56px] px-[10px] w-full mt-6"
        theme="purple"
        onClick={
          modifyCredits === 0 ||
          (isWithin24Hours && type === ModalType.RESCHEDULE)
            ? undefined
            : onClick
        }
        disabled={
          modifyCredits === 0 ||
          (isWithin24Hours && type === ModalType.RESCHEDULE)
        }
      >
        {t('continue_cancel')}
      </Button>

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
          disabled={modifyCredits === 0}
          name="lesson"
          square
        />
      </div>

      <div className="flex items-center justify-center gap-x-8 mt-4">
        {type === ModalType.CANCEL && (
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

export default StudentCancelWarningModal;
