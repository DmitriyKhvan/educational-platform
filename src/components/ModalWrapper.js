import React from 'react'
import Modal from 'react-modal'

const ModalWrapper = ({ children, isOpen, closeModal }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      background: 'none',
      border: 'none'
    }
  }
  return (
    <div style={{ zIndex: 9999, width: '45vw' }} className='container-fluid'>
      <Modal isOpen={isOpen} style={customStyles} onRequestClose={closeModal}>
        <div className='modal-card grey-border bg-white pt-2 mt-4'>
          {children}
        </div>
      </Modal>
    </div>
  )
}

export default ModalWrapper
