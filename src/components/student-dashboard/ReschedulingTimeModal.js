import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const ReschedulingTimeModal = ({ setSchedule, setTabIndex, type }) => {
  const [t] = useTranslation('translation')
  const [counter, setCounter] = useState(0)
  const [dayClicked, setDayClicked] = useState(null)
  const [timeClicked, setTimeClicked] = useState(null)
  const [day, setDay] = useState()
  const [timeOfDay, setTimeOfDay] = useState({
    slotInterval: 0,
    startTime: '',
    endTime: ''
  })
  const duration = 30
  const disable = counter === 0
  const timeFormatter = 'HH:mm:ss'

  const today = moment().subtract(counter, 'week')
  const isToday = moment()
  const checkAgainstToday = moment(isToday, timeFormatter)

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
  let timeArr = []

  const morningCheck = [
    moment('00:00:00', timeFormatter),
    moment(duration === 30 ? '11:30:00' : '11:00:00', timeFormatter)
  ]

  const afternoonCheck = [
    moment(duration === 30 ? '11:30:00' : '11:00:00', timeFormatter),
    moment(duration ? '17:30:00' : '17:00:00', timeFormatter)
  ]

  const eveningCheck = [
    moment(duration ? '17:30:00' : '17:00:00', timeFormatter),
    moment(duration === 30 ? '23:30:00' : '23:00:00', timeFormatter)
  ]

  if (day) {
    const formatDay = moment(day)
    const checkIsToday = moment(formatDay.format('YYYY-MM-DD')).isSame(
      isToday.format('YYYY-MM-DD'),
      'day'
    )
    if (checkIsToday) {
      if (checkAgainstToday.isBetween(...morningCheck)) {
        timeArr.push({
          time: 'Morning',
          format: 'time'
        })
      }
      if (
        checkAgainstToday.isBetween(...morningCheck) ||
        checkAgainstToday.isBetween(...afternoonCheck)
      ) {
        timeArr.push({
          time: 'Afternoon',
          format: 'time'
        })
      }
      if (
        checkAgainstToday.isBetween(...morningCheck) ||
        checkAgainstToday.isBetween(...afternoonCheck) ||
        checkAgainstToday.isBetween(...eveningCheck)
      ) {
        timeArr.push({
          time: 'Evening',
          format: 'time'
        })
      }
    } else {
      timeArr.push(
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
      )
    }
  }

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
          setTimeOfDay({ slotInterval: duration, startTime: '', endTime: '' })
          timeArr = []
          setTimeClicked(null)
        }
      }

      if (data.format === 'time') {
        setTimeClicked(i)
        const roundUp =
          isToday.minute() || isToday.second() || isToday.millisecond()
            ? isToday.add(1, 'hour').startOf('hour')
            : isToday.startOf('hour')
        const isSame = moment(isToday.format('YYYY-MM-DD')).isSame(
          moment(day).format('YYYY-MM-DD')
        )
        if (data.time === 'Morning') {
          if (checkAgainstToday.isBetween(...morningCheck) && isSame) {
            setTimeOfDay({
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '11:30'
            })
          } else {
            setTimeOfDay({
              slotInterval: duration,
              startTime: '00:00',
              endTime: '11:30'
            })
          }
        }
        if (data.time === 'Afternoon') {
          if (checkAgainstToday.isBetween(...afternoonCheck) && isSame) {
            setTimeOfDay({
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '17:30'
            })
          } else {
            setTimeOfDay({
              slotInterval: duration,
              startTime: '12:00',
              endTime: '17:30'
            })
          }
        }
        if (data.time === 'Evening') {
          if (checkAgainstToday.isBetween(...eveningCheck) && isSame) {
            setTimeOfDay({
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '23:30'
            })
          } else {
            setTimeOfDay({
              slotInterval: duration,
              startTime: '18:00',
              endTime: '23:30'
            })
          }
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
      <div className='time-card grey-border bg-white small-card pt-2 mt-4 container'>
        <div className='ms-1'>
          <div className='col-12 ps-2'>
            <h3 className={`text-black`}>
              {moment(scheduleStartTime, [moment.ISO_8601, 'HH:mm']).format(
                'hh:mm A'
              )}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
        </div>

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
              setTabIndex(3)
            }}
          >
            {t('confirm_lesson')}
          </div>
        </div>
      </div>
    )
  }

  const AvailableSpots = () => (
    <React.Fragment>
      <h2 className='mb-2'>Available Spots</h2>
      <p className='welcome-subtitle text-purple'>
        Select one of these lesson spots to continue.
      </p>

      {allTimes.map((x, i) => (
        <ScheduleCard scheduleStartTime={x} key={i} />
      ))}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <div
        className='scroll-layout'
        style={{ width: '65vw', overflow: 'scroll' }}
      >
        <div className='flex-container'>
          <div
            className='flex-left p-0 pe-4 col-auto modal-scroll'
            style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            <div className='container'>
              <h2>{t('reschedule')}</h2>
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
                  (x, i) =>
                    x.format === 'day' && <DaySelector data={x} i={i} key={i} />
                )}
              </div>
              <div className='col-6 px-4'>
                {timeArr.map((x, i) => {
                  i = i + 10
                  if (x.format === 'time') {
                    return <DaySelector data={x} i={i} key={i} />
                  }
                })}
              </div>
            </div>
          </div>
          <div className='container flex-right col-auto modal-scroll'>
            {dayClicked !== null && timeClicked ? <AvailableSpots /> : ''}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ReschedulingTimeModal
