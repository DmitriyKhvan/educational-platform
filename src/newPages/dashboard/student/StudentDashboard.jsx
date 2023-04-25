import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment-timezone'
import Layout from '../../../components/Layout'
import '../../../assets/styles/student.scss'
import { Link, useParams, useHistory } from 'react-router-dom'
import { ModalCancelLesson } from '../../../components/ModalCancelLesson'
import { useTranslation } from 'react-i18next'
import { cancel_lesson_reasons_student } from '../../../constants/global'
import { getAppointments } from '../../../actions/appointment'
import ImgCalendar from '../../../assets/images/calendar_icon.svg'
import emptyCalendar from '../../../assets/images/calendar_icon_main.svg'
import AppointmentApi from '../../../api/AppointmentApi'
import NotificationManager from '../../../components/NotificationManager'
import ModalFeedback from '../../../pages/Students/ModalFeedback'
import CTACard from '../../../components/student-dashboard/CTACard'
import ScheduleCard from '../../../components/student-dashboard/ScheduleCard'
import whiteSubscriptionIcon from '../../../assets/images/white_subscription_icon.svg'
import whiteBookingIcon from '../../../assets/images/white_book_trial_icon.svg'
import smileIcon from '../../../assets/images/smile_icon.svg'
import { useAuth } from '../../../modules/auth'

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' }
]

const StudentListAppointments = () => {
  const { complete_appoint_id } = useParams()
  const dispatch = useDispatch()
  const [t] = useTranslation('dashboard')
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedLesson, setSelectedLesson] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const appointments = useSelector(state => state.appointment.list) ?? []
  const { user } = useAuth()
  const [completedAppointment, setCompleteAppointment] = useState(null)
  const history = useHistory()
  const onDismiss = () => setCompleteAppointment(null)

  const onCancel = async ({ id, reasons }) => {
    setIsLoading(true)
    try {
      await AppointmentApi.cancelAppointment(id)
      await fetchAppointments()
    } catch (e) {
      NotificationManager.error(e.response?.data?.message || 'Server Issue', t)
    }
    setSelectedLesson(false)
    setIsLoading(false)
  }

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
      const feedbackAppt = appointments?.find(
        apt => apt.id == complete_appoint_id
      )
      setCompleteAppointment(feedbackAppt)
    }
  }, [appointments, complete_appoint_id])

  const fetchAppointments = async () => {
    let queryObj = { status: 'scheduled' }

    if (user.role === 'student') {
      queryObj.student_id = user.student?.id
    } else {
      return
    }

    if (selectedOption === options[1]) {
      queryObj.completed = true
    }

    dispatch(getAppointments({ ...queryObj, status: 'scheduled' }))
    setIsLoading(false)
  }

  const isWithinAweekArr = (appointments || [])
    .map(x => {
      console.log(x)
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

  const ScheduleArr = (isWithinAweek || [])
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
    .map((x, i) => {
      const date = moment(x?.start_at)
      const expiredDate = moment(x?.start_at).add(x?.duration, 'minutes')
      const currentDate = moment()
      return (
        currentDate.isBefore(expiredDate) && (
          <div key={i}>
            <ScheduleCard
              lesson={x.lesson?.description}
              zoomlink={x?.zoomlink}
              date={date}
              data={x}
              index={i}
              fetchAppointments={fetchAppointments}
            />
          </div>
        )
      )
    })

  const callToAction =
    appointments.length >= 0
      ? [
          {
            icon: smileIcon,
            title: t('student_dashboard_feedback', { ns: 'dashboard' }),
            disabled: true,
            button: {
              to: '',
              text: t('student_dashboard_submit_feedback_btn', {
                ns: 'dashboard'
              })
            },
            color: '#D6336C',
            cl: ''
          },
          {
            icon: whiteBookingIcon,
            title: t('student_dashboard_progress', { ns: 'dashboard' }),
            button: {
              to: '/student/lesson-calendar?completed',
              text: t('completed_lessons', { ns: 'dashboard' })
            },
            color: '#1482DA',
            cl: 'blue-progress'
          }
        ]
      : [
          {
            icon: whiteBookingIcon,
            title: t('book_trial', { ns: 'dashboard' }),
            subtitle: t('book_trial_subtitle', { ns: 'dashboard' }),
            color: '#1482DA'
          },
          {
            icon: whiteSubscriptionIcon,
            title: t('purchase_subscription'),
            subtitle: t('purchase_subscription_subtitle', { ns: 'dashboard' }),
            color: '#D6336C'
          }
        ]

  return (
    <Layout>
      <div className='main-dashboard scroll-layout'>
        {appointments.length >= 0 ? (
          <div className='flex-container'>
            <div className='student-dashboard flex-left children-wrapper flex-change childern-padding'>
              <div className='set-container'>
                <h4 className='welcome-message'>
                  {t('student_dashboard_welcome', {
                    ns: 'dashboard',
                    name: user.firstName
                  })}
                </h4>
                <p className='welcome-subtitle'>
                  {t('student_dashboard_subtitle', { ns: 'dashboard' })}
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
                          {t('schedule_card', { ns: 'dashboard' })}
                        </p>
                      </div>
                    </div>
                    <div className='row mobile-view-buttons'>
                      <div className='col-6 desktop schedule-dashboard-button'>
                        <Link
                          to='/student/schedule-lesson/select'
                          className='schedule-dashboard-buttons'
                        >
                          {t('schedule_1_on_1_lesson', { ns: 'dashboard' })}
                        </Link>
                      </div>
                      {/* <div className='col-6 schedule-dashboard-button'>
                        <Link
                          to='/student/schedule-lesson/group-select'
                          className='schedule-dashboard-buttons'
                        >
                          {t('schedule_group_lesson')}
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='row container justify-content-center mt-5'>
                <div className='col px-4'>
                  <h4 className='welcome-message'>
                    {t('already_lesson', { ns: 'dashboard' })}
                  </h4>
                  <div className='dashboard-cards-inline mt-5'>
                    {callToAction.map((props, i) => (
                      <CTACard key={i} {...props} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='student-list-appointments-wrapper flex-right changes-container'>
              {!isLoading && (
                <div className='child-set_container dash_child-set_container '>
                  <h4 className='weekly-schedule'>
                    {t('weekly_schedule', { ns: 'dashboard' })}
                  </h4>
                  <div className='weekly-schedule-subtitle dash_weekly-schedule-subtitle'>
                    {t('student_dashboard_total_lessons', {
                      ns: 'dashboard',
                      total_lessons: isWithinAweek.length,
                      t: isWithinAweek.length > 1 ? 's' : ''
                    })}
                  </div>
                  <div>
                    <section className='d-flex align-button-dashboard'>
                      <div>
                        <Link
                          to='/student/schedule-lesson/select'
                          className='buttonsdash'
                        >
                          {t('student_dashboard_edit_schedule', {
                            ns: 'dashboard'
                          })}
                        </Link>
                      </div>
                      <div>
                        <Link
                          to='/student/lesson-calendar'
                          className='buttonsdash-second'
                        >
                          {t('student_dashboard_view_all_lessons', {
                            ns: 'dashboard'
                          })}
                        </Link>
                      </div>
                    </section>
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
              <h1>{t('student_dashboard_no_lessons', { ns: 'dashboard' })}</h1>
            </div>
            <h3 className='mt-0'>
              {t('student_dashboard_no_lessons_subtitle', { ns: 'dashboard' })}
            </h3>
            <div className='row  justify-content-center mt-5'>
              {callToAction.map((props, i) => (
                <div key={i} className='col-4'>
                  <CTACard {...props} />
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
