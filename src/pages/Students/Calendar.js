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
import '../../assets/styles/calendar.scss'
import { getAppointments } from '../../actions/appointment'
import { getUserInfo } from '../../actions/user'
import { getStudent } from '../../actions/students'

const Calendar = () => {
  const [t] = useTranslation('translation')
  const user = useSelector(state => state.users.user)
  const student = useSelector(state => state.students.student_info)
  const loading = useSelector(state => state.appointment.loading)
  const appointments = useSelector(state => state.appointment.list)
  const [eventDates, setEventDates] = useState([])
  const [events, setEvents] = useState([])
  const [tabluarData, setTabularData] = useState([])
  const [calendarEvent, setCalendarEvent] = useState({})
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [isCalendar, setIsCalendar] = useState(false)
  const closeModal = () => {
    setCalendarEvent({})
    setIsOpen(false)
  }

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
    if (user && user.student_profile) {
      dispatch(getStudent(user.student_profile.id))
      dispatch(getAppointments({ student_id: user.student_profile.id }))
    }
  }, [user])

  useEffect(() => {
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
          const date = moment(eventDate.start_at).unix()
          const endEpoch = date + eventDate.duration * 60
          const start_at = moment.unix(date).format('LLLL')
          const end_at = moment.unix(endEpoch).format('LLLL')
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
  }, [eventDates])

  const getAllData = () => {
    const tablularEventData = []
    const eventKeys = Object.keys(eventDates)
    eventKeys.forEach(key => {
      for (const eventDate of eventDates[key]) {
        const date = moment(eventDate.start_at).unix()
        const endEpoch = date + eventDate.duration * 60
        const tutor = eventDate.tutor
          ? eventDate.tutor.user.first_name +
            ' ' +
            eventDate.tutor.user.last_name.charAt(0).toUpperCase() +
            '.'
          : ''
        const tableRow = {
          lesson:
            eventDate.lesson.type.charAt(0).toUpperCase() +
            eventDate.lesson.type.slice(1),
          topic: eventDate.lesson.description,
          level: eventDate.students[0].level,
          dateTime: {
            startTime: moment.unix(date).format('LT'),
            endTime: moment.unix(endEpoch).format('LT'),
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
    })
    setTabularData(tablularEventData)
  }

  const onClickPastLessons = e => {
    setIsCalendar(false)
    const today = moment().unix()
    const pastData = []
    for (const pastDataArr of tabluarData) {
      if (moment(pastDataArr.onClick.date).isBefore(today)) {
        pastData.push(pastDataArr)
      }
    }
    setTabularData(pastData)
  }

  const onClickAllLessons = e => {
    setIsCalendar(false)
    getAllData()
  }

  const onCalendarClick = e => {
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

  const onSelectEvent = async e => {
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
                  onClick={onClickAllLessons}
                >
                  <h5>{t('all_lessons')}</h5>
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
            <div className='ps-3 col-auto'>
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
            {!isCalendar && (
              <table className='table mt-5'>
                <thead>
                  <tr>
                    {tableHead.map(x => (
                      <th scope='col'>{x}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tabluarData.map(x => (
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
            {isCalendar && (
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
    </Layout>
  )
}

export default Calendar
