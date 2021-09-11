import { useState } from 'react'
import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import { Checkbox } from '../../components/Checkbox'
import ImgInfo from '../../assets/images/info.svg'
import { useTranslation } from 'react-i18next'
import ImgBalloon from '../../assets/images/balloon.svg'
import { Link } from 'react-router-dom'

const ModalBirthdayDiscount = ({ visible, start_at, onDismiss }) => {
  const [t, i18n] = useTranslation('translation')
  const [expand, setExpand] = useState(false)

  return (
    <Modal
      className="modal-birthday-discount"
      visible={visible}
      onCancel={onDismiss}
    >
      <img src={ImgBalloon} alt="" />
      <h4 className="thankyou">{t('happy_birthday', { name: 'John' })}</h4>
      <p>{t('prepared_birthday_surprise')}</p>
      <p>{t('buy_lesson_25')}</p>
      <p>{t('use_discount_now')}</p>
      <div className="footer">
        <span>Okg7Nqbw</span>
        <span className="btn">{t('use_discount')}</span>
      </div>
    </Modal>
  )
}

export default ModalBirthdayDiscount
