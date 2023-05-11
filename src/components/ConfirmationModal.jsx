import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

const ConfirmationModal = ({ visible, onSuccess, onCancel, description }) => {
  const [t] = useTranslation('common');

  return (
    <Modal visible={visible} className="confirmation-modal" onCancel={onCancel}>
      <div className="title">{t('confirm')}</div>
      <div className="description">{t(description)}</div>

      <div className="flex align-items-center justify-content-right actions">
        {onSuccess && (
          <div className="btn" onClick={onSuccess}>
            {t('yes')}
          </div>
        )}
        {onCancel && (
          <div className="btn" onClick={onCancel}>
            {t('no')}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
