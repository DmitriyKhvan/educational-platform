import React, { useEffect, useState } from 'react'
import { format, utcToZonedTime } from 'date-fns-tz'

import Layout from '../../components/Layout'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns'
import '../../assets/styles/calendar.scss'
import LeftArrow from '../../assets/images/left-arrow.svg'
import RightArrow from '../../assets/images/right-arrow.svg'
import CloseIcon from '../../assets/images/close.svg'
import CurrentDateIcon from '../../assets/images/currentdate.svg'
import UpLessonNotConfirmIcon from '../../assets/images/upcominglessons_notconfirmed.svg'
import UpLessonIcon from '../../assets/images/upcominglessons.svg'
import PastLessonIcon from '../../assets/images/pastlessons.svg'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAppointments } from '../../actions/appointment'
import { getTutorInfo } from '../../actions/tutor'
import { getUserInfo } from '../../actions/user'
import ModalDateLesson from '../../components/ModalDateLesson'
import ModalCreateLesson from '../Admin/ModalCreateLesson'

const Calendar = () => {
  const [showEventsModal, setShowEventsModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [t, i18n] = useTranslation('translation')
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const loading = useSelector(state => state.appointment.loading)
  const appointments = useSelector(state => state.appointment.list)
  const [eventDates, setEventDates] = useState([])
  const [_, setRefresh] = useState(false)
  const [isShowAddLessonModal, setIsShowAddLessonModal] = useState(false)

  const dispatch = useDispatch()

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
      let eventDates = {}
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

  const header = () => {
    const dateFormat = 'MMM yyyy'
    return (
      <div className="calendar-header">
        <div className="icon" onClick={prevMonth}>
          <img src={LeftArrow} alt="" />
        </div>
        <div className="column col-center">
          <span>{format(currentDate, dateFormat)}</span>
        </div>
        <div className="icon" onClick={nextMonth}>
          <img src={RightArrow} alt="" />
        </div>
      </div>
    )
  }

  const days = () => {
    const dateFormat = 'eee'
    const days = []
    let startDate = startOfWeek(currentDate)
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="column col-center" key={i}>
          {t(format(addDays(startDate, i), dateFormat).toLowerCase())}
        </div>
      )
    }
    return <div className="days row">{days}</div>
  }

  const cells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const dateFormat = 'd'
    const rows = []
    let today = new Date()
    let days = []
    let day = startDate
    let formattedDate = ''

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)

        // const cloneDay = format(day, 'yyyy-MM-dd');
        const cloneDay = day
        let hasEvent = false

        let date = format(day, 'yyyy-MM-dd')

        // eslint-disable-next-line no-loop-func
        Object.keys(eventDates).map(item => {
          if (isSameDay(day, parseISO(item))) {
            hasEvent = true
          }
          return hasEvent
        })

        const isPast = day < today

        days.push(
          <div
            className={`column cell ${
              !isSameMonth(day, currentDate)
                ? 'disabled'
                : isSameDay(day, today)
                ? 'today'
                : ''
            } ${
              hasEvent
                ? isPast
                  ? 'past-lessons-day'
                  : 'upcoming-lessons-day'
                : 'no-event'
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay, hasEvent)}
          >
            <div>
              <span className="number">{formattedDate}</span>
              {hasEvent && <span className="divider" />}
              {hasEvent && (
                <span>
                  {eventDates[date].length}{' '}
                  {isPast ? t('past_lessons') : t('upcoming_lessons')}
                </span>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }

      rows.push(
        <div className="row" key={day}>
          {' '}
          {days}{' '}
        </div>
      )
      days = []
    }

    return <div className="body">{rows}</div>
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const onDateClick = (day, hasEvent) => {
    setSelectedDate(format(day, 'yyyy-MM-dd'))

    if (hasEvent) {
      setShowEventsModal(true)
    }
  }

  const hideModal = () => {
    setShowEventsModal(false)
  }

  return (
    <Layout>
      <div className="appointment-calendar">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4 className="main-title">{t('appointment_calendar')}</h4>
            <div className="divider" />
          </div>
          {user && user.roles && user.roles[0].role_name === 'admin' && (
            <div
              className="btn-save"
              onClick={() => {
                setIsShowAddLessonModal(true)
              }}
            >
              {t('Add')}
            </div>
          )}
        </div>
        <div className="scroll-layout">
          <div className="calendar">
            {header()}
            {days()}
            {cells()}
          </div>
          <div className="help">
            <div>
              <img src={CurrentDateIcon} alt="" />
              {t('current_date')}
            </div>
            <div>
              <img src={PastLessonIcon} alt="" />
              {t('past_lesson_s')}
            </div>
            <div>
              <img src={UpLessonIcon} alt="" />
              {t('upcoming_lesson_s')}
            </div>
          </div>
        </div>
      </div>

      {showEventsModal && (
        <ModalDateLesson
          date={selectedDate}
          visible={showEventsModal}
          onDismiss={() => setShowEventsModal(false)}
          lessonData={eventDates[selectedDate]}
          user={user}
          onChangeDate={onDateClick}
          onRefresh={() => setRefresh(true)}
        />
      )}
      {user &&
        user.roles &&
        user.roles[0].role_name === 'admin' &&
        isShowAddLessonModal && (
          <ModalCreateLesson
            visible={
              user &&
              user.roles &&
              user.roles[0].role_name === 'admin' &&
              isShowAddLessonModal
            }
            onCreate={() => {
              fetchData()
            }}
            onCancel={() => setIsShowAddLessonModal(false)}
          />
        )}
    </Layout>
  )
}

export default Calendar
