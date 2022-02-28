import React from 'react'
import ModalWrapper from '../ModalWrapper'

const ZoomWarningModal = ({ isWarningOpen, closeModal, setIsWarningOpen }) => {
  return (
    <ModalWrapper isOpen={isWarningOpen} closeModal={closeModal}>
      <div className='container'>
        <div className='row'>
          <div className='col-10 ps-2'>
            <h2>Ready to being class?</h2>
          </div>
          <div className='col-auto text-end pt-2 ps-4'>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => setIsWarningOpen(false)}
            ></button>
          </div>
        </div>
        <div style={{ width: '20rem' }}></div>
        <p className='welcome-subtitle'>
          Your zoom link will become active 10 minutes before the start of
          class.
        </p>
      </div>
    </ModalWrapper>
  )
}

export default ZoomWarningModal
