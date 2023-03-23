import React from 'react'
import { useTranslation } from 'react-i18next'

const CancellationPolicyModal = ({ setTabIndex, setIsOpen }) => {
  const [t] = useTranslation('translation')
  return (
    <React.Fragment>
      <div className='container'>
        <div className='row'>
          <div className='col-auto ps-2 pe-5'>
            <h2>Cancellation Policy</h2>
          </div>
          <div className='col-auto text-end pt-2 ps-5'>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
        </div>
        <div style={{ width: '20rem' }}>
          <p className='welcome-subtitle'>{t('cancellation_policy')}</p>
        </div>
        <div className='row'>
          <div className='col-auto'>
            <button
              className='enter-btn grey-border ms-0'
              onClick={() => setTabIndex(0)}
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CancellationPolicyModal
