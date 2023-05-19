import React from 'react';
import { useTranslation } from 'react-i18next';

const ScheduleCard = ({ startTime, endTime, date }) => {
  const [t] = useTranslation('common');

  return (
    <div
      className={`schedule_change_padd time-card schedule-lesson-border bg-white small-card pt-2 mt-1 schedule-lesson-border-widths`}
    >
      <div className="row alignmobile">
        <div className="col-auto schedule_card_aligns">
          <h3 className={`inside-align-title-time ms-3`}>
            {startTime} → {endTime}
          </h3>
        </div>
        <div className="col-auto pt-0 check">
          <div className="schedule-card-col  align-date me-3">
            <p
              className={` time-btn schedule-lesson-border confirm-tutor-enter-btn tutor_date_padd `}
            >
              {/* {date} */}
              {/* {`${t(moment(date).format('dddd'))}, ${t(
                moment(date).format('MMMM'),
              )} ${moment(date).format('DD')}${t('kor_day')}`} */}
              {date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
