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

const ModalFeedback = ({ visible, onDismiss, group, user }) => {
  const [t, _] = useTranslation('translation')

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
    feedback: '',
    lesson_topic: '',
    homework_assignment: group?.homework_assignment
      ? last_part_options.find(o => o.value === group?.homework_assignment)
      : null
  })

  useEffect(() => {
    if (group && group.students) {
      setStudent(group.students[0])
    }
  }, [group])

  useEffect(() => {
    setFormData({
      feedback: '',
      lesson_topic: '',
      homework_assignment: group?.homework_assignment
        ? last_part_options.find(o => o.value === group?.homework_assignment)
        : null
    })
  }, [student, group])

  const handleChange = (option, stateName) => {
    if (stateName === 'lesson_topic') {
      setFormData({
        ...formData,
        [stateName]: option
      })
    } else if (stateName.name === 'homework_assignment') {
      setFormData({
        ...formData,
        [stateName.name]: option
      })
    } else if (stateName === 'feedback') {
      setFormData({
        ...formData,
        feedback: option
      })
    }
  }

  const submitComplete = async () => {
    setLoading(true)
    try {
      await AppointmentApi.addFeedbackToStudent({
        ...formData,
        homework_assignment: formData.homework_assignment?.value,
        group_id: group.id,
        student_id: student?.id
      })
      NotificationManager.success(t('you_updated_lesson'), t)

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
      className="modal-write-review"
      visible={visible}
      onCancel={onDismiss}
    >
      <p className="title">{t('after_lesson')}</p>
      <div className="student-info">
        <div className="student-avatar">
          <Avatar avatar={student?.user?.avatar} />
          <div className="student-basic-info">
            <p className="student-name">
              {' '}
              {student?.user?.first_name} {student?.user?.last_name}{' '}
            </p>
            <div className="student-level">
              <img src={CupImage} width={10} height={10} />{' '}
              <span>{t('level_n', { n: student?.level || 0 })}</span>
            </div>
            <p className="student-county"> {student?.user?.country} </p>
          </div>
        </div>
        <div className="lesson-details-view">
          <div className="lesson-details-item">
            <p className="student-label">{t('lesson_date')}</p>
            <p className="student-value">{group?.lessonDate}</p>
          </div>
          {/* <div className="lesson-details-item">
            <p className="student-label">{t('lesson_number')}</p>
            <p className="student-value">#{group?.id}</p>
          </div> */}
        </div>
      </div>
      <p className="description">{t('fill_items_below')}</p>

      <p className="p-write-review"> {t('lesson_details')}</p>
      <div className="lesson-details columns">
        <div>
          <p className="lesson-details-label">{t('lesson_topic')}</p>
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
          <p className="lesson-details-label">
            {t('homework_assignment_completed')}
          </p>
          {renderSelect(
            'homework_assignment',
            '',
            'Choose From List',
            last_part_options,
            formData.homework_assignment,
            handleChange
          )}
        </div>
        <div>
          <p className="lesson-details-label">{t('feedback')}</p>
          {renderFormField(
            'feedback',
            '',
            handleChange,
            formData,
            undefined,
            'textfield'
          )}
        </div>
      </div>
      <div className="btn" onClick={submitComplete}>
        {t('submit')}
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
    </Modal>
  )
}

export default ModalFeedback
