import { useAuth } from '@/app/providers/auth-provider';
import { MAX_MODIFY_COUNT, ModalType } from '@/shared/constants/global';
import { isWithinHours } from '@/shared/utils/is-within-hours';
import type { Lesson } from '@/types/types.generated';
import { format, toZonedTime } from 'date-fns-tz';
import { Trans, useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { WarningMessage } from './warning-message';

interface CancelWarningModalProps {
  data: Lesson;
  type: ModalType;
  modifyCredits: number;
}

export const StrikeStudent: React.FC<CancelWarningModalProps> = ({ data, type, modifyCredits }) => {
  const [t] = useTranslation('modals');
  const { user } = useAuth();

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isWithin24Hours = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: 24,
    userTimezone,
  });

  const warningMessage =
    type === ModalType.CANCEL && isWithin24Hours ? (
      <>
        {t('cancel_modal_desc3')}
        {t('cancel_modal_desc2')}
      </>
    ) : type === ModalType.CANCEL && !isWithin24Hours ? (
      t('cancel_modal_desc4')
    ) : type === ModalType.RESCHEDULE && isWithin24Hours ? (
      <>You cannot reschedule within 24 hours.</>
    ) : null;

  return (
    <>
      <p className="text-base text-center mb-4">
        <Trans
          t={t}
          i18nKey="are_you_sure_reschedule_cancel"
          values={{
            cancelReschedule:
              type === ModalType.CANCEL
                ? t('swal_cancel_Button_Text').toLowerCase()
                : t('reschedule').toLowerCase(),
            date: format(
              toZonedTime(new Date(data?.startAt ?? new Date()), userTimezone),
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
        {(type === ModalType.CANCEL || isWithin24Hours) && (
          <WarningMessage warningMessage={warningMessage} />
        )}

        <div className="w-full p-4 flex items-center justify-between mt-5 rounded-lg bg-color-purple bg-opacity-20">
          <div>
            <Trans
              t={t}
              i18nKey="n_cancelations_left"
              values={{
                count: modifyCredits,
              }}
              components={{
                primary: <p className="font-semibold text-[15px] text-color-purple" />,
                secondary: <span className="text-[14px] text-color-purple" />,
              }}
            />
          </div>

          <div className="flex">
            {[...Array(MAX_MODIFY_COUNT - modifyCredits)].map((_, idx) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                className="w-7 h-7 mr-[6px] flex justify-center items-center rounded-[4px] bg-color-red"
              >
                <FaXmark className="text-white" />
              </span>
            ))}
            {[...Array(modifyCredits)].map((_, idx) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={idx}
                className="w-7 h-7 mr-[6px] rounded-[4px] bg-color-purple bg-opacity-30"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
