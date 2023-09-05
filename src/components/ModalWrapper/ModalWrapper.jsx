import React from 'react';
import Modal from 'react-modal';
import { FaXmark } from 'react-icons/fa6';

import './ModalWrapper.css';

Modal.setAppElement('#root');

const ModalWrapper = ({ children, isOpen, closeModal }) => {
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      zIndex: '9999',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      zIndex: 100,
      border: '0.5px solid #b2b2b2',
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)',
      borderRadius: '16px',
      padding: '25px 20px',
      minWidth: '400px',
      maxHeight: 'calc(100vh - 100px)',
      background: '#fff',
    },
  };

  return (
    <Modal
      closeTimeoutMS={300}
      isOpen={isOpen}
      contentLabel="modal"
      style={customStyles}
      onRequestClose={() => closeModal(false)}
    >
      <button
        className="absolute right-5 top-[25px]"
        onClick={() => closeModal(false)}
      >
        <FaXmark className="text-2xl text-color-light-grey" />
      </button>

      {children}
    </Modal>
  );
};

export default ModalWrapper;
