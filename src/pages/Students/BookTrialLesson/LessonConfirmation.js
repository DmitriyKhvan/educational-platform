import React, { useEffect, useState } from 'react'
import '../../../assets/styles/dashboard.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ImgArrowBack from '../../../assets/images/arrow_back.svg'
import { Checkbox } from '../../../components/Checkbox'
import { Avatar } from '../../../components/Avatar'
import Stars from '../../../components/Stars'
import { format } from 'date-fns'
import FavouriteIcon from '../../../components/FavouriteIcon'
import { getAbbrName } from '../../../constants/global'

const LessonConfirmation = ({ tutor, time, onBack, onContinue }) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [checkStates, setCheckStates] = useState([false, false, false])

  useEffect(() => {}, [dispatch])

  const onChangeChecked = index => {
    let checked = [...checkStates]
    checked[index] = !checked[index]
    setCheckStates(checked)
  }

  const CancelReasonBox = ({ label, index, checked, onChange }) => {
    return (
      <div className={`cancel-reason ${checked ? 'active' : ''}`}>
        <div>
          <Checkbox
            checked={checked}
            onChange={() => onChange(index)}
            label={label}
          />
        </div>
      </div>
    )
  }
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
  )
}

export default LessonConfirmation
