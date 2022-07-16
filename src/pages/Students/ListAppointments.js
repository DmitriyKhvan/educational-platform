import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Layout from '../../components/Layout'
import '../../assets/styles/student.scss'
import { Link, useParams, useHistory } from 'react-router-dom'
import { ModalCancelLesson } from '../../components/ModalCancelLesson'
import { useTranslation } from 'react-i18next'
import { cancel_lesson_reasons_student } from '../../constants/global'
import { getAppointments } from '../../actions/appointment'
import ImgCalendar from '../../assets/images/calendar_icon.svg'
import emptyCalendar from '../../assets/images/calendar_icon_main.svg'
import pastIcon from '../../assets/images/past_icon.svg'
import smileIcon from '../../assets/images/smile_icon.svg'
import AppointmentApi from '../../api/AppointmentApi'
import NotificationManager from '../../components/NotificationManager.js'
import ModalFeedback from './ModalFeedback'
import CTACard from '../../components/student-dashboard/CTACard'
import ScheduleCard from '../../components/student-dashboard/ScheduleCard'
import whiteSubscriptionIcon from '../../assets/images/white_subscription_icon.svg'
import whiteBookingIcon from '../../assets/images/white_book_trial_icon.svg'

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' }
]

const StudentListAppointments = () => {
  const { complete_appoint_id } = useParams()
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedLesson, setSelectedLesson] = useState(false)
  const appointments = useSelector(state => state.appointment.list)
  const user = useSelector(state => state.users.user)
  const [completedAppointment, setCompleteAppointment] = useState(null)
  const history = useHistory()
  const onDismiss = () => setCompleteAppointment(null)
  const onCancel = async ({ id, reasons }) => {
    try {
      await AppointmentApi.cancelAppointment(id)
      NotificationManager.success('You have cancelled successfully!', t)
      fetchAppointments()
    } catch (e) {
      NotificationManager.error(e.response?.data?.message || 'Server Issue', t)
    }

    setSelectedLesson(false)
  }

  const callToAction = [
    {
      icon: whiteBookingIcon,
      title: t('book_trial'),
      subtitle: t('book_trial_subtitle'),
      color: 'light-blue'
    },
    {
      icon: whiteSubscriptionIcon,
      title: t('purchase_subscription'),
      subtitle: t('purchase_subscription_subtitle'),
      color: 'pink'
    }
  ]

  useEffect(() => {
    if (user.tutor_profile) {
      history.push('/')
    }
    if (user) {
      fetchAppointments()
    }
  }, [selectedOption, user])

  useEffect(() => {
    if (complete_appoint_id) {
      const feedbackAppt = appointments.find(
        apt => apt.id == complete_appoint_id
      )
      setCompleteAppointment(feedbackAppt)
    }
  }, [appointments, complete_appoint_id])

  const fetchAppointments = () => {
    let queryObj = {}

    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id
    } else {
      return
    }

    if (selectedOption === options[1]) {
      queryObj.completed = true
    } else {
     queryObj.from = new Date().toISOString()
    }

    dispatch(getAppointments(queryObj))
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        {appointments.length >= 0 ? (
          <div className='flex-container'>
            <div className='student-dashboard flex-left children-wrapper childern-padding'>
              <h4 className='welcome-message'>
                {t('student_dashboard_welcome', { name: user.first_name })}
              </h4>
              <p className='welcome-subtitle'>
                {t('student_dashboard_subtitle')}
              </p>
              <div className='schedule-lesson-select pt-3'>
                <div className='page-card purple large-card py-5'>
                  <div className='row'>
                    <div className='col-2 ms-3 mobilefinal mobilefinal-image'>
                      <img
                        src={ImgCalendar}
                        alt=''
                        className='img-fluid large-card-icon'
                      />
                    </div>
                    <div className='col-7 '>
                      <p className='title mt-1 laptop-title mobile_dash'>
                        {t('schedule_card')}
                      </p>
                    </div>
                  </div>
                  <div className='row mobile-view-buttons'>
                    <div className='col-6 desktop schedule-dashboard-button'>
                      <a
                        href='/student/schedule-lesson/select'
                        className='enter-btn'
                      >
                        {t('schedule_1_on_1_lesson')}
                      </a>
                    </div>
                    <div className='col-6 schedule-dashboard-button'>
                      <a
                        href='/student/schedule-lesson/group-select'
                        className='enter-btn'
                      >
                        {t('schedule_group_lesson')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className='pt-5 already_lesson'>{t('already_lesson')}</h1>
              <div className='flex-container schedule-lesson-select'>
                <div className='page-card pink small-card'>
                  <div className='row ms-1 rows-align'>
                    <div className='col-4  ps-3 mt-3 me-2 mobilefinal mobilefinal-laptop'>
                      <img
                        src={smileIcon}
                        alt=''
                        className='img-fluid small-card-icon-feedback'
                      />
                    </div>
                    <div className='col-7 forest'>
                      <h3 className='text-white change-mobile-top'>
                        {t('student_dashboard_feedback')}
                      </h3>
                    </div>
                  </div>
                  <div className='flex-container ps-2'>
                    <div>
                      <a
                        href='/student/schedule-lesson/select'
                        className='enter-btn'
                      >
                        {t('student_dashboard_submit_feedback_btn')}
                      </a>
                    </div>
                  </div>
                </div>
                <div className='page-card light-blue small-card'>
                  <div className='row ms-1 rows-align'>
                    <div className='col-4 ps-3 mt-3 me-2 mobilefinal mobilefinal-laptop'>
                      <img
                        src={pastIcon}
                        alt=''
                        className='img-fluid small-card-icon-progress'
                      />
                    </div>
                    <div className='col-7 forest'>
                      <h3 className='text-white change-mobile-top'>
                        {t('student_dashboard_progress')}
                      </h3>
                    </div>
                  </div>
                  <div className='flex-container ps-2'>
                    <div>
                      <a
                        href='/student/schedule-lesson/select'
                        className='enter-btn'
                      >
                        {t('student_dashboard_view_progress_btn')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='student-list-appointments-wrapper flex-right children-wrapper '>
              <h4 className='weekly-schedule'>{t('weekly_schedule')}</h4>
              <h4 className='text-purple weekly-schedule-subtitle'>
                {t('student_dashboard_total_lessons', {
                  total_lessons: appointments.length,
                  t: appointments.length > 1 ? 's' : ''
                })}
              </h4>
              <div className='flex-container align-button-dashboard'>
                <div>
                  <Link
                    to='/student/schedule-lesson/select'
                    className='buttonsdash'
                  >
                    {t('student_dashboard_edit_schedule')}
                  </Link>
                </div>
                <div>
                  <Link
                    to='/student/lesson-calendar'
                    className='buttonsdash-second'
                  >
                    {t('student_dashboard_view_all_lessons')}
                  </Link>
                </div>
              </div>
              <div className='weekly-schedule-scroll weekly-schedule-grid'>
                {appointments.length
                  ? appointments.map((x, i) => {
                      const date = moment(x.start_at).unix()
                      return (
                        <ScheduleCard
                          lesson={x.lesson.description}
                          zoomlink={x.zoomlink}
                          date={date}
                          data={x}
                          key={i}
                          index={i}
                          fetchAppointments={fetchAppointments}
                        />
                      )
                    })
                  : ''}
              </div>
            </div>
          </div>
        ) : (
          <div className='d-flex flex-column min-vh-80 justify-content-center align-items-center'>
            <img src={emptyCalendar} alt='' className='img-fluid' />
            <div>
              <h1>{t('student_dashboard_no_lessons')}</h1>
            </div>
            <h3 className='mt-0'>
              {t('student_dashboard_no_lessons_subtitle')}
            </h3>
            <div className='row container justify-content-center mt-5'>
              {callToAction.map(x => (
                <div className='col-4'>
                  <CTACard
                    icon={x.icon}
                    title={x.title}
                    subtitle={x.subtitle}
                    color={x.color}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedLesson && (
        <ModalCancelLesson
          visible={!!selectedLesson}
          lesson={selectedLesson}
          onDismiss={onDismiss}
          onCancel={onCancel}
          reasons={cancel_lesson_reasons_student}
        />
      )}
      {completedAppointment && (
        <ModalFeedback
          onDismiss={() => {
            fetchAppointments()
            onDismiss()
          }}
          visible={true}
          appointment={completedAppointment}
        />
      )}
    </Layout>
  )
}

export default StudentListAppointments
