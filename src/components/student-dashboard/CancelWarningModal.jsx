import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { PACKAGE_QUERY } from '../../modules/auth/graphql';
import { useAuth } from '../../modules/auth';

const CancelWarningModal = ({ setTabIndex, setIsOpen, duration, type }) => {
  const { user } = useAuth();
  const [t] = useTranslation('modals');
  const { data: payload } = useQuery(PACKAGE_QUERY, {
    variables: {
      userId: user.id,
    },
  });
  const [planLength, setPlanLength] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (payload && payload.results) {
      const [{ periodStart, periodEnd }] = payload.results.filter(
        (x) => parseInt(x.package.period, 10) === duration,
      );
      const diff = Math.round(
        (moment(periodStart).unix() - moment(periodEnd).unix()) / 2592000,
      );
      setPlanLength(diff);
    }
  }, [payload]);

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
        {cancellationDots}
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
              disabled={!isChecked}
            >
              {t('continue_cancel')}
            </button>
          </div>
        </div>
    </div>
  );
};

export default CancelWarningModal;
