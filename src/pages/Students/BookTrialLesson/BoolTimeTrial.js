import React, { useEffect, useState } from 'react'
import '../../../assets/styles/dashboard.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DAYS } from '../../../constants/global'
import LeftArrow from '../../../assets/images/left-arrow.svg'
import RightArrow from '../../../assets/images/right-arrow.svg'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  addMonths,
  subMonths,
  parseISO,
  subDays
} from 'date-fns'
import { Checkbox } from '../../../components/Checkbox'
import Select from 'react-select'
import Icon2 from '../../../assets/images/sidebar/icon2.svg'

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

const hours = [7, 8, 9, 10, 11, 12]
const today = new Date()
const optionYears = [
  { value: today.getFullYear(), label: today.getFullYear() },
  { value: today.getFullYear() + 1, label: today.getFullYear() + 1 },
  { value: today.getFullYear() + 2, label: today.getFullYear() + 2 }
]

const BookTimeTrial = props => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')

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

  const onContinue = () => {
    if (selectedDateIndex === -1) return
    let date = new Date(startDate)
    date.setDate(date.getDate() + selectedDateIndex)
    date = new Date(
      date.toLocaleDateString() +
        ' ' +
        selectedHour.toString().padStart(2, '0') +
        ':00 ' +
        (isAM ? 'AM' : 'PM')
    )
    props.onContinue(date)
  }

  return (
    <div className='book-trial-lesson-layout'>
      <h4 className='main-title'>{t('book_your_trial_lesson')}</h4>
      <div className='divider' />
      <p className='description'>{t('try_trial_lesson_learn')}</p>
      <p className='description'>{t('trial_lessons_are_15mins')}</p>
      <div className='week'>
        <div className='icon' onClick={prevMonth}>
          <img src={LeftArrow} alt='' />
        </div>
        <div className='column col-center'>
          <span>
            {format(startDate, 'MMMM dd yyyy')} -{' '}
            {format(endDate, 'MMMM dd yyyy')}
          </span>
        </div>
        <div className='icon' onClick={nextMonth}>
          <img src={RightArrow} alt='' />
        </div>
      </div>
      <div className='calendar-wrapper'>
        <div className='days'>
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
        <div className='choose-by-month'>
          <div>
            <Checkbox
              label='AM'
              checked={isAM === true}
              onChange={onChangeAMPM}
            />
            <span />
            <Checkbox
              label='PM'
              checked={isAM !== true}
              onChange={onChangeAMPM}
            />
          </div>
          <div>
            <img src={Icon2} alt='' />
            <Select
              value={monthOption}
              onChange={onChangeMonth}
              options={optionMonths}
              styles={customStyles}
              placeholder={t('month')}
              classNamePrefix='custom-select'
              className='custom-select'
              name='month'
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
            <Select
              value={yearOption}
              onChange={onChangeYear}
              options={optionYears}
              styles={customStyles}
              placeholder={t('month')}
              classNamePrefix='custom-select'
              className='custom-select'
              name='year'
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
          </div>
        </div>
        <div className='hours'>
          {[0, 1, 2, 3, 4, 5, 6].map((date, dateIndex) => (
            <div key={`date_${dateIndex}`} className='col'>
              {hours.map((hour, hourIndex) => (
                <span
                  key={`date_hour_${hourIndex}_${dateIndex}`}
                  className={
                    selectedHour === hour && selectedDateIndex === dateIndex
                      ? 'selected'
                      : ''
                  }
                  onClick={() => {
                    setSelectedHour(hour)
                    setSelectedDateIndex(dateIndex)
                  }}
                >
                  <span>{hour}:00</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='btn-continue' onClick={() => onContinue()}>
        Continue
      </div>
      <p className='important-note'>
        {t('important_request_trial_teacher_when_purchase_lessons')}
      </p>
    </div>
  )
}

export default BookTimeTrial
