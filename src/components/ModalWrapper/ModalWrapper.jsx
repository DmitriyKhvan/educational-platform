import React from 'react';
import Modal from 'react-modal';
import { FaXmark } from 'react-icons/fa6';

import './ModalWrapper.css';

Modal.setAppElement('#root');

const ModalWrapper = ({
  children,
  isOpen,
  closeModal,
  widthContent,
  heightContent,
  paddingContent = '25px 20px',
}) => {
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
      borderRadius: '10px',
      // padding: '25px 20px',
      padding: paddingContent,
      minWidth: '400px',
      maxHeight: 'calc(100vh - 100px)',
      background: '#fff',
      width: widthContent,
      height: heightContent,
    },
  };
  console.log('isOpen', isOpen);
  // debugger;

  return (
    <Modal
      closeTimeoutMS={300}
      isOpen={isOpen}
      contentLabel="modal"
      style={customStyles}
      onRequestClose={() => closeModal(false)}
    >
      <button
        className="absolute right-5 top-[25px] z-50"
        onClick={() => closeModal(false)}
      >
        <FaXmark className="text-2xl text-color-light-grey" />
      </button>

      {children}
    </Modal>
  );
};

export default ModalWrapper;
