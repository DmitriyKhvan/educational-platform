import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'

import Modal from '../../components/Modal'
import { renderFormField, renderSelect } from '../../components/Global'
import TutorApi from '../../api/TutorApi'
import NotificationManager from '../../components/NotificationManager'
import StudentApi from '../../api/StudentApi'
import AppointmentApi from '../../api/AppointmentApi'
import { timezones } from '../../constants/global'

const recurrenceOptions = [
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Montly',
    value: 'monthly'
  },
  {
    label: 'Every Weekday',
    value: 'everyweekday'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
]

const ModalCreateLesson = ({ visible, onCreate, onCancel }) => {
  const [t, i18n] = useTranslation('translation')

  const [loading, setLoading] = useState(0)

  const [lessonTypes, setLessonTypes] = useState([])

  const [formData, setFormData] = useState({
    seat_count: 1,
    start_at: null,
    recurrenceTimes: 6
  })

  const [selectedTutor, setSelectedTutor] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedLessonType, setSelectedLessonType] = useState(null)
  const [selectedTimezone, setSelectedTimezone] = useState({
    label: '(UTC+09:00) Seoul',
    value: 'UTC+9'
  })

  const [isRecurrence, setIsRecurrence] = useState('onetime')
  const [selectedRecurrence, setSelectedRecurrence] = useState(null)

  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])

  const [formDataError, setFormDataError] = useState({
    seat_count: null,
    start_at: null,
    lessonType: null,
    duration: null,
    students: null,
    tutor: null,
    timezone: null
  })

  const onSave = async () => {
    if (!selectedTutor) {
      setFormDataError({
        tutor: 'You should select an tutor for this lesson.'
      })
      return
    }

    if (!selectedLessonType) {
      setFormDataError({
        lessonType: 'You should select an lesson type for this lesson.'
      })
      return
    }

    if (!selectedDuration) {
      setFormDataError({
        duration: 'You should select an duration for this lesson.'
      })
      return
    }

    try {
      await AppointmentApi.createAppointment({
        ...formData,
        students: selectedStudents.length
          ? selectedStudents.map(s => s.value)
          : undefined,
        tutor_id: selectedTutor?.value,
        duration: selectedDuration.value,
        lesson_id: selectedLessonType.value,
        recurrence:
          isRecurrence && selectedRecurrence?.value
            ? selectedRecurrence?.value
            : undefined,
        timezone: selectedTimezone.value
      })
      onCreate()
      onClose()
    } catch (e) {
      NotificationManager.error(e.response?.data?.message, t)
    }
  }

  const handleChange = (option, key) => {
    setFormData({
      ...formData,
      [key]: option
    })
  }

  const handleTutorSelect = option => {
    setSelectedTutor(option)
    if (formDataError.tutor) {
      setFormDataError({
        tutor: null
      })
    }
  }

  const handleLessonTypeSelect = option => {
    setSelectedLessonType(option)
    if (formDataError.lessonType) {
      setFormDataError({
        lessonType: null
      })
    }
  }

  const handleDurationSelect = option => {
    setSelectedDuration(option)
    if (formDataError.duration) {
      setFormDataError({
        duration: null
      })
    }
  }

  const handleTimezoneSelect = option => {
    setSelectedTimezone(option)
  }

  const handleRecurrenceSelect = option => {
    setSelectedRecurrence(option)
  }

  const handleStudentsSelect = options => {
    if (options.length > formData.seat_count) {
      setFormDataError({
        students: 'You should have to increase the seat_count'
      })
    } else {
      if (formDataError.students) {
        setFormDataError({
          students: null
        })
      }
      setSelectedStudents(options)
    }
  }

  const fetchAvailableTutors = async () => {
    try {
      setTutors([])
      setSelectedTutor(null)

      setLoading(loading + 1)
      let { data } = await TutorApi.getTutorList(
        formData.start_at,
        selectedTimezone.value
      )
      setTutors(data.tutors)
    } catch (e) {
      NotificationManager.error(e.response?.data?.message, t)
    }
    setLoading(loading - 1)
  }

  const fetchAvailableStudents = async () => {
    try {
      setStudents([])
      setSelectedTutor(null)

      setLoading(loading + 1)
      let { data } = await StudentApi.getAvailableStudents(formData.start_at)
      setStudents(data.students)
    } catch (e) {
      NotificationManager.error(e.response?.data?.message, t)
    }
    setLoading(loading - 1)
  }

  const fetchLessons = async () => {
    try {
      setLoading(loading + 1)

      let { data } = await AppointmentApi.fetchLessonTypes()

      setLessonTypes(data.lessons)
    } catch (e) {
      NotificationManager.error(e.response?.data?.message, t)
    }

    setLoading(loading - 1)
  }

  const onClose = () => {
    setFormData({
      seat_count: 1,
      start_at: null
    })

    setSelectedTutor(null)
    setSelectedDuration(null)
    setSelectedStudents([])
    setSelectedLessonType(null)
    onCancel()
  }

  useEffect(() => {
    if (formData.start_at) {
      fetchAvailableTutors()
      fetchAvailableStudents()
    }
  }, [formData.start_at, selectedTimezone])

  useEffect(() => {
    fetchLessons()
  }, [])

  return (
    <Modal visible={visible} className="create-lesson" onCancel={onClose}>
      <div className="title">{t('create_lesson')}</div>
      {loading > 0 ? (
        <Loader
          className="align-center"
          type="Audio"
          color="#00BFFF"
          height={50}
          width={50}
        />
      ) : (
        <div className="form-section">
          {renderSelect(
            'lesson_type',
            t('lesson_type'),
            t('select_lesson_type'),
            lessonTypes.map(t => ({
              value: t.id,
              label: t.type
                ? t.type.charAt(0).toUpperCase() + t.type.slice(1)
                : ''
            })),
            selectedLessonType,
            handleLessonTypeSelect,
            undefined,
            formDataError.lessonType
          )}
          {renderFormField(
            'seat_count',
            t('seat_count'),
            handleChange,
            formData,
            formDataError,
            'number'
          )}

          {renderSelect(
            'time_zone',
            t('time_zone'),
            t('placeholder_select_timezone'),
            timezones,
            selectedTimezone,
            handleTimezoneSelect
          )}

          {renderFormField(
            'start_at',
            t('lesson_time'),
            handleChange,
            formData,
            formDataError,
            'datetime-local'
          )}

          {renderSelect(
            'duration',
            t('class_duration'),
            t('select_duration'),
            [
              { value: 30, label: t('30min') },
              { value: 60, label: t('60min') }
            ],
            selectedDuration,
            handleDurationSelect,
            undefined,
            formDataError.duration
          )}

          <div className="form-row">
            <div className="form-item">
              <div
                className="recurrence"
                onChange={event => {
                  setIsRecurrence(event.target.value)
                }}
              >
                <label>
                  <input
                    value={'onetime'}
                    checked={isRecurrence === 'onetime'}
                    type="radio"
                    name="recurrence"
                  />
                  One Time
                </label>
                <label>
                  <input
                    value={'recurrence'}
                    checked={isRecurrence === 'recurrence'}
                    type="radio"
                    name="recurrence"
                  />
                  Recurrence
                </label>
              </div>
            </div>
          </div>

          {isRecurrence === 'recurrence' && (
            <>
              {renderSelect(
                'recurrence',
                t('recurrence'),
                t('select_recurrence'),
                recurrenceOptions,
                selectedRecurrence,
                handleRecurrenceSelect
              )}
              {renderFormField(
                'recurrenceTimes',
                t('recurrence_times'),
                handleChange,
                formData,
                formDataError,
                'number'
              )}
            </>
          )}

          {formData.start_at &&
            renderSelect(
              'tutor',
              t('tutor'),
              t('select_tutor'),
              tutors.map(t => ({
                value: t.id,
                label: `${t.first_name} ${t.last_name}`
              })),
              selectedTutor,
              handleTutorSelect,
              undefined,
              formDataError.tutor
            )}

          {formData.start_at &&
            renderSelect(
              'student',
              t('students'),
              t('select_students'),
              students.map(t => ({
                value: t.id,
                label: `${t.first_name} ${t.last_name}`
              })),
              selectedStudents,
              handleStudentsSelect,
              undefined,
              formDataError.students,
              false,
              true
            )}
        </div>
      )}
      <button className="btn-save" onClick={onSave} disabled={loading > 0}>
        {t('create_lesson')}
      </button>
    </Modal>
  )
}

export default ModalCreateLesson
