import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LessonCard from '../../pages/Students/ScheduleLesson/LessonCard'
import ScheduleCard from '../../pages/Students/ScheduleLesson/ScheduleCard'
import TutorImageRow from '../../pages/Students/ScheduleLesson/TutorImageRow'
import { updateAppointment, getAppointments } from '../../actions/appointment'
import ActionTypes from '../../constants/actionTypes'
import NotificationManager from '../NotificationManager'

const RescheduleConfirmationModal = ({
  setTabIndex,
  data,
  schedule,
  tutor,
  closeModal
}) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [repeat, setRepeat] = useState({})
  const [cancel, setCancel] = useState({})
  const [isChecked, setIsChecked] = useState(false)
  const user = useSelector(state => state.users.user)
  const start_at = moment(schedule).format('YYYY-MM-DDThh:mm:ss')
  const { duration, id } = data
  const cancellationArr = [
    { data: t('assign_new_tutor'), value: 5 },
    { data: t('choose_new_tutor'), value: 6 },
    { data: t('return_lesson_credit'), value: 7 }
  ]

  const fetchAppointments = () => {
    let queryObj = {}

    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id
    } else {
      return
    }

    queryObj.from = new Date()

    dispatch(getAppointments(queryObj))
  }

  const checkboxEvent = ({ target }) => {
    const id = parseInt(target.value)
    if (id <= 4) {
      if (id === repeat.value) {
        setRepeat({})
      } else {
        setRepeat({ data: target.id, value: id })
      }
    } else if (id > 4) {
      if (id === cancel.value) {
        setIsChecked(false)
      } else {
        setCancel({ data: target.id, value: id })
        setIsChecked(true)
      }
    }
  }
  const confirmReschedule = async () => {
    const res = await dispatch(
      updateAppointment(id, { tutor_id: tutor.id, start_at, duration })
    )
    if (res.type === ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS) {
      fetchAppointments()
      closeModal()
    } else if (res.payload.error.message) {
      NotificationManager.error(res.payload.error.message, t)
    } else {
      NotificationManager.error('Server Error', t)
    }
  }

  return (
    <React.Fragment>
      <div
        className='scroll-layout container'
        style={{ width: '45vw', overflow: 'scroll' }}
      >
        <div className='container'>
          <h2>{t('confirmation')}</h2>
          <p className='welcome-subtitle'>{t('confirmation_subtitle')}</p>
          <div className='modal-scroll ps-4'>
            <div className='row'>
              <button
                className='enter-btn btn-dash-return col-5'
                onClick={() => setTabIndex(2)}
              >
                {t('edit_schedule')}
              </button>

              <button
                className='enter-btn btn-dash-return col-5'
                onClick={() => setTabIndex(3)}
              >
                {t('edit_tutor')}
              </button>

              <p className='welcome-subtitle pt-4'>{t('lesson_topic')}</p>
              <div className='row container ps-2'>
                <LessonCard
                  lesson={data.planStatus.lesson_type}
                  duration={data.duration}
                  remaining={data.planStatus.total_lessons}
                />
              </div>

              <p className='welcome-subtitle pt-4'>{t('date_and_time')}</p>
              <div className='row container ps-2'>
                <ScheduleCard time={schedule} duration={data.duration} />
              </div>

              <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
                {t('tutor')}
              </p>
              <div className='row ps-2'>
                <TutorImageRow tutor={tutor} />
              </div>
            </div>

            <p className='welcome-subtitle pt-4'>{t('tutor_cancellation')}</p>
            <div className='row'>
              {cancellationArr.map((x, i) => (
                <div
                  className='col-auto schedule-lesson-border ms-1 px-2 form-check-wrapper py-2'
                  key={i}
                >
                  <div className='form-check'>
                    <div
                      className='form-check-input'
                      type='checkbox'
                      value={x.value}
                      id={x.data}
                      onChange={checkboxEvent}
                      checked={x.value === cancel?.value ? true : false}
                    />
                    <label className='form-check-label' htmlFor={x.data}>
                      {x.data}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className='row container d-grid gap-2 pt-3'>
              <button
                className='btn btn-primary text-white'
                disabled={!isChecked}
                onClick={confirmReschedule}
              >
                {t('confirm_lesson')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default RescheduleConfirmationModal
