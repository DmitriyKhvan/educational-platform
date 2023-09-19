import React from 'react';
import { useTranslation } from 'react-i18next';

const CancellationPolicyModal = ({ setTabIndex }) => {
  const [t] = useTranslation('modals');
  return (
    <div className="flex flex-col w-[680px]">
      <h2 className="text-lg font-bold mb-5">Cancellation Policy</h2>
      <div className="font-semibold mb-2">{t('cancellation_policy')}</div>
      <div>
        <button
          className="enter-btn grey-border ms-0"
          onClick={() => setTabIndex(0)}
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
};

export default CancellationPolicyModal;
