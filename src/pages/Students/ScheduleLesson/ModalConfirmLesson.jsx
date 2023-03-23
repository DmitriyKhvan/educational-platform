import { useEffect, useState } from 'react'
import Modal from '../../../components/Modal'
import '../../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'
import ImgChecked from '../../../assets/images/checked.svg'
import { Link, useHistory } from 'react-router-dom'
import { differenceInDays, differenceInHours } from 'date-fns'
import student from '../../../reducers/students'

const ModalConfirmLesson = ({ visible, start_at, onDismiss }) => {
  const [t, i18n] = useTranslation('translation')
  const [remain, setRemain] = useState('')
  const history = useHistory()
  const studentId = history.location.state && history.location.state.studentId

  useEffect(() => {
    let days = differenceInDays(start_at, new Date())
    let hours = differenceInHours(start_at, new Date()) % 24
    setRemain(`${days} days, ${hours} hours`)
  }, [start_at])

  return (
    <Modal
      className='modal-confirm-lesson'
      visible={visible}
      onCancel={onDismiss}
    >
      <img src={ImgChecked} alt='' />
      <p className='thankyou'>
        {t('thankyou')}
        <br />
        {t('lesson_confirm')}
      </p>
      <p className='lesson-start'>{t('your_lesson_starts_in')}</p>
      <p className='start-at'>{remain}</p>
      <Link
        className='btn'
        to={{
          pathname: studentId
            ? '/admin/schedule-new-lesson'
            : '/student/manage-lessons',
          state: studentId ? { studentId } : {}
        }}
      >
        {t('plan_another_lesson')}
      </Link>
    </Modal>
  )
}

export default ModalConfirmLesson
