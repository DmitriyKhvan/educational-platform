import React from 'react';
import { useTranslation } from 'react-i18next';

const PlaygroundWarningModal = () => {
  const [t] = useTranslation('modals');
  return (
    <div className="text-center space-y-3">
      <h2 className="text-2xl font-semibold ">{t('playground_modal_title')}</h2>
      <p className="text-lg">{t('playground_modal_desc')}</p>
    </div>
  );
};

export default PlaygroundWarningModal;
