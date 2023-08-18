import React from 'react';
import '../../../assets/styles/dashboard.scss';
import { useTranslation } from 'react-i18next';
import ImgArrowBack from '../../../assets/images/arrow_back.svg';
import { Avatar } from '../../../components/Avatar';
import Stars from '../../../components/Stars';
import { format } from 'date-fns';
import FavouriteIcon from '../../../components/FavouriteIcon';
import { getAbbrName } from '../../../constants/global';

const LessonConfirmation = ({ tutor, time, onBack, onContinue }) => {
  const [t] = useTranslation('translation');

  return (
    <div className="overview-confirmation">
      <h4 className="main-title">{t('overview_confirmation')}</h4>
      <div className="btn-step-back" onClick={onBack}>
        <img src={ImgArrowBack} alt="" />
        <span>{t('step_back')}</span>
      </div>
      <div className="divider" />
      <div className="lesson-detail">
        <div>
          <p>{t('selected_tutor')}</p>
          <span />
          <p>{t('lesson_time_detail')}</p>
        </div>
        <div>
          <div className="info">
            <Avatar avatar={tutor.avatar} />
            <div className="detail">
              <p>
                {getAbbrName(tutor.first_name, tutor.last_name)}
                <FavouriteIcon
                  isFavourite={tutor.favorite}
                  tutor_id={tutor.id}
                />
              </p>
              <Stars points={tutor.points} />
              <p className="university">{tutor.university}</p>
              <p className="location">{tutor.location}</p>
              <p className="major">{tutor.major}</p>
            </div>
          </div>
          <div className="divider" />
          <div className="lesson-time-detail">
            <p className="date-time">
              {format(time, 'MMM dd')}, <strong>{format(time, 'hh:mm')}</strong>{' '}
              {format(time, 'aa')}
            </p>
            <p className="day">{format(time, 'EEEE')}</p>
          </div>
        </div>
      </div>
      <p className="how-to-enroll">{t('how_to_enroll')}</p>
      <p className="enroll-description">{t('find_trial_lesson_in_upcoming')}</p>

      <div className="btn-confirm" onClick={onContinue}>
        {t('confirm_lesson')}
      </div>
    </div>
  );
};

export default LessonConfirmation;
