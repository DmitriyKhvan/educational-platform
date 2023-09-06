import React from 'react';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { useTranslation } from 'react-i18next';

const ZoomWarningModal = ({ isWarningOpen, closeModal }) => {
  const [t] = useTranslation('modals');
  return (
    <ModalWrapper isOpen={isWarningOpen} closeModal={closeModal}>
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold">{t('zoom_modal_title')}</h2>
          </div>
        </div>
        <div className="w-full text-center text-lg">{t('zoom_modal_desc')}</div>
      </div>
    </ModalWrapper>
  );
};

export default ZoomWarningModal;
