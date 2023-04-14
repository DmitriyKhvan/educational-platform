import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import Modal from 'react-modal'
import moment from 'moment-timezone'
import CalendarModal from '../../components/CalendarModal'
import Layout from '../../components/Layout'
import { getAppointments } from '../../actions/appointment'
import { getUserInfo } from '../../actions/user'
import { getStudent } from '../../actions/students'
import { cancelAppointment } from '../../actions/appointment'
import Loader from '../../components/common/Loader'

import '../../assets/styles/calendar.scss'
import { feedbackURL } from '../../constants/global'
import ReviewLessonModal from '../../components/student-dashboard/ReviewLessonModal'
import { useAuth } from '../../modules/auth'
import FeedbackModal from './FeedbackModal'
import FeedbackLessonModal from '../Tutors/FeedbackLessonModal'

const Calendar = () => {
  const [t] = useTranslation('translation')
  const { user } = useAuth()

  const calendarAppointments = useSelector(
    state => state.appointment.calendarEvents
  )
  const tableAppointments = useSelector(
    state => state.appointment.tablularEventData
  )

  const [calendarEvents, setCalendarEvents] = useState([])
  const [pastLessons, setPastLessons] = useState([])
  const [upcomingLessons, setUpcomingLessons] = useState([])
  const [selectedTab, setSelectedTab] = useState('calendar')

  const [isLoading, setIsLoading] = useState(true)
  const [displayTableData, setDisplayTableData] = useState([])
  const [calendarEvent, setCalendarEvent] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [isCalendar, setIsCalendar] = useState(true)
  const closeModal = () => {
    setCalendarEvent({})
    setIsOpen(false)
  }
  const dispatch = useDispatch()

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      background: 'none',
      border: 'none'
    }
  }

  useEffect(() => {
    if (!user) {
      dispatch(getUserInfo())
    }
  }, [dispatch])

  useEffect(() => {
    ;(async () => {
      await dispatch(getStudent(user.student.id))
      if (user && user.student) {
        await dispatch(getAppointments({ student_id: user.student.id, status: 'scheduled' }))
      }
    })()
  }, [user])

  useEffect(() => {
    if (calendarAppointments) {
      const tempEvents = []
      calendarAppointments.forEach((_, index) => {
        const start = moment(calendarAppointments[index].start_at).tz(
          userTimezone
        )
        const end = moment(calendarAppointments[index].end_at).tz(userTimezone)
        const event = {
          id: index,
          title:
            calendarAppointments[index].lesson.type.charAt(0).toUpperCase() +
            calendarAppointments[index].lesson.type.slice(1),
          start: start.toDate(),
          end: end.toDate(),
          resource: calendarAppointments[index]
        }
        tempEvents.push(event)
      })
      setCalendarEvents([...tempEvents])
      setIsLoading(false)
    }
  }, [calendarAppointments])

  useEffect(() => {
    if (tableAppointments) {
      const tempUpcomingLessons = []
      const tempPastLessons = []
      tableAppointments.map(each => {
        if (new Date(each.resource.start_at) > new Date()) {
          tempUpcomingLessons.push(each)
        } else {
          tempPastLessons.push(each)
        }
      })
      setUpcomingLessons([...tempUpcomingLessons])
      setPastLessons([...tempPastLessons])
    }
  }, [tableAppointments])

  const CustomModal = () => {
    const [selectedEvent] = calendarEvents.filter(
      x => x.id === calendarEvent.id
    )
    const scheduledTime = moment(selectedEvent.resource.start_at).tz(
      userTimezone
    )
    const startTime = moment(selectedEvent.resource.start_at)
      .tz(userTimezone)
      .format('hh:mm A')
    const endTime = moment(selectedEvent.resource.end_at)
      .tz(userTimezone)
      .format('hh:mm A')

    return (
      <div style={{ zIndex: 9999 }} className='container'>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <CalendarModal
            lesson={selectedEvent.title}
            startTime={startTime}
            endTime={endTime}
            zoomlink={selectedEvent.resource.zoomLink}
            time={scheduledTime}
            data={selectedEvent}
            onCancel={onCancel}
            closeModal={closeModal}
          />
        </Modal>
      </div>
    )
  }

  const tables = [
    {
      id:1,
      package: "PRIVATE ENGLISH",
      level: "Level 2",
      currentTopic: "Jurrasic Park",
      nextTopic: "Triceratops",
      resource: {
        duration: 25,
        start_at: "7:30"
      },
      mentor: "Said A.",
      
    }
  ]

  const onClickPastLessons = () => {
    setIsCalendar(false)
    setDisplayTableData([...pastLessons])
    setSelectedTab('pastLessons')
  }

  const onClickUpcomingLessons = () => {
    setIsCalendar(false)
    setDisplayTableData([...upcomingLessons])
    setSelectedTab('upcomingLessons')
  }

  const onCalendarClick = e => {
    setIsCalendar(true)
    setSelectedTab('calendar')
  }

  const onCancel = async id => {
    await dispatch(cancelAppointment(id))
    setIsOpen(false)
    await dispatch(getAppointments({ student_id: user.student_profile.id, status: 'scheduled' }))
    setIsCalendar(true)
  }

  const userTimezone = user?.timeZone?.split(' ')[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localizer = momentLocalizer(moment.tz.setDefault(userTimezone))
  const allViews = ['month', 'week', 'day']
  const formats = {
    dateFormat: 'D',
    weekdayFormat: 'dddd',
    dayFormat: 'dddd D',
    timeGutterFormat: 'hA'
  }

  const onSelectEvent = e => {
    const today = moment().format('MM/DD/YYYY hh:mm a')
    const closedDate = moment(e.end).format('MM/DD/YYYY hh:mm a')
    if (moment(today).isBefore(closedDate)) {
      setCalendarEvent(e)
      setIsOpen(true)
    }
  }
  const handleFeedback = () => {
    window.open(feedbackURL)
  }

  const tableHead = [
    'Package',
    'Duration',
    // 'Level',
    // 'Current Topic',
    // 'Next Topic',
    'Date and Time',
    'Mentor',
    'Class Feedback'
  ]

  const [isReviewLessonModalOpen, setReviewLessonModal] = useState(false);
  const [isFeedbackModal, setFeedbackModal] = React.useState(false);

  const handleOpenFeedbackModal = () => {
    setFeedbackModal(true)
  }

  const handleClodeFeedbackModal = () => {
    setFeedbackModal(false)
  }

  return (
    <Layout>
      <div className='children-wrapper'>
        {/* <button onClick={() => setReviewLessonModal(true)}>Hey</button> */}
        <div className='appointment-calendar container-fluid'>
          <h1 className='title m-0 mt-4 mb-3'>{t('appointment_calendar')}</h1>
          <div className='row container-fluid m-0 p-0'>
            <div className='col-auto'>
              <div className='btn-group' role='group'>
                <button
                  type='button'
                  className={`btn grey-border ${
                    selectedTab === 'upcomingLessons' && 'btn-selected'
                  }`}
                  onClick={onClickUpcomingLessons}
                >
                  <span>{t('upcoming_lessons')}</span>
                </button>
                <button
                  type='button'
                  className={`btn grey-border ${
                    selectedTab === 'pastLessons' && 'btn-selected'
                  }`}
                  onClick={onClickPastLessons}
                >
                  <span>{t('past_lessons')}</span>
                </button>
              </div>
            </div>
            <div className='col-auto ps-3'>
              <button
                type='button'
                className={`btn grey-border ${
                  selectedTab === 'calendar' && 'btn-selected'
                }`}
                onClick={onCalendarClick}
              >
                <span>{t('calendar_view')}</span>
              </button>
            </div>
          </div>
          <div className='scroll-layout'>
            {!isLoading && !isCalendar && (
              <table className='table mt-4'>
                <thead>
                  <tr>
                    {tableHead.map(x => (
                      <th scope='col'>{x}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {
                    displayTableData?.length === 0 
                      && (
                        <tr className='tr-center ' style={{transform: "translateX(38%) translateY(30%)"}}>
                          <td onClick={handleOpenFeedbackModal}>
                            You don't have lessons!
                          </td>
                        </tr>
                      )
                  }
                  {displayTableData
                    .sort(
                      (a, b) =>
                        new Date(a.dateTime.date) - new Date(b.dateTime.date)
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.dateTime.startTime) -
                        new Date(b.dateTime.startTime)
                    )
                    .map(event => (
                      <tr className='tr-center'>
                        <td className='td-item'>
                          <p className='td-lesson'>{event.lesson}</p>
                        </td>
                        <td className='td-item'>
                          <p className='td-lesson'>{event.resource.duration}</p>
                        </td>
                        
                        {
                        /* Do not remove this code, it will be used in the future 
                        <td className='td-item'>
                          <p className='td-topic-level'>
                            {event.level}
                          </p>
                        </td>
                        <td className='td-item'>
                          <p className='td-topic-level'>
                            {` ${event.currentTopic}`}
                          </p>
                        </td>
                        <td className='td-item'>
                          <p className='td-topic-level'>
                            {` ${event.nextTopic}`}
                          </p>
                        </td> */}
                        <td  className='td-item'>
                          <p className='td-datetime td-datetime-border ps-3'>
                            {moment(event.resource.start_at)
                              .tz(userTimezone)
                              .format('ddd, MMM Do hh:mm A')}
                            {' → '}
                            {moment(event.resource.start_at)
                              .tz(userTimezone)
                              .add(event.resource.duration, 'minutes')
                              .format('hh:mm A')}
                          </p>
                        </td>
                        <td className='td-item'>
                          <p className='td-tutor'>{event.tutor}</p>
                        </td>
                        <td className='td-item'>
                          <button
                            className={`btn ${
                              event.tutorFeedback?.length
                                ? 'btn-primary'
                                : 'btn-tutor-feedback-disabled'
                            }`}
                            onClick={handleFeedback}
                          >
                            Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {!isLoading && isCalendar && (
              <div className='mt-4'>
                <BigCalendar
                  style={{ minHeight: '70vh' }}
                  popup={true}
                  formats={formats}
                  events={calendarEvents}
                  localizer={localizer}
                  onSelectEvent={onSelectEvent}
                  views={allViews}
                  showMultiDayTimes
                  startAccessor='start'
                  endAccessor='end'
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <FeedbackLessonModal modalState='student' isOpen={isFeedbackModal} closeModal={handleClodeFeedbackModal}/>
      {isOpen && <CustomModal />}
      {isLoading && <Loader />}
      <ReviewLessonModal
        isOpen={isReviewLessonModalOpen}
        setIsOpen={setReviewLessonModal}
      />
    </Layout>
  )
}

export default Calendar
