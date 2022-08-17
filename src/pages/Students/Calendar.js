/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import Modal from 'react-modal'
import * as moment from 'moment'
import { format, utcToZonedTime } from 'date-fns-tz'
import * as dates from '../../utils/dates'
import CalendarModal from '../../components/CalendarModal'
import Layout from '../../components/Layout'
import { getAppointments } from '../../actions/appointment'
import { getUserInfo } from '../../actions/user'
import { getStudent } from '../../actions/students'
import { cancelAppointment } from '../../actions/appointment'
import Loader from '../../components/common/Loader'

import '../../assets/styles/calendar.scss'

const Calendar = () => {
  const [t] = useTranslation('translation')
  const user = useSelector(state => state.users.user)
  const appointments = useSelector(state => state.appointment.list)
  const [isLoading, setIsLoading] = useState(true)
  const [displayTableData, setDisplayTableData] = useState([])
  const [eventDates, setEventDates] = useState([])
  const [events, setEvents] = useState([])
  const [tabluarData, setTabularData] = useState([])
  const [calendarEvent, setCalendarEvent] = useState({})
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [isCalendar, setIsCalendar] = useState(true)
  const closeModal = () => {
    setCalendarEvent({})
    setIsOpen(false)
  }
  const today = moment().unix()

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
      await dispatch(getStudent(user.student_profile.id))
      if (user && user.student_profile) {
        await dispatch(getAppointments({ student_id: user.student_profile.id }))
      }
    })()
  }, [user])

  useEffect(() => {
    setIsLoading(true)
    if (appointments) {
      const timeZone = 'Asia/Seoul'

      let eventDates = {}
      appointments.forEach(apt => {
        let start_at = new Date(apt.start_at)
        let date = format(utcToZonedTime(start_at, timeZone), 'yyyy-MM-dd')

        if (eventDates[date]) {
          eventDates[date].push(apt)
        } else {
          eventDates[date] = [apt]
        }
      })
      setEventDates(eventDates)
    }
  }, [appointments])

  useEffect(() => {
    const newEvents = []
    if (eventDates) {
      const eventKeys = Object.keys(eventDates)
      eventKeys.forEach(key => {
        for (const eventDate of eventDates[key]) {
          const date = moment(eventDate.start_at).utc(0, true).unix()
          const endEpoch = date + eventDate.duration * 60
          const start_at = moment.unix(date).utc(0, true)
          const end_at = moment.unix(endEpoch).utc(0, true)
          const iterateEvents = {
            zoomLink: eventDate.zoomlink,
            lesson: eventDate.lesson,
            start_at,
            end_at,
            type: eventDate.type,
            tutor: eventDate.tutor,
            student: eventDate.students,
            eventDate
          }

          newEvents.push(iterateEvents)
        }
      })
      setEvents(newEvents)
    }
    getAllData()
    setIsLoading(false)
  }, [eventDates])

  const getAllData = () => {
    const tablularEventData = []
    const eventKeys = Object.keys(eventDates)
    for (const eventKey of eventKeys) {
      for (const eventDate of eventDates[eventKey]) {
        const date = moment(eventDate.start_at).utc(0, true).unix()
        const tutor = eventDate.tutor
          ? eventDate.tutor.user.first_name +
            ' ' +
            eventDate.tutor.user.last_name.charAt(0).toUpperCase() +
            '.'
          : ''
        const startTime = moment.unix(date).utc(0, true).format('hh:mm a')
        const tableRow = {
          lesson:
            eventDate.lesson.type.charAt(0).toUpperCase() +
            eventDate.lesson.type.slice(1),
          topic: eventDate.lesson.description,
          level: eventDate.students[0].level,
          dateTime: {
            startTime,
            endTime: moment
              .unix(date)
              .utc(0, true)
              .add(eventDate.duration, 'minutes')
              .format('hh:mm a'),
            date: moment.unix(date).format('ddd, MMM D')
          },
          onClick: {
            date
          },
          tutor,
          tutorFeedback: eventDate.students[0].feedbacks
        }
        tablularEventData.push(tableRow)
      }
    }
    setTabularData(tablularEventData)
  }

  const onClickPastLessons = () => {
    getAllData()
    setIsCalendar(false)
    const pastData = []
    for (const pastDataArr of tabluarData) {
      if (moment(pastDataArr.onClick.date).isBefore(today)) {
        pastData.push(pastDataArr)
      }
    }
    setDisplayTableData(pastData)
  }

  const onClickUpcomingLessons = () => {
    getAllData()
    setIsCalendar(false)
    const upcomingData = []
    for (const upcomingDataArr of tabluarData) {
      if (moment(upcomingDataArr.onClick.date).isAfter(today)) {
        upcomingData.push(upcomingDataArr)
      }
    }
    setDisplayTableData(upcomingData)
  }

  const onCalendarClick = e => {
    setIsCalendar(true)
  }

  const onCancel = async id => {
    await dispatch(cancelAppointment(id))
    setIsOpen(false)
    await dispatch(getAppointments({ student_id: user.student_profile.id }))
    getAllData()
    setIsCalendar(true)
  }

  const localizer = momentLocalizer(moment)
  const allViews = ['month', 'week', 'day']
  const formats = {
    dateFormat: 'D',
    weekdayFormat: 'dddd',
    dayFormat: 'dddd D',
    timeGutterFormat: 'hA'
  }

  const onSelectEvent = e => {
    const startDate = moment(e.start).format('MM/DD/YYYY')
    const today = moment().format('MM/DD/YYYY')
    if (moment(startDate).isAfter(today)) {
      setCalendarEvent(e)
      setIsOpen(true)
    }
  }

  const calendarEvents = []
  events.forEach((_, index) => {
    calendarEvents.push({
      id: index,
      title:
        events[index].lesson.type.charAt(0).toUpperCase() +
        events[index].lesson.type.slice(1),
      start: new Date(events[index].start_at),
      end: new Date(events[index].end_at),
      resource: events[index]
    })
  })

  const CustomModal = () => {
    const [selectedEvent] = calendarEvents.filter(
      x => x.id === calendarEvent.id
    )
    const startTime = moment(selectedEvent.resource.start_at).format('LT')
    const endTime = moment(selectedEvent.resource.end_at).format('LT')
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
            time={selectedEvent.resource.start_at}
            data={selectedEvent}
            onCancel={onCancel}
          />
        </Modal>
      </div>
    )
  }

  const tableHead = [
    'Lesson',
    'Topic',
    'Level',
    'Date and Time',
    'Tutor',
    'Tutor Feedback'
  ]

  return (
    <Layout>
      <div className='children-wrapper'>
        <div className='appointment-calendar container-fluid'>
          <h1 className='title m-0 pb-4'>{t('appointment_calendar')}</h1>
          <div className='row container-fluid m-0 p-0'>
            <div className='col-auto'>
              <div className='btn-group' role='group'>
                <button
                  type='button'
                  className='btn grey-border'
                  onClick={onClickUpcomingLessons}
                >
                  <h5>{t('upcoming_lessons')}</h5>
                </button>
                <button
                  type='button'
                  className='btn grey-border'
                  onClick={onClickPastLessons}
                >
                  <h5>{t('past_lessons')}</h5>
                </button>
              </div>
            </div>
            <div className='col-auto ps-3'>
              <button
                type='button'
                className='btn grey-border'
                onClick={onCalendarClick}
              >
                <h5>{t('calendar_view')}</h5>
              </button>
            </div>
          </div>
          <div className='scroll-layout'>
            {!isLoading && !isCalendar && (
              <table className='table mt-5'>
                <thead>
                  <tr>
                    {tableHead.map(x => (
                      <th scope='col'>{x}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
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
                    .map(x => (
                      <tr className='tr-center'>
                        <td className='td-item'>
                          <p className='td-lesson'>{x.lesson}</p>
                        </td>
                        <td className='td-item'>
                          <p className='td-topic-level'>{x.topic}</p>
                        </td>
                        <td className='td-item'>
                          <p className='td-topic-level'>Level {x.level || 0}</p>
                        </td>
                        <td>
                          <p className='td-datetime td-datetime-border ps-3'>
                            {x.dateTime.date} {x.dateTime.startTime} {'→ '}
                            {x.dateTime.endTime}
                          </p>
                        </td>
                        <td className='td-item'>
                          <p className='td-tutor'>{x.tutor}</p>
                        </td>
                        <td className='td-button'>
                          <button
                            className={`btn ${
                              x.tutorFeedback.length
                                ? 'btn-primary'
                                : 'btn-tutor-feedback-disabled'
                            }`}
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
              <div className='example mt-4 px-0'>
                <BigCalendar
                  popup={true}
                  formats={formats}
                  events={calendarEvents}
                  localizer={localizer}
                  onSelectEvent={onSelectEvent}
                  max={dates.add(
                    dates.endOf(new Date(2015, 17, 1), 'day'),
                    -1,
                    'hours'
                  )}
                  views={allViews}
                  showMultiDayTimes
                  // defaultDate={new Date(2015, 3, 1)}
                  startAccessor='start'
                  endAccessor='end'
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && <CustomModal />}
      {isLoading && <Loader />}
    </Layout>
  )
}

export default Calendar
