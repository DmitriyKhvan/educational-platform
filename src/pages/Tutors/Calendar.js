/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { format, utcToZonedTime } from 'date-fns-tz'
import * as dates from '../../utils/dates'
import Layout from '../../components/Layout'
import { getAppointments } from '../../actions/appointment'
import { getTutorInfo } from '../../actions/tutor'
import { getUserInfo } from '../../actions/user'
import LessonTable from '../../components/tutor-dashboard/LessonTable'
import NotificationManager from '../../components/NotificationManager'
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png'
import ZoomWarningModal from '../../components/student-dashboard/ZoomWarningModal'

import '../../assets/styles/calendar.scss'
import AppointmentApi from '../../api/AppointmentApi'

const Calendar = () => {
  const [t] = useTranslation('translation')
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const appointments = useSelector(state => state.appointment.list)
  const [eventDates, setEventDates] = useState([])
  const [events, setEvents] = useState([])
  const [tabularData, setTabularData] = useState([])
  const [isCalendar, setIsCalendar] = useState(true)
  const [isUpcoming, setIsUpcoming] = useState(true)
  const [calendarEvent, setCalendarEvent] = useState({})
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false)
  const [isWarningOpen, setIsWarningOpen] = useState(false)

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
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    }
  }

  const localizer = momentLocalizer(moment)
  const allViews = ['month', 'week', 'day']
  const formats = {
    dateFormat: 'D',
    weekdayFormat: 'dddd',
    dayFormat: 'dddd D',
    timeGutterFormat: 'hA'
  }
  const fetchData = () => {
    dispatch(getAppointments({ tutor_id: tutor?.id }))
  }

  useEffect(() => {
    dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (user && user.tutor_profile && !tutor) {
      dispatch(getTutorInfo(user.tutor_profile.id))
    }

    if (user && user.roles && user.roles[0].role_name === 'admin') {
      fetchData()
    }
  }, [user])

  useEffect(() => {
    if (tutor && tutor.id) {
      fetchData()
    }
  }, [tutor])

  useEffect(() => {
    if (appointments) {
      const eventDates = {}
      const timeZone = 'Asia/Seoul'
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
  }, [eventDates])

  const getAllData = () => {
    const tabularEventData = []
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
        const tableRow = {
          lesson:
            eventDate.lesson.type.charAt(0).toUpperCase() +
            eventDate.lesson.type.slice(1),
          topic: eventDate.lesson.description,
          level: eventDate.students[0].level || 0,
          dateTime: {
            startTime: moment(eventDate.start_at)
              .utc(0, true)
              .format('hh:mm a'),
            endTime: moment(eventDate.start_at)
              .add(eventDate.duration, 'minutes')
              .utc(0, true)
              .format('hh:mm a'),
            date: moment(eventDate.start_at).format('ddd, MMM D')
          },
          onClick: {
            date
          },
          tutor,
          tutorFeedback: eventDate.students[0].feedbacks,
          student:
            eventDate.students[0].user.first_name +
            ' ' +
            eventDate.students[0].user.last_name.charAt(0).toUpperCase() +
            '.'
        }
        tabularEventData.push(tableRow)
      }
    }
    setTabularData(tabularEventData)
  }

  const onClickPastLessons = () => {
    getAllData()
    setIsUpcoming(false)
    setIsCalendar(false)
  }

  const onClickUpcomingLessons = () => {
    getAllData()
    setIsUpcoming(true)
    setIsCalendar(false)
  }

  const onCalendarClick = () => {
    setIsCalendar(true)
  }

  const onSelectEvent = e => {
    const startDate = moment(e.start).format('MM/DD/YYYY')
    const today = moment().format('MM/DD/YYYY')
    if (moment(startDate).isAfter(today)) {
      setCalendarEvent(e)
      setIsCalendarModalOpen(true)
    }
  }

  const closeCalendarModal = () => {
    setCalendarEvent({})
    setIsCalendarModalOpen(false)
  }

  const closeCancelLessonModal = () => {
    setIsCancelLessonModalOpen(false)
  }

  const onCancelLessonClick = () => {
    setIsCalendarModalOpen(false)
    setIsCancelLessonModalOpen(true)
  }

  const onCancel = async () => {
    const [selectedEvent] = calendarEvents.filter(
      x => x.id === calendarEvent.id
    )

    const { id } = selectedEvent.resource.eventDate
    try {
      await AppointmentApi.cancelAppointment(id)
      fetchData()
    } catch (error) {
      NotificationManager.error(
        error.response?.data?.message || 'Server Issue',
        t
      )
    } finally {
      closeCalendarModal()
      closeCancelLessonModal()
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
  Modal.setAppElement('#root')

  const CustomModal = () => {
    const today = moment()
    const [selectedEvent] = calendarEvents.filter(
      x => x.id === calendarEvent.id
    )
    console.log(selectedEvent)
    const { eventDate } = selectedEvent.resource
    const [students] = eventDate.students
    const studentLessonLevel = students.level || 0
    const studentAvatar = students.avatar
    const displayStudentAvatar = studentAvatar
      ? studentAvatar
      : students.user.gender === 'male'
      ? maleAvatar
      : femaleAvatar
    const startTimeEpoch = moment(selectedEvent.resource.start_at).utc(0, true)

    const oneMinuteAfterStart = moment(startTimeEpoch).add(60, 'minute')
    const fiveMinutesBefore = moment(startTimeEpoch).subtract(10, 'minutes')

    const isBetween = moment(today).isBetween(
      fiveMinutesBefore,
      oneMinuteAfterStart
    )
    const joinLesson = async () => {
      if (isBetween) {
        window.location.href = eventDate.zoomlink.url
      } else {
        setIsWarningOpen(true)
      }
    }
    return (
      <div style={{ zIndex: 9999 }} className='container'>
        <Modal
          isOpen={isCalendarModalOpen}
          onRequestClose={closeCalendarModal}
          style={customStyles}
          contentLabel='Tutor Calendar Event'
        >
          <div
            className='container page-card grey-border bg-white pt-2 mt-4 p-4'
            style={{ width: '30vw' }}
          >
            <div className='px-4'>
              <div className='row'>
                <div className='col-10 mx-2 ps-2'>
                  <h1>
                    <strong>{selectedEvent.title}</strong>
                  </h1>
                </div>
                <div className='col-1'>
                  <button
                    style={{ backgroundColor: 'white' }}
                    onClick={closeCalendarModal}
                  >
                    <h1>
                      <i className='fa-solid fa-xmark text-secondary'></i>
                    </h1>
                  </button>
                </div>
              </div>

              <div className='ps-3'>
                <div className='my-3'>
                  <div className='row'>
                    <h4 className='text-primary'>
                      {moment(selectedEvent.resource.start_at)
                        .utc(0, true)
                        .format('hh:mm a')}{' '}
                      -{' '}
                      {moment(selectedEvent.resource.start_at)
                        .add(
                          selectedEvent.resource.eventDate.duration,
                          'minutes'
                        )
                        .utc(0, true)
                        .format('hh:mm a')}
                    </h4>
                  </div>
                  <div className='row'>
                    <h4>
                      {moment(selectedEvent.resource.start_at).format(
                        'dddd, MMMM DD'
                      )}
                    </h4>
                  </div>
                </div>

                <div className='my-3'>
                  <div className='row'>
                    <h4 className='text-primary'>{t('current_topic')}</h4>
                  </div>
                  <div className='row'>
                    <h4>
                      {t('tutor_calendar_current_topic', {
                        level: studentLessonLevel,
                        current_topic: eventDate.lesson_topic
                      })}
                    </h4>
                  </div>
                </div>

                <div className='my-3'>
                  <div className='row'>
                    <h4 className='text-primary'>{t('previous_topic')}</h4>
                  </div>
                  <div className='row'>
                    <h4>
                      {t('tutor_calendar_previous_topic', {
                        level: studentLessonLevel,
                        previous: eventDate.last_part_lesson
                      })}
                    </h4>
                  </div>
                </div>

                <div className='my-3'>
                  <div className='row'>
                    <h4 className='text-primary'>{t('attendants')}</h4>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-4 me-3'>
                      <img
                        src={displayStudentAvatar}
                        alt='Student Avatar'
                        className='img-fluid rounded-corners'
                      />
                    </div>
                    <div className='col-4'>
                      <img
                        src={eventDate.tutor.user.avatar}
                        alt='Tutor Avatar'
                        className='img-fluid rounded-corners'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <a
                  className='btn col-5 btn-primary enter-btn me-4'
                  onClick={joinLesson}
                  target='_blank'
                  rel='noreferrer'
                >
                  {t('start_lesson')}
                </a>

                <button
                  className='btn col-5 enter-btn'
                  onClick={onCancelLessonClick}
                >
                  {t('cancel_lesson')}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  const CancelLessonModal = () => {
    return (
      <div style={{ zIndex: 9999 }} className='container'>
        <Modal
          isOpen={isCancelLessonModalOpen}
          onRequestClose={closeCancelLessonModal}
          style={customStyles}
          contentLabel='Tutor Calendar Event'
        >
          <div
            className='container page-card grey-border bg-white pt-2 mt-4 p-4'
            style={{ width: '40vw' }}
          >
            <div className='px-4 pt-3'>
              <div className='row'>
                <h1 className='text-primary mb-2'>
                  {t('lesson_cancellation')}
                </h1>
              </div>
              <div className='row'>{t('please_read_the_following')}</div>
              <div className='row mt-4'>
                <h2 className='mb-2'>{t('warning')}</h2>
              </div>
              <div className='row'>
                <p>{t('cancellation_policy_notice')}</p>
              </div>
              <div className='row'>
                <ul>
                  <li>{t('cancellation_policy_tutor_one')}</li>
                  <li>{t('cancellation_policy_tutor_two')}</li>
                </ul>
              </div>
              <div className='row'>
                <button
                  className='btn btn-primary enter-btn m-0'
                  onClick={onCancel}
                >
                  {t('cancel_lesson')}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <Layout>
      <div className='container-fluid p-5'>
        <div className='row container-fluid m-0 p-0'>
          <div className='col-auto'>
            <h1 className='title m-0 pe-3'>{t('lessons')}</h1>
          </div>
          <div className='col-auto pt-1'>
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
          <div className='col-auto ps-3 pt-1'>
            <button
              type='button'
              className='btn grey-border'
              onClick={onCalendarClick}
            >
              <h5>{t('calendar_view')}</h5>
            </button>
          </div>
        </div>

        <div className='scroll-layout mt-4 px-0'>
          {isCalendar ? (
            <div className='example'>
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
                startAccessor='start'
                endAccessor='end'
              />
            </div>
          ) : (
            <LessonTable isUpcoming={isUpcoming} tabularData={tabularData} />
          )}
        </div>
      </div>
      {isCalendarModalOpen && <CustomModal />}
      {isCancelLessonModalOpen && <CancelLessonModal />}
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={onCancel}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </Layout>
  )
}

export default Calendar
