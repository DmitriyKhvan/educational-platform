import React from 'react';
import ModalWrapper from '../ModalWrapper';
import { useTranslation } from 'react-i18next';

const ZoomWarningModal = ({ isWarningOpen, closeModal, setIsWarningOpen }) => {
  const [t] = useTranslation('modals');
  return (
    <ModalWrapper isOpen={isWarningOpen} closeModal={closeModal}>
      <div className="container">
        <div className="row">
          <div className="col-10 ps-2">
            <h2>{t('zoom_modal_title')}</h2>
          </div>
          <div className="col-auto text-end pt-2 ps-4">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsWarningOpen(false)}
            ></button>
          </div>
        </div>
        <div style={{ width: '20rem' }}></div>
        <p className="welcome-subtitle">{t('zoom_modal_desc')}</p>
      </div>
    </ModalWrapper>
  );
};

export default ZoomWarningModal;
