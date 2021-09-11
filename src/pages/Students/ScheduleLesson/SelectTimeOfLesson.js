import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from 'react-loader-spinner'
import {
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  setHours,
  setMinutes,
  setSeconds,
  isAfter
} from 'date-fns'
import { format } from 'date-fns-tz'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'

import '../../../assets/styles/dashboard.scss'
import { DAYS, getTimezoneValue } from '../../../constants/global'
import LeftArrow from '../../../assets/images/left-arrow.svg'
import RightArrow from '../../../assets/images/right-arrow.svg'
import { Checkbox } from '../../../components/Checkbox'
import Icon2 from '../../../assets/images/sidebar/icon2.svg'
import { getTutorInfo } from '../../../actions/tutor'
import ImgArrowBack from '../../../assets/images/arrow_back.svg'

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

const hours = []
for (let i = 0; i < 24; i++) {
  hours.push(i)
}

const fullHours = []
for (let i = 0; i < 48; i++) {
  fullHours.push(i)
}

const today = new Date()
const optionYears = [
  { value: today.getFullYear(), label: today.getFullYear() },
  { value: today.getFullYear() + 1, label: today.getFullYear() + 1 },
  { value: today.getFullYear() + 2, label: today.getFullYear() + 2 }
]

const SelectTimeOfLesson = ({
  isTimeFirst,
  onContinue,
  selectedTutor,
  onBack
}) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')

  const user = useSelector(state => state.users.user)

  const optionMonths = [
    { value: 'january', label: t('january') },
    { value: 'february', label: t('february') },
    { value: 'march', label: t('march') },
    { value: 'april', label: t('april') },
    { value: 'may', label: t('may') },
    { value: 'june', label: t('june') },
    { value: 'july', label: t('july') },
    { value: 'august', label: t('august') },
    { value: 'september', label: t('september') },
    { value: 'october', label: t('october') },
    { value: 'november', label: t('november') },
    { value: 'december', label: t('december') }
  ]

  const [currentDate, setCurrentDate] = useState(new Date())
  const [startDate, setStartDate] = useState(-1)
  const [endDate, setEndDate] = useState(-1)
  const [isAM, setIsAM] = useState(true)
  const [monthOption, setMonthOption] = useState(
    optionMonths[currentDate.getMonth()]
  )
  const [yearOption, setYearOption] = useState(optionYears[0])
  const [selectedHour, setSelectedHour] = useState(-1)
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1)
  const tutor = useSelector(state => state.tutor.info)
  const loading = useSelector(state => state.tutor.loading)

  const [availableHours, setAvailableHours] = useState()

  useEffect(() => {
    if (selectedTutor) {
      dispatch(getTutorInfo(selectedTutor.id))
    }
  }, [selectedTutor])

  useEffect(() => {
    if (!isTimeFirst) {
      // dispatch(getTutorInfo(selectedTutor.id));
      // setAvailableHours([hours, hours, hours, hours, hours, hours, hours]);
    } else {
      if (startDate !== -1) {
        let availableHours = []
        let minAvailableTime = addDays(new Date(), 2)
        while (availableHours.length < 7) {
          let dayAvailableHours = []
          let s = addDays(startDate, availableHours.length)

          for (let h of fullHours) {
            s = setHours(s, Math.floor(h / 2))
            s = setMinutes(s, (h % 2) * 30)
            s = setSeconds(s, 0)

            if (isAfter(s, minAvailableTime)) {
              dayAvailableHours.push(h)
            }
          }

          availableHours.push(dayAvailableHours)
        }

        setAvailableHours(availableHours)
      }
    }
  }, [dispatch, startDate])

  useEffect(() => {
    if (tutor && user && startDate !== -1) {
      if (Object.keys(tutor.availabilities).length === 0) {
        // tutor is not available now.
        setAvailableHours([[], [], [], [], [], [], []])
        return
      }
      let minAvailableTime = addDays(new Date(), 2)
      // set default as UTC time zone.
      let userTimeZone = getTimezoneValue(user.time_zone || 'UTC+0')
      let tutorTimezone = getTimezoneValue(tutor.user.time_zone || 'UTC+0')
      let diffTimezone = userTimeZone - tutorTimezone

      let newAvailableHours = [[], [], [], [], [], [], []]

      for (let tDay in tutor.availabilities) {
        let idx = DAYS.indexOf(tDay.toLocaleLowerCase())
        for (let time of tutor.availabilities[tDay]) {
          try {
            let [hours, minutes, _seconds] = time.from.split(':')
            let from = Math.ceil(
              ((hours || 0) * 60 + (minutes || 0) * 1 + diffTimezone) / 30
            )

            ;[hours, minutes, _seconds] = time.to.split(':')
            let to = Math.ceil(
              ((hours || 0) * 60 + (minutes || 0) * 1 + diffTimezone) / 30
            )

            let prevIdx = idx - 1
            if (prevIdx < 0) {
              prevIdx += 7
            }
            let nextIdx = (idx + 1) % 7

            for (let t = from; t < to; t += 1) {
              let targetIdx = idx
              let newT = t
              if (t < 0) {
                newT = t + 48
                targetIdx = prevIdx
              } else if (t > 48) {
                newT = t - 48
                targetIdx = nextIdx
              }

              let s = addDays(startDate, targetIdx)
              s = setHours(s, Math.floor(newT / 2))
              s = setMinutes(s, (newT % 2) * 30)
              s = setSeconds(s, 0)

              if (
                !newAvailableHours[targetIdx].includes(newT) &&
                isAfter(s, minAvailableTime)
              ) {
                newAvailableHours[targetIdx].push(newT)
              }
            }
          } catch (e) {
            console.error('Converting Issue:', e)
            continue
          }
        }
      }
      setAvailableHours(newAvailableHours)
    }
  }, [tutor, user, startDate])

  useEffect(() => {
    setStartDate(startOfWeek(currentDate, 0))
    setEndDate(endOfWeek(currentDate, 0))
  }, [currentDate])

  const nextMonth = () => {
    let newDate = addDays(currentDate, 7)
    setCurrentDate(newDate)
    setMonthOption(optionMonths[newDate.getMonth()])
    setYearOption(
      optionYears.find(year => year.value === newDate.getFullYear())
    )
    setSelectedDateIndex(-1)
    setSelectedHour(-1)
  }

  const prevMonth = () => {
    let newDate = subDays(currentDate, 7)
    setCurrentDate(newDate)
    setMonthOption(optionMonths[newDate.getMonth()])
    setYearOption(
      optionYears.find(year => year.value === newDate.getFullYear())
    )
    setSelectedDateIndex(-1)
    setSelectedHour(-1)
  }

  const onChangeAMPM = half => {
    setIsAM(!isAM && half === 'AM')
    setSelectedDateIndex(-1)
    setSelectedHour(-1)
  }

  const onChangeMonth = e => {
    setMonthOption(e)
    setSelectedDateIndex(-1)
    setSelectedHour(-1)
    setCurrentDate(new Date(`${e.value} 1 ${yearOption.value}`))
  }

  const onChangeYear = e => {
    setYearOption(e)
    setSelectedDateIndex(-1)
    setSelectedHour(-1)
    setCurrentDate(new Date(`${monthOption.value} 1 ${e.value}`))
  }

  const onClickContinue = () => {
    if (selectedDateIndex === -1) return
    let date = new Date(startDate)
    date.setDate(date.getDate() + selectedDateIndex)

    const hour = Math.floor(selectedHour / 2)
    // onContinue(
    //   `${date.getFullYear()}-${(date.getMonth() + 1)
    //     .toString()
    //     .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${(isAM
    //     ? hour
    //     : hour + 12
    //   )
    //     .toString()
    //     .padStart(2, "0")}:${selectedHour % 2 === 0 ? "00" : "30"}:00`
    // );
    date = new Date(
      `${date.toLocaleDateString()} ${hour.toString().padStart(2, '0')}:${
        selectedHour % 2 === 0 ? '00' : '30'
      } ${isAM ? 'AM' : 'PM'}`
    )
    onContinue(date)
  }

  return (
    <div className="select-time-of-lesson">
      <h4 className="main-title">{t('select_lesson_time')}</h4>
      <div className="btn-step-back" onClick={onBack}>
        <img src={ImgArrowBack} alt="" />
        <span>{t('step_back')}</span>
      </div>
      <div className="divider" />
      <div className="week">
        <div className="icon" onClick={prevMonth}>
          <img src={LeftArrow} alt="" />
        </div>
        <div className="column col-center">
          <span>
            {format(startDate, 'MMMM dd yyyy')} -{' '}
            {format(endDate, 'MMMM dd yyyy')}
          </span>
        </div>
        <div className="icon" onClick={nextMonth}>
          <img src={RightArrow} alt="" />
        </div>
      </div>
      <div className="calendar-wrapper">
        <div className="days">
          {DAYS.map((day, index) => {
            let date = new Date(startDate)
            date = addDays(date, index)
            return (
              <div key={`days-${index}`}>
                <span key={`day-${day}`}>{t(day)}</span>
                <span key={`date-${day}`}>{date.getDate()}</span>
              </div>
            )
          })}
        </div>
        <div className="choose-by-month">
          <div>
            <Checkbox
              label="AM"
              checked={isAM === true}
              onChange={onChangeAMPM}
            />
            <span />
            <Checkbox
              label="PM"
              checked={isAM !== true}
              onChange={onChangeAMPM}
            />
          </div>
          <div>
            <img src={Icon2} alt="" />
            <Select
              value={monthOption}
              onChange={onChangeMonth}
              options={optionMonths}
              styles={customStyles}
              placeholder={t('month')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="month"
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
            <Select
              value={yearOption}
              onChange={onChangeYear}
              options={optionYears}
              styles={customStyles}
              placeholder={t('month')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="year"
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
          </div>
        </div>
        {availableHours && (
          <div className="hours">
            {[0, 1, 2, 3, 4, 5, 6].map((date, dateIndex) => (
              <div key={`date_${dateIndex}`} className="col">
                {hours.map((hour, hourIndex) => {
                  let isavaiable = availableHours[date].includes(
                    isAM ? hour : hour + 24
                  )
                  let classname = ''
                  if (!isavaiable) {
                    classname = 'disabled'
                  } else if (
                    selectedHour === hour &&
                    selectedDateIndex === dateIndex
                  ) {
                    classname = 'selected'
                  }
                  return (
                    <span
                      className={classname}
                      key={`date_hour_${hourIndex}_${dateIndex}`}
                      onClick={() => {
                        if (isavaiable) {
                          setSelectedHour(hour)
                          setSelectedDateIndex(dateIndex)
                        }
                      }}
                    >
                      <span>
                        {Math.floor(hour / 2)}:{hour % 2 === 0 ? '00' : '30'}
                      </span>
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="btn-continue" onClick={() => onClickContinue()}>
        {t('continue')}
      </div>

      {loading && (
        <div className="loading">
          <div className="trans-bg" />
          <Loader
            className="align-center"
            type="Audio"
            color="#00BFFF"
            height={50}
            width={50}
          />
        </div>
      )}
    </div>
  )
}

export default SelectTimeOfLesson
