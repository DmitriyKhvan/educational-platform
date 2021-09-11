import { useState } from 'react'
import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../components/Avatar'
import { ModalUserInfo } from './ModalUserInfo'
import { UserHeader } from '../../components/UserHeader'
import { PaymentPage } from '../Tutors/Payment'

const ModalEditTutorPayment = ({ user, onDismiss, visible }) => {
  const [t, i18n] = useTranslation('translation')

  return (
    <ModalUserInfo
      title={t('edit_payment')}
      visible={visible}
      user={user}
      onDismiss={onDismiss}
    >
      <div className="scroll-layout">
        <UserHeader user={user} onAction={onDismiss} />
        <div className="payment-page-layout">
          <div className="scroll-layout">
            <PaymentPage tutor={user.tutor_profile} />
          </div>
        </div>
      </div>
    </ModalUserInfo>
  )
}

export default ModalEditTutorPayment
