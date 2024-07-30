import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { WarningMessage } from './WarningMessage';
import { useAuth } from 'src/app/providers/AuthProvider';
import { isWithinHours } from 'src/shared/utils/isWithinHours';
import { format, toZonedTime } from 'date-fns-tz';
import {
  MAX_MODIFY_COUNT,
  ModalType,
  Roles,
} from 'src/shared/constants/global';
import { FaXmark } from 'react-icons/fa6';

export const StrikeStudent = ({ data, type, modifyCredits }) => {
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
          <WarningMessage
            role={Roles.STUDENT}
            isWithin24Hours={isWithin24Hours}
            type={type}
          />
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
                primary: (
                  <p className="font-semibold text-[15px] text-color-purple" />
                ),
                secondary: <span className="text-[14px] text-color-purple" />,
              }}
            />
          </div>

          <div className="flex">
            {[...Array(MAX_MODIFY_COUNT - modifyCredits)].map((_, idx) => (
              <span
                key={idx}
                className="w-7 h-7 mr-[6px] flex justify-center items-center rounded-[4px] bg-color-red"
              >
                <FaXmark className="text-white" />
              </span>
            ))}
            {[...Array(modifyCredits)].map((_, idx) => (
              <span
                key={idx}
                className="w-7 h-7 mr-[6px] rounded-[4px] bg-color-purple bg-opacity-30"
              ></span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
