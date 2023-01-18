

import React from 'react'
import Modal from 'react-modal'
import ExportArrow from "../../../assets/ExportArrow.png"
import Rotate from "../../../assets/rotate.png"
import Crop from "../../../assets/crop.png"

import "./EditAvatar.scss"

const EditAvatarModal = ({isOpen, closeModal}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={`avatar-modal`}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className='avatarModal_card'>
        <img className='avatar_preview' src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>

        <div className='avatarModal_card_editor'>
          <button>
            <img src={ExportArrow} alt=""/>
            Upload
          </button>
          <button>
            <img src={Rotate} alt=""/>
            Rotate
          </button>
          <button>
            <img src={Crop} alt=""/>
            Crop
          </button>
        </div>

        <div className='avatarModal_card_footer'>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={closeModal}>Save</button>
        </div>
      </div>
    </Modal>
  )
}

export default EditAvatarModal;