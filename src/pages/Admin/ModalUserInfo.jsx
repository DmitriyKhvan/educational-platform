import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'

export const ModalUserInfo = ({ visible, title, onDismiss, children }) => {
  const [t, i18n] = useTranslation('translation')

  return (
    <>
      {visible && (
        <Modal
          className='user-info-modal'
          visible={visible}
          onCancel={onDismiss}
        >
          <div className='modal-title'>{title}</div>
          {children}
        </Modal>
      )}
    </>
  )
}
