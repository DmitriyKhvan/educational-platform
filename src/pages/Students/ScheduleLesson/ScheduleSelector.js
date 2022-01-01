import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import Layout from '../../../components/Layout'

const ScheduleSelector = ({ setTabIndex, duration, setSchedule, schedule }) => {
  const [t] = useTranslation('translation')
  const [counter, setCounter] = useState(0)
  const [dayClicked, setDayClicked] = useState(null)
  const [timeClicked, setTimeClicked] = useState(null)
  const [day, setDay] = useState()
  const [time, setTime] = useState()
  const [timeOfDay, setTimeOfDay] = useState({
    slotInterval: 0,
    startTime: '',
    endTime: ''
  })
  const disable = counter === 0
  const today = moment().subtract(counter, 'week')
  const startOfWeek = today.startOf('isoWeek')
  const startOfWeekString = startOfWeek.toString()
  const startOfWeekFormatted = startOfWeek.format('MMMM DD')
  const endOfWeek = today.endOf('isoWeek').format('MMMM DD')

  //Format the time
  const startTime = moment(timeOfDay.startTime, 'HH:mm')

  //Format the end time and the next day to it
  const endTime = moment(timeOfDay.endTime, 'HH:mm')

  const days = []
  const allTimes = []
  const timeArr = [
    {
      time: 'Morning',
      format: 'time'
    },
    {
      time: 'Afternoon',
      format: 'time'
    },
    {
      time: 'Evening',
      format: 'time'
    }
  ]

  //Loop over the times - only pushes time with 30 minutes interval
  while (startTime <= endTime) {
    allTimes.push(startTime.format('HH:mm'))

    startTime.add(timeOfDay.slotInterval, 'minutes')
  }

  for (let i = 0; i <= 6; i++) {
    const dayOfTheWeek = {
      day: moment(startOfWeekString).add(i, 'days').toString(),
      format: 'day'
    }
    days.push(dayOfTheWeek)
  }

  const DaySelector = ({ data, i }) => {
    const checkDate = () => {
      if (data.format === 'day') {
        const unixEpoch = moment(data.day).unix() * 1000
        const isBeforeToday = moment(unixEpoch).diff(moment(), 'day')
        if (isBeforeToday < 0) {
          return false
        } else {
          return true
        }
      }
      return true
    }
    const isAfterToday = checkDate()

    const isClicked = () => {
      if (data.format === 'day') {
        if (isAfterToday) {
          setDayClicked(i)
          setDay(data.day)
        }
      }
      if (data.format === 'time') {
        setTimeClicked(i)
        setTime(data.time)
        if (data.time === 'Morning') {
          setTimeOfDay({
            slotInterval: duration,
            startTime: '00:00',
            endTime: '11:30'
          })
        }
        if (data.time === 'Afternoon') {
          setTimeOfDay({
            slotInterval: duration,
            startTime: '12:00',
            endTime: '17:30'
          })
        }
        if (data.time === 'Evening') {
          setTimeOfDay({
            slotInterval: duration,
            startTime: '18:00',
            endTime: '23:30'
          })
        }
      }
    }
    return (
      <React.Fragment>
        {isAfterToday && (
          <div
            className={`day-selector text-center my-3 ${
              i === dayClicked || i === timeClicked ? 'purple-border' : ''
            }`}
            onClick={isClicked}
          >
            <h3>
              {(data.day && moment(data.day).format('dddd')) || data.time}
            </h3>
          </div>
        )}
      </React.Fragment>
    )
  }

  const ScheduleCard = ({ scheduleStartTime }) => {
    const scheduleEndTime = moment(scheduleStartTime, [
      moment.ISO_8601,
      'HH:mm'
    ])
      .add(duration, 'minutes')
      .format('hh:mm A')
    return (
      <div className={`time-card grey-border bg-white small-card pt-2 mt-4`}>
        <div className='row container ms-1'>
          <div className='col-12'>
            <h3 className={`text-black`}>
              {moment(scheduleStartTime, [moment.ISO_8601, 'HH:mm']).format(
                'hh:mm A'
              )}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
          <div className='col-3'></div>
        </div>
        <div className='row container'>
          <div className='schedule-card-col'>
            <p className={`enter-btn time-btn grey-border text-black`}>
              {moment(day).format('dddd, MMM DD')}
            </p>
          </div>
          <div className='schedule-card-col'>
            <div
              className={`enter-btn btn-primary`}
              onClick={() => {
                const formattedDay = moment(day).format('YYYY-MM-DD')
                const selectedSchedule = moment(
                  formattedDay + ' ' + scheduleStartTime
                ).toString()
                setSchedule(selectedSchedule)
                setTabIndex(2)
              }}
            >
              {t('confirm_lesson')}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AvailableSpots = () => (
    <React.Fragment>
      <div className='row container'>
        <h1 className='title'>Available Spots</h1>
        <p className='welcome-subtitle text-purple'>
          Select one of these lesson spots to continue.
        </p>
      </div>
      {allTimes.map(x => (
        <ScheduleCard scheduleStartTime={x} />
      ))}
    </React.Fragment>
  )

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='lesson-wrapper flex-left student-dashboard'>
            <div className='container'>
              <h1 className='title'>{t('schedule_lesson')}</h1>
              <p className='welcome-subtitle'>
                {t('schedule_lesson_subtitle')}
              </p>
            </div>
            <div className='row container ps-4 pe-0'>
              <div className='col-1'>
                <button
                  className='btn btn-dash-return'
                  disabled={disable}
                  onClick={() => {
                    setCounter(counter + 1)
                    setDayClicked(null)
                  }}
                >
                  ←
                </button>
              </div>
              <div className='col-10'>
                <h1 className='justify-content-center mt-0'>
                  {startOfWeekFormatted} to {endOfWeek}
                </h1>
              </div>
              <div className='col-1 ps-3'>
                <button
                  className='btn btn-dash-return'
                  onClick={() => {
                    setCounter(counter - 1)
                    setDayClicked(null)
                  }}
                >
                  →
                </button>
              </div>
            </div>
            <div className='row'>
              <div className='col-6 px-4'>
                {days.map(
                  (x, i) => x.format === 'day' && <DaySelector data={x} i={i} />
                )}
              </div>
              <div className='col-6 px-4'>
                {timeArr.map((x, i) => {
                  i = i + 10
                  if (x.format === 'time') {
                    return <DaySelector data={x} i={i} />
                  }
                })}
              </div>
            </div>
            <div className='row container pt-3'>
              <div className='col-auto'>
                <button
                  className='enter-btn btn-dash-return ms-0'
                  onClick={() => setTabIndex(0)}
                >
                  {t('back')}
                </button>
              </div>
            </div>
          </div>
          <div className='availability-wrapper flex-right student-list-appointments-wrapper'>
            {dayClicked !== null && timeClicked ? <AvailableSpots /> : ''}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleSelector
