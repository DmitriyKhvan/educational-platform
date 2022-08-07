import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import Layout from '../../../components/Layout'
import custom_back_arrow from '../../../assets/images/custom_back_arrow.svg'
import prev_arrow from '../../../assets/images/prev_arrow.svg'
import forward_arrow from '../../../assets/images/forward_arrow.svg'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { getTutorList } from '../../../actions/tutor'

const ScheduleSelector = ({
  setTabIndex,
  duration,
  setSchedule,
  tabIndex,
  schedule
}) => {
  const [t] = useTranslation('translation')
  const tutors = useSelector(state => state.tutor.list)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(0)
  const [dayClicked, setDayClicked] = useState(null)
  const [timeClicked, setTimeClicked] = useState(null)
  const [day, setDay] = useState()
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
  const timeFormatter = 'HH:mm:ss'

  const isToday = moment()
  const checkAgainstToday = moment(isToday, timeFormatter)

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
              i === dayClicked || i === timeClicked
                ? 'schedule_lesson_day'
                : 'schedule_lesson_day_unselect'
            }`}
            onClick={isClicked}
          >
            <div>
              {(data.day && moment(data.day).format('dddd')) || data.time}
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }

  const handleConfirmLesson = scheduleStartTime => {
    const formattedDay = moment(day).format('YYYY-MM-DD')
    const selectedSchedule = moment(
      formattedDay + ' ' + scheduleStartTime
    ).toString()
    setSchedule(selectedSchedule)
    dispatch(getTutorList(selectedSchedule)).then(response => {
      var tutorlist = response.payload.tutors
      if (Array.isArray(tutorlist) && tutorlist.length > 0) {
        setTabIndex(2)
      } else if (Array.isArray(tutorlist) && tutorlist.length === 0) {
        Swal.fire({
          title: 'No Tutuors Available for selected Time',
          text: '',
          icon: 'warning',
          confirmButtonColor: '#6133af',
          cancelButtonColor: '#d33'
        })
      }
    })
  }
  const ScheduleCard = ({ scheduleStartTime }) => {
    const scheduleEndTime = moment(scheduleStartTime, [
      moment.ISO_8601,
      'HH:mm'
    ])
      .add(duration, 'minutes')
      .format('hh:mm A')
    return (
      <div
        className={`time-card grey-border bg-white small-card pt-2 mt-4 media_align_width`}
      >
        <div className='row container ms-1'>
          <div className='col-12 align_schedule_texts'>
            <h3 className={`text-black change_width_schedule`}>
              {moment(scheduleStartTime, [moment.ISO_8601, 'HH:mm']).format(
                'hh:mm A'
              )}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
        </div>
        <div className='row final_width_change'>
          <div className='col'>
            <div className='schedule-card-col'>
              <p className={`enter-btn time-btn grey-border text-black`}>
                {moment(day).format('dddd, MMM DD')}
              </p>
            </div>
          </div>
          <div className='col'>
            <div className='schedule-card-col'>
              <div
                className={`enter-btn btn-primary align_button_sche_lesson`}
                onClick={() => {
                  handleConfirmLesson(scheduleStartTime)
                }}
              >
                {t('confirm_lesson')}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AvailableSpots = () => (
    <React.Fragment>
      <div className='row '>
        <h1 className='title right-con-title'>{t('available_spots')}</h1>
        <p className='welcome-subtitle right-con-subtitle'>
          {t('available_spots_subtitle')}
        </p>
      </div>
      <div className='row schedule-overflow-scroll slot-scroll col-12 media_small_width_schedule'>
        {allTimes.map((x, i) => (
          <ScheduleCard scheduleStartTime={x} key={i} />
        ))}
      </div>
    </React.Fragment>
  )

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='lesson-wrapper flex-lefts student-dashboard'>
            <div>
              <div className='container title-container'>
                <h1 className='title lelt-con'>{t('schedule_lesson')}</h1>
                <p className='welcome-subtitle left-subtitle'>
                  {t('schedule_lesson_subtitle')}
                </p>
              </div>
              <div className='row container ps-4 pe-0'>
                <div className='col-1 leftArrow'>
                  <button
                    className='btn btn-dash-return leftArrow-btn'
                    disabled={disable}
                    onClick={() => {
                      setCounter(counter + 1)
                      setDayClicked(null)
                    }}
                  >
                    <img src={prev_arrow} alt='' />
                  </button>
                </div>
                <div className='col-10'>
                  <h1 className='justify-content-center mt-0'>
                    {startOfWeekFormatted} to {endOfWeek}
                  </h1>
                </div>
                <div className='col-1 ps-0 rightArrow'>
                  <button
                    className='btn btn-dash-return rightArrow-btn'
                    onClick={() => {
                      setCounter(counter - 1)
                      setDayClicked(null)
                    }}
                  >
                    <img src={forward_arrow} alt='' />
                  </button>
                </div>
              </div>
              <div className='row customDay-select'>
                <div className='col-6 px-4'>
                  {days.map(
                    (x, i) =>
                      x.format === 'day' && <DaySelector data={x} i={i} />
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
                <div className='col-auto back-btn-container '>
                  <button
                    className='enter-btn btn-dash-return ms-0 back-btn-schedule'
                    onClick={() => setTabIndex(0)}
                  >
                    <img src={custom_back_arrow}></img>

                    <div className='ms-2'>{t('custom_back')}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='availability-wrapper flex-rights student-list-appointments-wrapper changes-container schedule_height'>
            {dayClicked !== null && timeClicked ? <AvailableSpots /> : ''}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleSelector
