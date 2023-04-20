import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import {
  createLessonExist,
  createAppointment,
  getAppointments,
  updateAppointment
} from '../../../actions/appointment'
import ActionTypes from '../../../constants/actionTypes'
import NotificationManager from '../../../components/NotificationManager'
import Layout from '../../../components/Layout'
import LessonCardComponent from './LessonCard'
import ScheduleCard from './ScheduleCard'
import TutorImageRow from './TutorImageRow'
import ScheduleCardComponent from '../../../components/student-dashboard/ScheduleCard'
import Loader from '../../../components/common/Loader'
import { useAuth } from '../../../modules/auth'
import LessonCard from './LessonCard'

const LessonConfirmation = ({ plan, tutor, time, setTabIndex, lessonId = null }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')
  const [repeat, setRepeat] = useState({})
  const [cancel, setCancel] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const [isChecked, setIsChecked] = useState(false)
  const [newAppointment, setNewAppointment] = useState({})
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [date, setDate] = useState()
  const [confirmDisable, setConfirmDisable] = useState(false) 
  const fetchAppointments = async () => {
    return await dispatch(getAppointments())
  }

  useEffect(() => {}, [dispatch])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cancelled = async () => {
    const { payload } = await dispatch(getAppointments())
    if (!payload.find(appointment => appointment.id === newAppointment.id)) {
      setIsConfirmed(false)
      setNewAppointment({})
    }
  }

  const userTimezone = user?.timeZone?.split(' ')[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scheduleDate = moment(time)
    .tz(userTimezone)
    .format('dddd, MMM DD')

    console.log(userTimezone)


  const scheduleStartTime = moment(time).tz(userTimezone).format('hh:mm A')
  const scheduleEndTime = moment(time).tz(userTimezone).add(plan?.duration, 'minutes').format('hh:mm A')

  let data = {
    lesson_title: plan?.lesson_title,
    lesson_desc: plan?.description,
    lesson_type: plan?.lesson_type,
    type: plan?.type,
    lesson_id: plan?.lesson_id,
    tutor_id: tutor?.id,
    duration: plan?.duration,
    start_at: moment
      .utc(time, 'ddd MMM DD YYYY HH:mm:ssZ')
      .format('YYYY-MM-DDTHH:mm:ss'),
    cancel_action: 'assign_new_tutor'
  }
  // if (user.student_profile.id) {
  //   // data = { ...data, student_id: user.student_profile.id }
  // }
  data = { ...data, student_id: 26 }

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
    setIsLoading(true)

    /* this means if the lesson ID exists, its going to be a reschedule */
    if (lessonId) {
      const { payload } = await dispatch(getAppointments())
      const [oldAppointment] = payload.filter(
        v => parseInt(v.id) === parseInt(lessonId)
      )
      const oldStartAt = moment(oldAppointment.start_at)
      const duration = moment.duration(oldStartAt.diff(moment())).asHours()
      const rescheduleData = {
        tutor_id: data?.tutor_id,
        start_at: data?.start_at,
        duration: data?.duration
      }
      setIsLoading(true)
      const res =
        duration < 24
          ? await dispatch(
              updateAppointment(lessonId, {
                ...rescheduleData,
                payment_id: plan.payment_id
              })
            )
          : await dispatch(
              updateAppointment(lessonId, {
                ...rescheduleData
              })
            )
      setIsLoading(false)

      if (res.type === ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS) {
        const { payload } = await dispatch(
          getAppointments({ tutor_id: data.tutor_id })
        )
        const newAppt = payload.filter(x => x.id === parseInt(lessonId))[0]

        if (newAppt) {
          setNewAppointment(newAppt)
          setDate(moment(res.payload.group.start_at).unix())
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
    } else {
      let lesson_data = ``
      if (!data.lesson_id) {
        const { payload } = await dispatch(
          createLessonExist({
            title: plan.title || plan.lesson_type,
            description: plan.lesson_type,
            type: plan.lesson_type,
            lesson_guid: plan.payment_id
          })
        )
        lesson_data = payload
      }

      let createAppointmentData = { ...data, payment_id: plan?.payment_id }
      createAppointmentData.lesson_id = lesson_data?.id
      createAppointmentData.lesson_title = lesson_data?.title
      createAppointmentData.lesson_desc = lesson_data?.description
      createAppointmentData.lesson_type = lesson_data?.type
      createAppointmentData.email = user?.email
      createAppointmentData.package_type = plan?.package_type

      const res = await dispatch(createAppointment(createAppointmentData))

      if (res.type === ActionTypes.CREATE_APPOINTMENT_INFO.SUCCESS) {
        const { payload } = await fetchAppointments()
        const newAppt = payload.filter(
          x => x.id === parseInt(res.payload?.groups[0].id)
        )[0]
        if (newAppt) {
          setConfirmDisable(true)
          setNewAppointment(newAppt)
          setDate(moment(newAppt.start_at).unix())
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
    setIsLoading(false)
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className=' children-wrapper tutor-confirm-left flex-left '>
            <div className='set-container_tutor'>
              <h1 className='title my-2 mt-0 confirm-tutor-title'>
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
              <div className='lesson_card-inline'>
                <LessonCard
                  lesson={plan?.lesson_type}
                  duration={plan?.duration}
                  remaining={plan?.total_lessons}
                />
               
              </div>
              <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
                {t('date_and_time')}
              </p>
              <div className='row container ps-2 mobile-width-subtitle'>
                <ScheduleCard
                  startTime={scheduleStartTime}
                  endTime={scheduleEndTime}
                  date={scheduleDate}
                />
              </div>
              <p className='welcome-subtitle pt-4 confirm-tutor-subtitle'>
                {t('tutor')}
              </p>
              <div className='row ps-2 tutor-image'>
                <TutorImageRow tutor={tutor} />
              </div>

              {/* <p className='welcome-subtitle-fonts'>{t('repeating_lesson')}</p> */}
              {/* <div className='row container ps-2 mobile-view-align'>
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
              </div> */}
            </div>
            {/* <div className='row container ps-2 set_padd_lesson'>
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
            </div> */}
            <div className='align_width_width'>
              {/* <p className='welcome-subtitle-fonts'>
                {t('tutor_cancellation')}
              </p> */}
              {/* <div className='row container ps-2  mobile-view-align'>
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
              </div> */}
            </div>
            <div className='align_width_width'>
              <div className='d-grid gap-2 pt-3 buttons-Lesson-shape'>
                <button
                  className={ confirmDisable ? 'btn btn-primary text-white buttons-Lesson disB ' : 'btn btn-primary text-white buttons-Lesson'}
                  onClick={confirmLesson}
                >
                  {confirmDisable ? "Lesson confirmed" : t('confirm_lesson')}
                </button>
              </div>
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
                  date={time}
                  data={newAppointment}
                  fetchAppointments={fetchAppointments}
                  cancelled={cancelled}
                />
              </React.Fragment>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </Layout>
  )
}

export default LessonConfirmation
