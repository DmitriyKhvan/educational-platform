import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'
import io from 'socket.io-client'

import Modal from '../../components/Modal'
import { Checkbox } from '../../components/Checkbox'

import CupImage from '../../assets/images/cup.svg'
import { Avatar } from '../../components/Avatar'
import { renderFormField, renderSelect } from '../../components/Global'
import NotificationManager from '../../components/NotificationManager.js'

import '../../assets/styles/student.scss'
import AppointmentApi from '../../api/AppointmentApi'

const LessonFinishModal = ({ visible, onDismiss, group, user }) => {
  const [t, _] = useTranslation('translation')

  const student_attendance = [
    { label: t('stduent_was_ontime'), value: 'on_time' },
    { label: t('student_was_late'), value: 'tutor_late' },
    { label: t('no_show'), value: 'no_show' }
  ]

  const last_part_options = [
    { label: t('warm_up'), value: 'warm_up' },
    { label: t('vocabulary_words'), value: 'vacabulary_words' },
    { label: t('vocabulary_game'), value: 'vocabulary_game' },
    { label: t('main_video'), value: 'main_video' },
    { label: t('reading_passage'), value: 'reading_passage' },
    { label: t('reading_questions'), value: 'reading_questions' },
    { label: t('chit_chats'), value: 'chit_chats' }
  ]

  const [student, setStudent] = useState(group?.students?.[0])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    attendance: student?.GroupStudent?.student_attendance,
    lesson_topic: group?.lesson_topic,
    last_part_lesson: group?.last_part_lesson
      ? last_part_options.find(o => o.value === group?.last_part_lesson)
      : null
  })

  useEffect(() => {
    if (group && group.students) {
      setStudent(group.students[0])
    }
  }, [group])

  useEffect(() => {
    setFormData({
      attendance: student?.GroupStudent?.student_attendance,
      lesson_topic: group?.lesson_topic,
      last_part_lesson: group?.last_part_lesson
        ? last_part_options.find(o => o.value === group?.last_part_lesson)
        : null
    })
  }, [student, group])

  const handleChange = (option, stateName) => {
    if (stateName === 'lesson_topic') {
      setFormData({
        ...formData,
        [stateName]: option
      })
    } else if (stateName.name === 'last_part_lesson') {
      setFormData({
        ...formData,
        [stateName.name]: option
      })
    }
  }

  const submitComplete = async () => {
    setLoading(true)
    try {
      await AppointmentApi.completeLesson({
        ...formData,
        last_part_lesson: formData.last_part_lesson?.value,
        group_id: group.id,
        student_id: student?.id
      })
      

      if (!group.completed) {
        let socket = io.connect(process.env.REACT_APP_SERVER_URL)
        socket.emit('completeLesson', {
          students: group.students
            .filter(s => !!s.user?.id)
            .map(s => s.user.id),
          group: {
            group_id: group.id
          },
          user: {
            name: `${user?.first_name} ${user?.last_name}`,
            role: 'tutor'
          }
        })
      }

      onDismiss()
    } catch (e) {
      NotificationManager.error(
        e.response?.data?.message || t('server_issue'),
        t
      )
    }
    setLoading(false)
  }

  return (
    <Modal
      className='modal-write-review'
      visible={visible}
      onCancel={onDismiss}
    >
      <p className='title'>{t('after_lesson')}</p>
      <div className='student-info'>
        <div className='student-avatar'>
          <Avatar avatar={student?.user?.avatar} />
          <div className='student-basic-info'>
            <p className='student-name'>
              {' '}
              {student?.user?.first_name} {student?.user?.last_name}{' '}
            </p>
            <div className='student-level'>
              <img src={CupImage} width={10} height={10} />{' '}
              <span>{t('level_n', { n: student?.level || 0 })}</span>
            </div>
            <p className='student-county'> {student?.user?.country} </p>
          </div>
        </div>
        <div className='lesson-details-view'>
          <div className='lesson-details-item'>
            <p className='student-label'>{t('lesson_date')}</p>
            <p className='student-value'>{group?.lessonDate}</p>
          </div>
          {/* <div className="lesson-details-item">
            <p className="student-label">{t('lesson_number')}</p>
            <p className="student-value">#{group?.id}</p>
          </div> */}
        </div>
      </div>
      <p className='description'>{t('fill_items_below')}</p>

      <p className='p-write-review'>1) {t('student_attendance')}</p>
      <div className='feedback-content'>
        {student_attendance.map((opt, idx) => (
          <Checkbox
            key={`checkbox-${idx}`}
            label={opt.label}
            checked={formData.attendance === opt.value}
            onChange={() => {
              setFormData({
                ...formData,
                attendance: opt.value
              })
            }}
          />
        ))}
      </div>

      <p className='p-write-review'>2) {t('lesson_details')}</p>
      <div className='lesson-details'>
        <div>
          <p className='lesson-details-label'>{t('lesson_topic')}</p>
          {renderFormField(
            'lesson_topic',
            '',
            handleChange,
            formData,
            undefined,
            'text',
            'Lesson Topic Here'
          )}
        </div>
        <div>
          <p className='lesson-details-label'>
            {t('last_part_lesson_completed')}
          </p>
          {renderSelect(
            'last_part_lesson',
            '',
            'Choose From List',
            last_part_options,
            formData.last_part,
            handleChange
          )}
        </div>
      </div>
      <div className='btn' onClick={submitComplete}>
        {t('submit')}
      </div>
      {loading && (
        <div className='loading'>
          <div className='trans-bg' />
          <Loader
            className='align-center'
            type='Audio'
            color='#00BFFF'
            height={50}
            width={50}
          />
        </div>
      )}
    </Modal>
  )
}

export default LessonFinishModal
