import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalType, Roles } from 'src/shared/constants/global';

export const WarningMessage = ({ role, isWithin24Hours, type }) => {
  const [t] = useTranslation('modals');
  return (
    <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
      <span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
        !
      </span>
      <div className="max-w-[300px] space-y-3 font-medium text-color-dark-purple leading-5">
        <p>
          {role === Roles.MENTOR &&
            (isWithin24Hours
              ? 'You will be fined $5 for this 25 min lesson'
              : 'After 6 cancellations, you will be fined for each additional cancellation.')}

          {role === Roles.STUDENT &&
            type === ModalType.CANCEL &&
            (isWithin24Hours ? (
              <>
                {t('cancel_modal_desc3')}
                {t('cancel_modal_desc2')}
              </>
            ) : (
              t('cancel_modal_desc4')
            ))}

          {type === ModalType.RESCHEDULE && isWithin24Hours && (
            <>You cannot reschedule within 24 hours.</>
          )}
        </p>
      </div>
    </div>
  );
};
