import React, {useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MAX_MODIFY_COUNT = 3;

const CancelWarningModal = ({ setTabIndex, setIsOpen, type, modifyCredits }) => {
  const [t] = useTranslation('modals');

  const [isChecked, setIsChecked] = useState(false);
  const [cancellationDots, setCancellationDots] = useState([])
  
  useEffect(() => {
    if(modifyCredits !== undefined) {
      const cancellationDots = [];
      for (let i = 0; i < MAX_MODIFY_COUNT; i++) {
        if (i < modifyCredits) {
          cancellationDots.push(<span className="dot dot-filled" key={i}></span>);
        } else {
          cancellationDots.push(<span className="dot dot-unfilled" key={i}></span>);
        }
      }
      setCancellationDots(cancellationDots);
    }
  }, [modifyCredits])


  const checkboxEvent = () => {
    setIsChecked(!isChecked);
  };

  const onClick = () => {
    if (type === 'reschedule-time') {
      setTabIndex(2);
    }
    
    if (type === 'cancel') {
      setTabIndex(1);
    }
  };

  return (
    <div>
        <div className="flex justify-between mb-2">
          <div className="text-lg font-semibold">
            {t('warning')}
          </div>
          <div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
        </div>
        <div className="text-center">{t('cancel_modal_desc')}</div>
        <div className='w-full flex items-center justify-center mt-3'>
          {cancellationDots}
        </div>
        <div className="form-check pt-3 flex items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="cancel"
            value="cancel"
            onChange={checkboxEvent}
            checked={isChecked}
          />
          <label className="form-check-label" htmlFor="cancel">
            {t('confirm_cancel')}
          </label>
        </div>

        <div className="row pt-4">
          <div className="col-auto">
            <button
              className="enter-btn grey-border"
              onClick={() => setTabIndex(10)}
            >
              {t('review_cancellation_policy')}
            </button>
          </div>
          <div className="col-auto">
            <button
              className="enter-btn bg-pink text-white"
              onClick={onClick}
              disabled={!isChecked && modifyCredits && modifyCredits > 0}
            >
              {t('continue_cancel')}
            </button>
          </div>
        </div>
    </div>
  );
};

export default CancelWarningModal;
