import React from 'react';

const Modal = (props) => {
  return (
    <>
      {props.visible && (
        <div className="modal">
          <div className={props.className}>
            <div className="modal-content">
              <span className="close" onClick={props.onCancel}>
                &times;
              </span>
              {props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
