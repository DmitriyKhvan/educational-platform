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
import Loader from '../../components/common/Loader'

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
  const [isLoading, setIsLoading] = useState(true)
  const appointments = useSelector(state => state.appointment.list)
  const user = useSelector(state => state.users.user)
  const [completedAppointment, setCompleteAppointment] = useState(null)
  const history = useHistory()
  const onDismiss = () => setCompleteAppointment(null)
  const onCancel = async ({ id, reasons }) => {
    try {
      await AppointmentApi.cancelAppointment(id)
      await fetchAppointments()
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
    ;(async () => {
      if (user.tutor_profile) {
        history.push('/')
      }
      if (user) {
        await fetchAppointments()
      }
    })()
  }, [selectedOption, user])

  useEffect(() => {
    if (complete_appoint_id) {
      const feedbackAppt = appointments.find(
        apt => apt.id == complete_appoint_id
      )
      setCompleteAppointment(feedbackAppt)
    }
  }, [appointments, complete_appoint_id])

  const fetchAppointments = async () => {
    let queryObj = {}

    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id
    } else {
      return
    }

    if (selectedOption === options[1]) {
      queryObj.completed = true
    }

    await dispatch(getAppointments(queryObj))
    setIsLoading(false)
  }

  const isWithinAweekArr = appointments
    .map(x => {
      const startOfWeek = moment().isAfter(moment().startOf('isoWeek'))
        ? moment().startOf('day')
        : moment().startOf('isoWeek')
      if (
        moment(x.start_at).isBetween(startOfWeek, moment().endOf('isoWeek'))
      ) {
        return x
      }
    })
    .filter(x => x)

  const isWithinAweek = isWithinAweekArr.filter(
    (x, i, a) => a.findIndex(y => y.start_at === x.start_at) === i
  )

  const ScheduleArr = isWithinAweek
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
    .map((x, i) => {
      const date = moment(x.start_at).unix()
      return (
        <div>
          <ScheduleCard
            lesson={x.lesson.description}
            zoomlink={x.zoomlink}
            date={date}
            data={x}
            key={i}
            index={i}
            fetchAppointments={fetchAppointments}
          />
        </div>
      )
    })

  return (
    <Layout>
      <div className='main-dashboard scroll-layout'>
        {appointments.length >= 0 ? (
          <div className='flex-container'>
            <div className='student-dashboard flex-left children-wrapper flex-change childern-padding'>
              <div className='set-container'>
                <h4 className='welcome-message'>
                  {t('student_dashboard_welcome', { name: user.first_name })}
                </h4>
                <p className='welcome-subtitle'>
                  {t('student_dashboard_subtitle')}
                </p>
                <div className='schedule-lesson-select pt-3'>
                  <div className='page-card purple large-card py-5'>
                    <div className='row image-align_schedule'>
                      <div className='col-2 ms-3 mobilefinal mobilefinal-image'>
                        <img
                          src={ImgCalendar}
                          alt=''
                          className='img-fluid large-card-icon'
                        />
                      </div>
                      <div className='col-9 dash_width'>
                        <p className='title mt-1 laptop-title mobile_dash'>
                          {t('schedule_card')}
                        </p>
                      </div>
                    </div>
                    <div className='row mobile-view-buttons'>
                      <div className='col-6 desktop schedule-dashboard-button'>
                        <a
                          href='/student/schedule-lesson/select'
                          className='schedule-dashboard-buttons'
                        >
                          {t('schedule_1_on_1_lesson')}
                        </a>
                      </div>
                      {/* <div className='col-6 schedule-dashboard-button'>
                        <a
                          href='/student/schedule-lesson/group-select'
                          className='schedule-dashboard-buttons'
                        >
                          {t('schedule_group_lesson')}
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
                <h1 className='pt-5 already_lesson'>{t('already_lesson')}</h1>
                <div className='flex-container schedule-lesson-select'>
                  <div className='page-card pink small-card'>
                    <div className='row ms-1 rows-align'>
                      <div className='col-4  ps-0 mt-3 me-2 mobilefinal mobilefinal-laptop'>
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
                    <div className='flex-container ps-0'>
                      <div>
                        <a
                          href='/student/schedule-lesson/select'
                          className='schedule-dashboard-buttons ms-0'
                        >
                          {t('student_dashboard_submit_feedback_btn')}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className='page-card light-blue small-card'>
                    <div className='row ms-1 rows-align'>
                      <div className='col-4 ps-0 mt-3 me-2 mobilefinal mobilefinal-laptop'>
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
                    <div className='flex-container ps-0'>
                      <div>
                        <a
                          href='/student/schedule-lesson/select'
                          className='schedule-dashboard-buttons ms-0'
                        >
                          {t('student_dashboard_view_progress_btn')}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='student-list-appointments-wrapper flex-rights  changes-container '>
              {!isLoading && (
                <div className='child-set_container dash_child-set_container '>
                  <h4 className='weekly-schedule'>{t('weekly_schedule')}</h4>
                  <div className='weekly-schedule-subtitle dash_weekly-schedule-subtitle'>
                    {t('student_dashboard_total_lessons', {
                      total_lessons: isWithinAweek.length,
                      t: isWithinAweek.length > 1 ? 's' : ''
                    })}
                  </div>
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
                  <div className='weekly-schedule-scroll align_schedule-width-dash weekly-schedule-grid'>
                    {appointments.length ? <>{ScheduleArr}</> : ''}
                  </div>
                </div>
              )}
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
      {isLoading && <Loader />}
    </Layout>
  )
}
export default StudentListAppointments
