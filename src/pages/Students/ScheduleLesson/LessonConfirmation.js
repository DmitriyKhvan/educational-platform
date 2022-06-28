import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import moment from 'moment'
import {
  createAppointment,
  getAppointments
} from '../../../actions/appointment'
import ActionTypes from '../../../constants/actionTypes'
import NotificationManager from '../../../components/NotificationManager'
import Layout from '../../../components/Layout'
import LessonCardComponent from './LessonCard'
import ScheduleCard from './ScheduleCard'
import TutorImageRow from './TutorImageRow'
import ScheduleCardComponent from '../../../components/student-dashboard/ScheduleCard'

const LessonConfirmation = ({ plan, tutor, time, setTabIndex }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')
  const [repeat, setRepeat] = useState({})
  const [cancel, setCancel] = useState({})
  const user = useSelector(state => state.users.user)
  const [isChecked, setIsChecked] = useState(false)
  const [newAppointment, setNewAppointment] = useState({})
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [date, setDate] = useState()

  useEffect(() => {}, [dispatch])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const formattedTime = new Date(time)
  let data = {
    lesson_id: plan.lesson_id,
    tutor_id: tutor.id,
    duration: plan.duration,
    start_at: format(formattedTime, "yyyy-MM-dd'T'HH:mm:ss"),
    cancel_action: 'assign_new_tutor'
  }
  if (user.student_profile.id) {
    data = { ...data, student_id: user.student_profile.id }
  }

  const fetchAppointments = async () => {
    const queryObj = {
      student_id: user.student_profile.id,
      from: new Date().toISOString()
    }
    return await dispatch(getAppointments(queryObj))
  }

  const weekArr = Array.apply(null, Array(7)).map((_, i) =>
    moment(i, 'e')
      .startOf('week')
      .isoWeekday(i + 1)
      .format('ddd')
  )

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
        setCancel({})
        setIsChecked(false)
      } else {
        setCancel({ data: target.id, value: id })
        setIsChecked(true)
      }
    }
  }

  const repeatingLessonArr = [
    {
      data: t('every_week'),
      value: 1
    },
    {
      data: t('every_two_weeks'),
      value: 2
    },
    {
      data: t('dont_repeat'),
      value: 3
    },
    {
      data: t('custom'),
      value: 4
    }
  ]

  const cancellationArr = [
    { data: t('assign_new_tutor'), value: 5 },
    { data: t('choose_new_tutor'), value: 6 },
    { data: t('return_lesson_credit'), value: 7 }
  ]

  const confirmLesson = async () => {
    const res = await dispatch(createAppointment(data))
    if (res.type === ActionTypes.CREATE_APPOINTMENT_INFO.SUCCESS) {
      const { payload } = await fetchAppointments()
      const newAppt = payload.filter(x => x.id === res.payload.groups[0].id)[0]
      if (newAppt) {
        setDate(moment(newAppt.start_at).unix())
        setNewAppointment(newAppt)
        setIsConfirmed(true)
        window.scrollTo(0, 0)
      }
    } else {
      if (res.payload.error.messages && res.payload.error.messages.length) {
        NotificationManager.error(
          res.payload.error.messages.map(msg => msg.title).join('\n'),
          t
        )
      } else if (res.payload.error.message) {
        NotificationManager.error(res.payload.error.message, t)
      } else {
        NotificationManager.error('Server Error', t)
      }
    }
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className=' children-wrapper tutor-confirm-left flex-left'>
            <h1 className='title my-2 confirm-tutor-title'>
              {t('confirmation')}
            </h1>
            <p className='welcome-subtitle confirm-tutor-subtitle'>
              {t('confirmation_subtitle')}
            </p>
            <div className='row '>
              <div className='col-auto button-size'>
                <button
                  className='confirm-tutor-enter-btn mobile-width'
                  onClick={() => setTabIndex(0)}
                >
                  {t('edit_lesson')}
                </button>
              </div>
              <div className='col-auto button-size'>
                <button
                  className='confirm-tutor-enter-btn mobile-width'
                  onClick={() => setTabIndex(1)}
                >
                  {t('edit_schedule')}
                </button>
              </div>
              <div className='col-auto button-size'>
                <button
                  className='confirm-tutor-enter-btn mobile-width'
                  onClick={() => setTabIndex(2)}
                >
                  {t('edit_tutor')}
                </button>
              </div>
            </div>

            <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
              {t('lesson_topic')}
            </p>
            <div className='row container ps-2 mobile-width-subtitle'>
              <LessonCardComponent
                lesson={plan.lesson_type}
                duration={plan.duration}
                remaining={plan.total_lessons}
              />
            </div>
            <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
              {t('date_and_time')}
            </p>
            <div className='row container ps-2 mobile-width-subtitle'>
              <ScheduleCard time={time} duration={plan.duration} />{' '}
            </div>
            <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
              {t('tutor')}
            </p>
            <div className='row ps-2 tutor-image'>
              <TutorImageRow tutor={tutor} />
            </div>
            <p className='welcome-subtitle-fonts'>{t('repeating_lesson')}</p>
            <div className='row container ps-2 mobile-view-align'>
              {repeatingLessonArr.map(x => (
                <div className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value={x.value}
                      id={x.data}
                      onChange={checkboxEvent}
                      checked={x.value === repeat?.value ? true : false}
                    />
                    <label className='form-check-label' htmlFor={x.data}>
                      {x.data}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className='row container ps-2'>
              {repeat.value === 4
                ? weekArr.map(x => (
                    <div className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value={x}
                          id={x}
                          onChange={checkboxEvent}
                        />
                        <label className='form-check-label' htmlFor={x}>
                          {x}
                        </label>
                      </div>
                    </div>
                  ))
                : ''}
            </div>

            <p className='welcome-subtitle-fonts'>{t('tutor_cancellation')}</p>
            <div className='row container ps-2  mobile-view-align'>
              {cancellationArr.map((x, i) => (
                <div
                  className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'
                  key={i}
                >
                  <div className='form-check'>
                    <input
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

            <div className='d-grid gap-2 pt-3 buttons-Lesson-shape'>
              <button
                className='btn btn-primary text-white buttons-Lesson'
                disabled={!isChecked}
                onClick={confirmLesson}
              >
                {t('confirm_lesson')}
              </button>
            </div>
          </div>
          <div className='availability-wrapper tutor-confirm-right flex-right student-list-appointments-wrapper'>
            {isConfirmed ? (
              <React.Fragment>
                <h4 className='weekly-schedule'>{t('lesson_confirmation')}</h4>
                <h4 className='text-purple weekly-schedule-subtitle'>
                  {t('lesson_confirmation_subtitle')}
                </h4>
                <div className='flex-container'>
                  <div>
                    <Link to='/student/manage-lessons' className='enter-btn'>
                      {t('dashboard')}
                    </Link>
                  </div>
                  <div>
                    <Link to='/student/lesson-calendar' className='enter-btn'>
                      {t('student_dashboard_view_all_lessons')}
                    </Link>
                  </div>
                </div>
                <ScheduleCardComponent
                  index={0}
                  lesson={newAppointment.lesson.description}
                  zoomlink={newAppointment.zoomlink}
                  date={date}
                  data={newAppointment}
                />
              </React.Fragment>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LessonConfirmation
