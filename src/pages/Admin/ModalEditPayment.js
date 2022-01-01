import { useState } from 'react'
import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import ImgIncrease from '../../assets/images/increase.svg'
import ImgDecrease from '../../assets/images/decrease.svg'
import { useTranslation } from 'react-i18next'

export const EditPaymentModal = ({
  visible,
  onDismiss,
  onSave,
  tutorRates
}) => {
  const [t, i18n] = useTranslation('translation')

  const [prices, setPrices] = useState(tutorRates)

  const onChange = (newValue, index) => {
    setPrices(
      prices.map((price, idx) => {
        if (idx === index) {
          return {
            ...price,
            rate: parseInt(newValue, 10)
          }
        }
        return price
      })
    )
  }

  return (
    <Modal
      className='edit-payment-modal'
      visible={visible}
      onCancel={onDismiss}
    >
      <div className='title'>{t('edit_standard_payment')}</div>
      <div className='class-types'>
        {prices.map((price, idx) => {
          return (
            <div key={idx}>
              <p>{`${price.type} (${price.duration} mins)`}</p>
              <div className='price'>
                <p>$</p>
                <input
                  type='number'
                  value={price.rate}
                  onChange={e => onChange(e.target.value, idx)}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className='btn-save' onClick={() => onSave(prices)}>
        {t('save')}
      </div>
    </Modal>
  )
}
