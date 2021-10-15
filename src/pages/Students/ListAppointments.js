import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Layout from '../../components/Layout'
import '../../assets/styles/student.scss'
import ImgApproved from '../../assets/images/approved.svg'
import ImgNotApproved from '../../assets/images/not_approved.svg'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import placeholderAvatar from '../../assets/images/placeholder_avatar.png'
import format from 'date-fns/format'
import { Link, useParams, useHistory } from 'react-router-dom'
import { ModalCancelLesson } from '../../components/ModalCancelLesson'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import { Avatar } from '../../components/Avatar'
import {
  cancel_lesson_reasons_student,
  getAbbrName
} from '../../constants/global'
import { getAppointments } from '../../actions/appointment'
import ImgCalendar from '../../assets/images/calendar_icon.svg'
import emptyCalendar from '../../assets/images/calendar_icon_main.svg'
import pastIcon from '../../assets/images/past_icon.svg'
import smileIcon from '../../assets/images/smile_icon.svg'
import AppointmentApi from '../../api/AppointmentApi'
import NotificationManager from '../../components/NotificationManager.js'
import FavouriteIcon from '../../components/FavouriteIcon'
import ModalFeedback from './ModalFeedback'
import CTACard from '../../components/student-dashboard/CTACard'
import ScheduleCard from '../../components/student-dashboard/ScheduleCard'
import whiteSubscriptionIcon from '../../assets/images/white_subscription_icon.svg'
import whiteBookingIcon from '../../assets/images/white_book_trial_icon.svg'
/**
 * Constants
 */

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' }
]

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#F2F2F2' : null,
    color: '#000000',
    padding: '8px 0 8px 16px',
    fontSize: 14,
    fontWeight: isSelected ? 600 : 300
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
  })
}

const StudentListAppointments = () => {
  const { complete_appoint_id } = useParams()

  const [t] = useTranslation('translation')
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedLesson, setSelectedLesson] = useState(false)
  const [, setCancelIndex] = useState(-1)
  const appointments = useSelector(state => state.appointment.list)
  const user = useSelector(state => state.users.user)
  const state = useSelector(state => state)
  const [completedAppointment, setCompleteAppointment] = useState(null)
  const history = useHistory()

  const onDismiss = () => setCompleteAppointment(null)
  const onCancel = async ({ id, reasons }) => {
    try {
      const res = await AppointmentApi.cancelAppointment(id)
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

  const onComplete = apt => {
    setCompleteAppointment({
      ...apt,
      tutor: { ...apt.tutor.user, ...apt.tutor }
    })
  }

  const dispatch = useDispatch()

  const handleChange = option => {
    setSelectedOption(option)
  }

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

  const renderCard = (apt, index) => {
    const now = new Date()
    const start_at = new Date(apt.start_at)
    const end_at = new Date(apt.start_at)
    end_at.setMinutes(end_at.getMinutes() + apt.duration)
    const start_date = format(start_at, 'MM-dd-yyyy') // start_at.toLocaleDateString();
    let status = ''
    let running = false
    let completed = false
    if (now >= start_at && now <= end_at) {
      status = t('lesson_is_running')
      running = true
    } else {
      if (now < start_at) {
        let delta = (start_at - now) / 1000
        let days = parseInt(delta / 24 / 3600)
        let hours = parseInt((delta % (24 * 3600)) / 3600)
        let mins = parseInt(((delta % (24 * 3600)) % 3600) / 60)
        if (days > 0) status = days + ' d '
        if (hours > 0) status = status + hours + ' hrs '
        if (mins > 0) status = status + days + ' min'
      } else {
        status = t('lesson_is_over')
        completed = true
      }
    }

    const duration = `${format(start_at, 'hh:mm aa')} - ${format(
      end_at,
      'hh:mm aa'
    )}`
    // start_at.toLocaleTimeString() + '-' + end_at.toLocaleTimeString();
    return (
      <div key={`card-${index}`} className="card">
        <div className="card-content">
          <div className="title">
            <span>{apt.lesson.type}</span>
            <span>({apt.type})</span>
          </div>
          <div className="start_date">{start_date}</div>
          <div className="duration">{duration}</div>
          <div className={'status-wrapper ' + (running ? 'running' : '')}>
            <div className="status">{status}</div>
          </div>
          {apt.tutor && apt.tutor.user && (
            <div className="tutor">
              <div>{t('tutor')}</div>
              <div className="info">
                <div className="name">
                  <div>
                    <span>
                      {getAbbrName(
                        apt.tutor ? apt.tutor.user?.first_name : apt.first_name,
                        apt.tutor ? apt.tutor.user?.last_name : apt.last_name
                      )}
                    </span>
                    <FavouriteIcon
                      isFavourite={apt.tutor.favorite}
                      tutor_id={apt.tutor.id}
                    />
                  </div>
                  {apt.type === '1-on-1' && (
                    <div>
                      <span>
                        {apt.students[0]?.GroupStudent?.approved
                          ? t('tutor_approved')
                          : t('tutor_not_approved')}
                      </span>
                      <img
                        src={
                          apt.students[0]?.GroupStudent?.approved
                            ? ImgApproved
                            : ImgNotApproved
                        }
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div className="avatar">
                  {apt.tutor.user?.avatar && (
                    <Avatar avatar={apt.tutor.user?.avatar} />
                  )}
                  {!apt.tutor.user?.avatar && (
                    <div className="no-avatar">
                      <span>
                        {(apt.tutor?.user?.first_name || '')
                          .charAt(0)
                          .toUpperCase() +
                          (apt.tutor?.user?.last_name || '')
                            .charAt(0)
                            .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {!apt.completed && (
            <a
              className={'btn-join ' + (running ? 'active' : '')}
              target="_blank"
              href={apt.zoomlink?.url}
              rel="noreferrer"
            >
              {t('join_session')}
            </a>
          )}
          {!apt.completed && (
            <span
              className="btn-cancel"
              onClick={() => {
                setSelectedLesson(apt)
                setCancelIndex(index)
              }}
            >
              {t('cancel_lesson')}
            </span>
          )}
          {apt.completed &&
            (apt.students[0]?.GroupStudent?.attendance ? (
              <span className="btn-complete btn-feedback">{t('complete')}</span>
            ) : (
              <span className="btn-complete" onClick={() => onComplete(apt)}>
                {t('complete')}
              </span>
            ))}
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="scroll-layout">
        {appointments.length >= 0 ? (
          <div className="flex-container">
            <div className="student-dashboard flex-left children-wrapper">
              <h4 className="welcome-message">
                {t('student_dashboard_welcome', { name: user.first_name })}
              </h4>
              <p className="welcome-subtitle">
                {t('student_dashboard_subtitle')}
              </p>
              <div className="schdule-lesson-select pt-3">
                <div className="page-card purple large-card py-5">
                  <div className="row">
                    <div className="col-2 ms-3">
                      <img
                        src={ImgCalendar}
                        alt=""
                        className="img-fluid large-card-icon"
                      />
                    </div>
                    <div className="col-8">
                      <p className="title mt-1">{t('schedule_card')}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <a
                        href="/student/schedule-lesson/select"
                        className="enter-btn"
                      >
                        {t('schedule_1_on_1_lesson')}
                      </a>
                    </div>
                    <div className="col-6">
                      <a
                        href="/student/schedule-lesson/group-select"
                        className="enter-btn"
                      >
                        {t('schedule_group_lesson')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="pt-5">Already had a lesson?</h1>
              <div className="flex-container schdule-lesson-select">
                <div className="page-card pink small-card">
                  <div className="row ms-1">
                    <div className="col-4 mt-3 ps-3 me-2">
                      <img
                        src={smileIcon}
                        alt=""
                        className="img-fluid small-card-icon-feedback"
                      />
                    </div>
                    <div className="col-7 mt-2">
                      <h3 className="text-white">
                        {t('student_dashboard_feedback')}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-container ps-2">
                    <div>
                      <a
                        href="/student/schedule-lesson/select"
                        className="enter-btn"
                      >
                        {t('student_dashboard_submit_feedback_btn')}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="page-card light-blue small-card">
                  <div className="row ms-1 mt-3">
                    <div className="col-4 ps-3 me-2">
                      <img
                        src={pastIcon}
                        alt=""
                        className="img-fluid small-card-icon-progress"
                      />
                    </div>
                    <div className="col-6">
                      <h3 className="text-white">
                        {t('student_dashboard_progress')}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-container ps-2">
                    <div>
                      <a
                        href="/student/schedule-lesson/select"
                        className="enter-btn"
                      >
                        {t('student_dashboard_view_progress_btn')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="student-list-appointments-wrapper flex-right children-wrapper">
              <h4 className="weekly-schedule">{t('weekly_schedule')}</h4>
              <h4 className="text-purple weekly-schedule-subtitle">
                {t('student_dashboard_total_lessons', {
                  total_lessons: appointments.length,
                  t: appointments.length > 1 ? 's' : ''
                })}
              </h4>
              <div className="flex-container">
                <div>
                  <Link
                    to="/student/schedule-lesson/select"
                    className="enter-btn"
                  >
                    {t('student_dashboard_edit_schedule')}
                  </Link>
                </div>
                <div>
                  <Link to="/student/lesson-calendar" className="enter-btn">
                    {t('student_dashboard_view_all_lessons')}
                  </Link>
                </div>
              </div>
              {appointments.map((x, i) => {
                const date = moment(x.start_at).unix()
                const endEpoch = date + x.duration * 60
                const startTime = moment.unix(date).format('LT')
                const endTime = moment.unix(endEpoch).format('LT')
                return (
                  <ScheduleCard
                    lesson={x.lesson.description}
                    startTime={startTime}
                    endTime={endTime}
                    zoomlink={x.zoomlink}
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column min-vh-80 justify-content-center align-items-center">
            <img src={emptyCalendar} alt="" className="img-fluid" />
            <div>
              <h1>{t('student_dashboard_no_lessons')}</h1>
            </div>
            <h3 className="mt-0">
              {t('student_dashboard_no_lessons_subtitle')}
            </h3>
            <div className="row container justify-content-center mt-5">
              {callToAction.map(x => (
                <div className="col-4">
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
