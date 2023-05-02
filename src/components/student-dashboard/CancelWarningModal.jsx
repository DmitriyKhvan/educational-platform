/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getPlanStatus } from '../../actions/subscription';

const CancelWarningModal = ({ setTabIndex, setIsOpen, duration, type }) => {
  const [t] = useTranslation('modals');
  const dispatch = useDispatch();
  const [planLength, setPlanLength] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(async () => {
    const { payload } = await dispatch(getPlanStatus());
    const [{ plan_start, plan_end }] = payload.results.filter(
      (x) => parseInt(x.duration, 10) === duration,
    );
    const diff = Math.round(
      (moment(plan_end).unix() - moment(plan_start).unix()) / 2592000,
    );
    setPlanLength(diff);
  }, []);

  const cancellationDots = [];
  for (let i = 0; i < planLength; i++) {
    if (i <= planLength) {
      cancellationDots.push(<span className="dot dot-filled" key={i}></span>);
    } else {
      cancellationDots.push(<span className="dot dot-unfilled" key={i}></span>);
    }
  }

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
    <div className="row">
      <div className="col-auto">
        <div className="row">
          <div className="col-11 ps-2">
            <h2>{t('warning')}</h2>
          </div>
          <div className="col-auto text-end pt-2 ps-4">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
        </div>
        <p className="welcome-subtitle">{t('cancel_modal_desc')}</p>
        {cancellationDots}
        <div className="form-check pt-3">
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
              disabled={!isChecked}
            >
              {t('continue_cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelWarningModal;
