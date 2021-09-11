import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../components/Layout'
import '../../assets/styles/student.scss'
import ImgApproved from '../../assets/images/approved.svg'
import ImgNotApproved from '../../assets/images/not_approved.svg'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

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
import ImgGroup from '../../assets/images/group.svg'
import ImgTutor from '../../assets/images/tutor.svg'
import ImgCalendar from '../../assets/images/dashboard-calendar.svg'
import ImgMessage from '../../assets/images/dashboard-message.svg'
import ImgPackages from '../../assets/images/dashboard-packages.svg'
import AppointmentApi from '../../api/AppointmentApi'
import NotificationManager from '../../components/NotificationManager.js'
import FavouriteIcon from '../../components/FavouriteIcon'
import ModalFeedback from './ModalFeedback'

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

  const [t, i18n] = useTranslation('translation')
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedLesson, setSelectedLesson] = useState(false)
  const [cancelIndex, setCancelIndex] = useState(-1)
  const [favourite, setFavourite] = useState(false)
  const appointments = useSelector(state => state.appointment.list)
  const loading = useSelector(state => state.appointment.loading)
  const user = useSelector(state => state.users.user)

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
        <div className="student-dashboard">
          <h4 className="main-title">{t('main_dashboard')}</h4>
          <div className="divider" />

          <p className="sub-title">{t('schedule_lesson')}</p>
          <div className="schdule-lesson-select">
            <div className="page-card">
              <img src={ImgTutor} alt="" />
              <p>{t('one_on_one_lesson')}</p>
              <a href="/student/schedule-lesson/select" className="enter-btn">
                {t('schedule_1_on_1_lesson')}
              </a>
            </div>
            <div className="page-card">
              <img src={ImgGroup} alt="" />
              <p>{t('group_lesson')}</p>
              <a
                href="/student/schedule-lesson/group-select"
                className="enter-btn"
              >
                {t('schedule_group_lesson')}
              </a>
            </div>
          </div>
          {/* <p className="sub-title">Lesson Feedback</p>
            <div className="lesson-feedback-wrapper">
              <div className="image">
                <img src={ImgFeedback} alt="" />
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesq
                sit amet feugiat sem. Duis sit amet augue a quam tincidunt euism
                id vitae justo. Ut non leo vitae libero pellentesque dignissim. </p>
              <div className="btn-feedback">Give Feedback</div>
            </div> */}
          {/* <ModalWriteReview selectedLesson={selectedLesson} onDismiss={onDismiss} /> */}
        </div>

        <div className="student-list-appointments-wrapper">
          <h4 className="main-title">{t('appointments')}</h4>
          <div className="divider" />

          <p className="sub-title">{t('manage_lessons')}</p>
          <div className="filter">
            <div>
              {/* <p>{t('show_only')}</p>
                <Checkbox label={t('lessons_led_by_favourite_tutors')} onChange={() => setFavourite(!favourite)} checked={favourite} /> */}
              {t(selectedOption.value)} {t('details')}
            </div>
            <div>
              <p>
                {t('showing_n_upcoming', {
                  n: appointments ? appointments.length : 0
                })}
              </p>
              <Select
                value={selectedOption}
                onChange={handleChange}
                options={options}
                styles={customStyles}
                placeholder={t('placeholder_sortby')}
                classNamePrefix="custom-select"
                className="custom-select"
                name="sortBy"
                rules={{ required: 'Please select an option' }}
                getOptionValue={option => option.value}
                getOptionLabel={option => option.label}
              />
            </div>
          </div>

          <div className="cards">
            {loading ? (
              <Loader
                className="align-center"
                type="Audio"
                color="#00BFFF"
                height={50}
                width={50}
              />
            ) : (
              <>
                {appointments && appointments.length > 0 ? (
                  <>
                    {appointments &&
                      appointments.map((apt, index) => {
                        return renderCard(apt, index)
                      })}
                  </>
                ) : (
                  <span className="no-data">{t('no_data')}</span>
                )}
              </>
            )}
          </div>

          <div className="divider" />
          <p className="sub-title">{t('dashboard_guide')}</p>
          <div className="dashboard-cards">
            <div className="card">
              <div className="main">
                <div className="content">
                  <img src={ImgCalendar} alt="" />
                  <p>{t('appointment_calendar')}</p>
                </div>
              </div>
              <Link to="/student/lesson-calendar" className="btn">
                {t('show_lesson_calendar')}
              </Link>
            </div>
            {/* <div className="card">
              <div className="main">
                <div className="content">
                  <img src={ImgClassMaterial} alt="" />
                  <p>Class Material</p>
                </div>
              </div>
              <Link to="/student/class-materials" className="btn">Open Class Material</Link>
            </div> */}
            <div className="card">
              <div className="main">
                <div className="content">
                  <img src={ImgMessage} alt="" />
                  <p>Message</p>
                </div>
              </div>
              <Link to="/messages" className="btn">
                {t('write_message_tutor')}
              </Link>
            </div>
            <div className="card">
              <div className="main">
                <div className="content">
                  <img src={ImgPackages} alt="" />
                  <p>{t('packages')}</p>
                </div>
              </div>
              <Link to="/student/packages" className="btn">
                {t('open_packages')}
              </Link>
            </div>
          </div>
        </div>
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
