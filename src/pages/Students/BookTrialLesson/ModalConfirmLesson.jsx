import { useState } from 'react'
import Modal from '../../../components/Modal'
import '../../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'
import ImgChecked from '../../../assets/images/checked.svg'
import { Link } from 'react-router-dom'

const ModalConfirmLesson = ({ visible, start_at, onDismiss }) => {
  const [t, i18n] = useTranslation('translation')
  return (
    <Modal
      className='modal-confirm-lesson'
      visible={visible}
      onCancel={onDismiss}
    >
      <img src={ImgChecked} alt='' />
      <p className='thankyou'>{t('trial_confirmed')}</p>
      <p className='lesson-start'>{t('exicted_meet_you')}</p>
      <Link className='btn' to='/student/book-trial-lesson'>
        {t('plan_another_lesson')}
      </Link>
    </Modal>
  )
}

export default ModalConfirmLesson
