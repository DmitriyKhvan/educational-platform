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
      zIndex: 100,
      background: 'none',
      border: 'none'
    }
  }

  return (
    <div style={{ zIndex: 100, width: '45vw' }} className='container-fluid'>
      <Modal isOpen={isOpen} style={customStyles} onRequestClose={closeModal}>
        <div className='modal-card grey-border bg-white'>{children}</div>
      </Modal>
    </div>
  )
}

export default ModalWrapper
