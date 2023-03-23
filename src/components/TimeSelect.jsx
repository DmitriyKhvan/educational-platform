import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import Modal from './Modal'
import { useTranslation } from 'react-i18next'

const selectedDateStyle = `.DayPicker-Day--highlighted {
  background-color: orange;
  color: white;
}`

const padStart = (val, len, fill) => {
  return val.toString().padStart(len, fill)
}

const TimeSelect = ({ visible, onCancel, setTimeSelectData }) => {
  const [times, setTimes] = useState([])
  const [t, i18n] = useTranslation('translation')
  const [durations, setDurations] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('00:00 AM')
  const [selectedDuration, setSelectedDuration] = useState(-1)

  useEffect(() => {
    let times = []
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 60; j += 15) {
        let hh = padStart(i, 2, '0')
        let mm = j.toString().padStart(2, '0')
        let label = `${hh}:${mm} ${i < 12 ? 'AM' : 'PM'}`
        times.push(label)
      }
    }
    for (let i = 1; i < 12; i++) {
      for (let j = 0; j < 60; j += 15) {
        let hh = padStart(i, 2, '0')
        let mm = j.toString().padStart(2, '0')
        let label = `${hh}:${mm} PM`
        times.push(label)
      }
    }
    let durations = [{ label: 'ANY LENGTH', value: -1 }]
    for (let i = 1; i < 9; i++) {
      let label = i * 15 + ' MINUTES'
      durations.push({ label, value: i * 15 })
    }
    setTimes(times)
    setDurations(durations)
  }, [])

  const handleDayClick = day => {
    setSelectedDate(new Date(day))
  }
  return (
    <Modal
      className='time-select-wrapper'
      visible={visible}
      onCancel={onCancel}
    >
      <div className='body'>
        <div>
          <style>{selectedDateStyle}</style>
          <DayPicker
            onDayClick={handleDayClick}
            modifiers={{ highlighted: selectedDate }}
          />
        </div>
        <div className='right'>
          <div className='start-at'>
            <p>{t('time')}</p>
            <div className='times'>
              {times.map((time, index) => (
                <span
                  key={index}
                  className={time === selectedTime ? 'active' : ''}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
          <div className='lesson-length'>
            <p>{t('lesson_length')}</p>
            <div className='durations'>
              {durations.map((duration, index) => (
                <span
                  key={index}
                  className={
                    duration.value === selectedDuration ? 'active' : ''
                  }
                  onClick={() => setSelectedDuration(duration.value)}
                >
                  {duration.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className='selected-time mobile'>
        {selectedDate.toLocaleDateString() + ' ' + selectedTime}
      </p>
      <div className='footer'>
        <div
          className='btn outlined'
          onClick={() => {
            setSelectedDate(new Date())
            setSelectedTime('00:00 AM')
            setSelectedDuration(-1)
          }}
        >
          {t('clear')}
        </div>
        <p className='selected-time desktop'>
          {selectedDate.toLocaleDateString() + ' ' + selectedTime}
        </p>
        <div
          className='btn'
          onClick={() => {
            let start_at = new Date(
              `${selectedDate.toLocaleDateString()} ${selectedTime}`
            )
            setTimeSelectData(start_at, selectedDuration)
            onCancel()
          }}
        >
          {t('apply')}
        </div>
      </div>
    </Modal>
  )
}

export default TimeSelect
