import { useEffect, useRef, useState } from 'react'
import { DAYS } from '../../../constants/global'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'
import Modal from '../../../components/Modal'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTutorInfo,
  updateExceptionDates,
  updateTutorAvailability,
  updateTutorInfo
} from '../../../actions/tutor'
import { Counter } from '../../../components/Counter'
import { Toggle } from '../../../components/Toggle'
import NotificationManager from '../../../components/NotificationManager'
import { useTranslation } from 'react-i18next'
import Layout from '../../../components/Layout'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { Checkbox } from '../../../components/Checkbox'
import { format } from 'date-fns'
import '../../../assets/styles/profile.scss'

const now = moment().hour(0).minute(0)

const formatAMPM = date => {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

const convertTimeToDate = time => {
  let today = new Date('1/1/2021 0:0 AM')
  let hours = time.split(':')[0]
  let minutes = time.split(':')[1]
  let seconds = time.split(':')[2]
  today.setHours(hours)
  today.setMinutes(minutes)
  today.setSeconds(seconds)
  return today
}

export const AvailabilityView = ({ isAdmin, user_id }) => {
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )

  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [formData, setFormData] = useState({
    checked: false
  })

  const handleDayClick = (day, { selected }) => {
    setPickedDate(selected ? undefined : day)
  }
  // Slots
  const [availabilities, setAvailabilities] = useState([])
  const [choosenDay, setChoosenDay] = useState(t(DAYS[0]))
  const [exceptions, setExceptions] = useState([])

  const handleCheck = e => {
    setFormData({ ...formData, checked: e })
    if (!e) {
      setAvailabilities([])
      setExceptions([])
      updateProfile(true)
    }
  }

  // Pick Time Slot Modal
  const [editIndex, setEditIndex] = useState(-1)
  const [isAddSlotModal, setIsAddSlotModal] = useState(false)
  const [isAddExceptionDayModal, setIsAddExceptionDayModal] = useState(false)
  const [pickedDate, setPickedDate] = useState(new Date())
  const [isTakeDayOff, setIsTakeOff] = useState(false)
  const [pickedTimes, setPickedTimes] = useState([
    {
      hour: 0,
      min: 0,
      ampm: 'AM'
    },
    {
      hour: 0,
      min: 0,
      ampm: 'AM'
    }
  ])

  const [fupdate, setFupdate] = useState(true)

  const onChangeTime = (item, value, index) => {
    if (!pickedTimes[index]) {
      pickedTimes[index] = {
        hour: 0,
        min: 0,
        ampm: 'AM'
      }
    }
    pickedTimes[index][item] = value
    setPickedTimes(pickedTimes)
  }

  const getAvailability = day => {
    if (!availabilities) return null
    let availability = availabilities.filter(slot => slot.day === day)
    if (availability.length > 0) return availability[0]
    else return null
  }
  const onAddSlot = () => {
    let availability = getAvailability(choosenDay)
    const fromTime = new Date(
      `01/01/2021 ${pickedTimes[0].hour}:${pickedTimes[0].min} ${pickedTimes[0].ampm}` ||
        now.get()
    )
    const toTime = new Date(
      `01/01/2021 ${pickedTimes[1].hour}:${pickedTimes[1].min} ${pickedTimes[1].ampm}` ||
        now.get()
    )
    if (fromTime >= toTime) {
      NotificationManager.error(t('error_choose_valid_date_range'), t)
      return
    }

    if (!availability) {
      availabilities.push({
        day: choosenDay,
        slots: []
      })
      availability = getAvailability(choosenDay)
    }
    let _slot = {
      from: fromTime,
      to: toTime
    }
    let _slots = availability.slots || []
    let index = 0
    for (let slot of _slots) {
      const { from, to } = slot
      if (index !== editIndex) {
        if (
          (from <= fromTime && to > fromTime) ||
          (from < toTime && to >= toTime)
        ) {
          NotificationManager.error(t('error_cannot_pick_overwrap_slot'), t)
          return
        }
      }
      index++
    }
    if (editIndex === -1) {
      _slots.push(_slot)
    } else {
      availability.slots[editIndex] = _slot
    }
    setAvailabilities(availabilities)
    setIsAddSlotModal(false)
  }

  const onRemoteSlot = (choosenDay, index) => {
    const { slots: _slots } = getAvailability(choosenDay)
    _slots.splice(index, 1)
    setAvailabilities(availabilities)
    setFupdate(!fupdate)
  }

  // ===================================================
  const onAddExceptionDay = () => {
    let from = isTakeDayOff
      ? undefined
      : new Date(
          `${pickedDate.toLocaleDateString()} ${pickedTimes[0].hour}:${
            pickedTimes[0].min
          } ${pickedTimes[0].ampm}`
        )
    let to = isTakeDayOff
      ? undefined
      : new Date(
          `${pickedDate.toLocaleDateString()} ${pickedTimes[1].hour}:${
            pickedTimes[1].min
          } ${pickedTimes[1].ampm}`
        )
    exceptions.push({ date: pickedDate.toLocaleDateString(), from, to })
    setExceptions(exceptions)
    setIsAddExceptionDayModal(false)
  }
  const onRemoteExceptionDate = idx => {
    setExceptions(exceptions.filter((exp, index) => index !== idx))
    setFupdate(!fupdate)
  }

  // ===================================================

  useEffect(() => {
    if (user && user.tutor_profile)
      dispatch(getTutorInfo(user.tutor_profile.id))
  }, [user])

  useEffect(() => {
    if (tutorInfo) {
      let formData_ = formData
      let checked = false
      Object.keys(tutorInfo).map(key => {
        if (key === 'availabilities') {
          let availabilities_ = tutorInfo[key] || {}
          let availabilities = Object.keys(availabilities_).map(key1 => {
            let slots = availabilities_[key1].map(slot => {
              let from = convertTimeToDate(slot.from)
              let to = convertTimeToDate(slot.to)
              return { from, to }
            })
            return {
              day: key1,
              slots: slots
            }
          })
          checked = availabilities.length > 0
          setAvailabilities(availabilities)
        } else if (key === 'exceptiondates') {
          setExceptions(
            tutorInfo['exceptiondates'].map(exception => {
              return {
                date: exception.date,
                from: exception.from
                  ? new Date(`${exception.date} ${exception.from}`)
                  : undefined,
                to: exception.to
                  ? new Date(`${exception.date} ${exception.to}`)
                  : undefined
              }
            })
          )
        } else {
          formData_ = { ...formData_, [key]: tutorInfo[key] }
        }
        setFormData({ ...formData_, checked })
      })
    }
    setFupdate(!fupdate)
  }, [tutorInfo])

  const updateProfile = async (reset = false) => {
    if (reset) {
      dispatch(updateTutorAvailability([], tutorInfo?.id))
      dispatch(updateExceptionDates([], tutorInfo?.id))
      return
    }
    let availabilities_ = []
    let exceptiondates_ = []
    for (let availability of availabilities) {
      let slots = []
      for (let slot of availability.slots) {
        slots.push({
          from:
            slot.from.getHours().toString().padStart(2, '0') +
            ':' +
            slot.from.getMinutes().toString().padStart(2, '0'),
          to:
            slot.to.getHours().toString().padStart(2, '0') +
            ':' +
            slot.to.getMinutes().toString().padStart(2, '0')
        })
      }
      availabilities_.push({
        day: availability.day,
        slots
      })
    }
    for (let exceptiondate of exceptions) {
      let exception_ = { date: exceptiondate.date, slots: [] }
      if (exceptiondate.from) {
        exception_.slots.push({
          from: format(exceptiondate.from, 'hh:mm aa'),
          to: format(exceptiondate.to, 'hh:mm aa')
        })
      }
      exceptiondates_.push(exception_)
    }
    dispatch(updateTutorAvailability(availabilities_, tutorInfo?.id))
    dispatch(updateExceptionDates(exceptiondates_, tutorInfo?.id))
  }

  const AddNewSlotModal = () => {
    return (
      <Modal
        className="add-new-slot active"
        visible={isAddSlotModal}
        onCancel={() => setIsAddSlotModal(false)}
      >
        <div className="title">
          <span>{t('from')}</span>
          <span>-</span>
          <span>{t('to')}</span>
        </div>
        <div className="labels">
          <div>
            <span>{t('hours')}</span>
            <span>{t('mins')}</span>
          </div>
          <div>
            <span>{t('hours')}</span>
            <span>{t('mins')}</span>
          </div>
        </div>
        <div className="counters">
          <div>
            <Counter
              min={0}
              max={12}
              onUpdate={value => onChangeTime('hour', value, 0)}
              initValue={pickedTimes[0].hour}
            />
            <Counter
              min={0}
              max={60}
              onUpdate={value => onChangeTime('min', value, 0)}
              initValue={pickedTimes[0].min}
            />
          </div>
          <div>
            <Counter
              min={0}
              max={12}
              onUpdate={value => onChangeTime('hour', value, 1)}
              initValue={pickedTimes[1].hour}
            />
            <Counter
              min={0}
              max={60}
              onUpdate={value => onChangeTime('min', value, 1)}
              initValue={pickedTimes[1].min}
            />
          </div>
        </div>
        <div className="toggles">
          <Toggle
            on={{ label: 'AM', value: 'AM' }}
            off={{ label: 'PM', value: 'PM' }}
            className="timer"
            onUpdate={value => onChangeTime('ampm', value, 0)}
            initValue={pickedTimes[0].ampm}
          />
          <Toggle
            on={{ label: 'AM', value: 'AM' }}
            off={{ label: 'PM', value: 'PM' }}
            className="timer"
            onUpdate={value => onChangeTime('ampm', value, 1)}
            initValue={pickedTimes[1].ampm}
          />
        </div>
        <div className="btn" onClick={onAddSlot}>
          {t('confirm')}
        </div>
      </Modal>
    )
  }

  const AddExceptionDayModal = () => {
    return (
      <Modal
        className="add-new-exception-day active"
        visible={isAddExceptionDayModal}
        onCancel={() => setIsAddExceptionDayModal(false)}
      >
        <div className="title">
          <span>Set an Exception Day</span>
        </div>

        <div className="inner-content">
          <div className="select-date">
            <p>1) Select Date</p>
            <DayPicker selectedDays={pickedDate} onDayClick={handleDayClick} />
          </div>
          <div className="select-time">
            <p>2) Select Time</p>
            <div className="inner-content">
              <div className="title">
                <span>{t('from')}</span>
                <span>-</span>
                <span>{t('to')}</span>
              </div>
              <div className="labels">
                <div>
                  <span>{t('hours')}</span>
                  <span>{t('mins')}</span>
                </div>
                <div>
                  <span>{t('hours')}</span>
                  <span>{t('mins')}</span>
                </div>
              </div>
              <div className="counters">
                <div>
                  <Counter
                    min={0}
                    max={12}
                    onUpdate={value => onChangeTime('hour', value, 0)}
                    initValue={pickedTimes[0].hour}
                  />
                  <Counter
                    min={0}
                    max={60}
                    onUpdate={value => onChangeTime('min', value, 0)}
                    initValue={pickedTimes[0].min}
                  />
                </div>
                <div>
                  <Counter
                    min={0}
                    max={12}
                    onUpdate={value => onChangeTime('hour', value, 1)}
                    initValue={pickedTimes[1].hour}
                  />
                  <Counter
                    min={0}
                    max={60}
                    onUpdate={value => onChangeTime('min', value, 1)}
                    initValue={pickedTimes[1].min}
                  />
                </div>
              </div>
              <div className="toggles">
                <Toggle
                  on={{ label: 'AM', value: 'AM' }}
                  off={{ label: 'PM', value: 'PM' }}
                  className="timer"
                  onUpdate={value => onChangeTime('ampm', value, 0)}
                  initValue={pickedTimes[0].ampm}
                />
                <Toggle
                  on={{ label: 'AM', value: 'AM' }}
                  off={{ label: 'PM', value: 'PM' }}
                  className="timer"
                  onUpdate={value => onChangeTime('ampm', value, 1)}
                  initValue={pickedTimes[1].ampm}
                />
              </div>
            </div>
            <p className="or">OR</p>
            <div className="take-off">
              <Checkbox
                checked={isTakeDayOff}
                onChange={() => {
                  setIsTakeOff(!isTakeDayOff)
                }}
                label="Take Day Off"
              />
            </div>
          </div>
        </div>
        <div className="btn" onClick={onAddExceptionDay}>
          {t('confirm')}
        </div>
      </Modal>
    )
  }

  const Slot = ({ slot, index, DAY }) => {
    return (
      <div className="slot" key={slot[0]}>
        <span>{formatAMPM(slot.from)}</span>
        <span>-</span>
        <span>{formatAMPM(slot.to)}</span>
        <div className="action">
          <span
            onClick={() => {
              setEditIndex(index)
              setChoosenDay(t(DAY))
              setIsAddSlotModal(true)
              setPickedTimes([
                {
                  hour: format(slot.from, 'hh'),
                  min: format(slot.from, 'mm'),
                  ampm: format(slot.from, 'aa')
                },
                {
                  hour: format(slot.to, 'hh'),
                  min: format(slot.to, 'mm'),
                  ampm: format(slot.to, 'aa')
                }
              ])
            }}
          >
            {t('edit')}
          </span>
          <span className="divider" />
          <span
            className="close"
            onClick={() => onRemoteSlot(t(DAY), index)}
          ></span>
        </div>
      </div>
    )
  }

  const ExceptionDate = ({ exception, index }) => {
    return (
      <div
        className="exception-day-slot"
        key={`exception - day - slot - ${index}`}
      >
        <div>{exception.date}</div>
        <div className="divider" />
        <div>
          {!exception.from ? (
            <span>not tutoring</span>
          ) : (
            <>
              <span>{formatAMPM(exception.from)}</span>
              <span>-</span>
              <span>{formatAMPM(exception.to)}</span>
              <div className="action">
                <span
                  onClick={() => {
                    setEditIndex(index)
                    setIsAddExceptionDayModal(true)
                    setPickedDate(new Date(exception.date))
                    setIsTakeOff(exception.from ? false : true)
                    setPickedTimes([
                      {
                        hour: format(exception.from, 'hh'),
                        min: format(exception.from, 'mm'),
                        ampm: format(exception.from, 'aa')
                      },
                      {
                        hour: format(exception.to, 'hh'),
                        min: format(exception.to, 'mm'),
                        ampm: format(exception.to, 'aa')
                      }
                    ])
                  }}
                >
                  {t('edit')}
                </span>
                <span className="divider" />
                <span
                  className="close"
                  onClick={() => onRemoteExceptionDate(index)}
                ></span>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="inner-wrapper">
      <Toggle
        className="available-status"
        on={{ label: t('available'), value: true }}
        off={{ label: t('not_available'), value: false }}
        isAvailability={true}
        onUpdate={handleCheck}
        initValue={formData.checked}
      />

      {!isAdmin && (
        <div className="notes">
          <p>
            <strong>{t('note')}</strong> {t('student_time_kst_request_lessons')}
          </p>
          <br />
          <p>
            <strong>{t('pst_tutors')}</strong>{' '}
            {t('pst_available_tutoring_slots')}
          </p>
          <p>
            <strong>{t('debate')}</strong>{' '}
            {t('est_available_tutoring_slots')}
          </p>
          <br />
          <p>{t('open_8hours_availability')}</p>
          <p>{t('mark_yourself_unavailable')}</p>
        </div>
      )}

      {formData.checked && (
        <>
          <p className="section-title">{t('availability_schedule')}</p>
          <div className="availabilties-wrapper">
            <div className="header">
              {DAYS.map(day => (
                <div>
                  <span key={`${day}`}>{t(day)}</span>
                </div>
              ))}
            </div>
            <div className="body">
              {DAYS.map(DAY => (
                <div className="column">
                  {getAvailability(t(DAY))?.slots.map((slot, index) => (
                    <Slot slot={slot} index={index} DAY={DAY} />
                  ))}
                  <div className="add-new-slot">
                    <div
                      className="btn"
                      onClick={() => {
                        setEditIndex(-1)
                        setChoosenDay(t(DAY))
                        setIsAddSlotModal(true)
                        setPickedTimes([
                          {
                            hour: 0,
                            min: 0,
                            ampm: 'AM'
                          },
                          {
                            hour: 0,
                            min: 0,
                            ampm: 'AM'
                          }
                        ])
                      }}
                    >
                      {t('add_more')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="section-title">{t('exception_days')}</p>
          <p className="exception-days-notes">{t('exception_days_note')}</p>
          <div className="exception-days-wrapper">
            {exceptions.map((exception, index) => (
              <ExceptionDate exception={exception} index={index} />
            ))}
            <div className="add-new-exception">
              <div
                className="btn"
                onClick={() => {
                  setEditIndex(-1)
                  setIsAddExceptionDayModal(true)
                  setPickedTimes([
                    {
                      hour: 0,
                      min: 0,
                      ampm: 'AM'
                    },
                    {
                      hour: 0,
                      min: 0,
                      ampm: 'AM'
                    }
                  ])
                }}
              >
                {t('add_more')}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="availability-footer">
        <div className="btn-update" onClick={() => updateProfile()}>
          {t('save_changes')}
        </div>
      </div>
      {/* Add Time Slot Modal */}
      <AddNewSlotModal />
      <AddExceptionDayModal />
    </div>
  )
}

export default AvailabilityView
