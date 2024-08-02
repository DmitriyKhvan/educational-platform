import React, { forwardRef, useState } from 'react';
import Modal from 'react-modal';
import { FaXmark } from 'react-icons/fa6';

import './dialog.css';

Modal.setAppElement('#root');

export const MyDialog = forwardRef(function MyDialog(
  { open, setOpen, button, paddingContent = '40px 32px', children },
  ref,
) {
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
      // alignItems: 'center',
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
      padding: paddingContent,
      minWidth: '360px',
      maxHeight: 'calc(100vh - 100px)',
      background: '#fff',
    },
  };

  if (open === undefined && setOpen === undefined) {
    [open, setOpen] = useState(false);
  }

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setOpen(false);
  };

  return (
    <>
      <div className="flex" onClick={openModal}>
        {button}
      </div>
      <Modal
        closeTimeoutMS={400}
        isOpen={open}
        contentLabel="modal"
        style={customStyles}
        onRequestClose={closeModal}
        ref={ref}
      >
        <button
          className="absolute right-4 top-4 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-color-border-grey/20"
          onClick={closeModal}
        >
          <FaXmark className="text-color-light-grey" />
        </button>

        {children}
      </Modal>
    </>
  );
});
