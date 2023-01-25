

import React from 'react'
import Modal from 'react-modal'
import ExportArrow from "../../../assets/ExportArrow.png"
import Rotate from "../../../assets/rotate.png"
import Crop from "../../../assets/crop.png"

import "./EditAvatar.scss"
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../modules/auth'

const EditAvatarModal = ({isOpen, closeModal}) => {
  const { updateUser, user } = useAuth()


  const {register, handleSubmit} = useForm()

  const handleAvatar = async (area) => {
    const file = area.avatar[0];
    const formData = new FormData();

    formData.append("avatar", file)

    const { data } = await updateUser(formData);

    console.log(data)
  }   

  console.log(user)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={`avatar-modal`}
      bodyOpenClassName={'edit-modal-open'}
    >
      <form onSubmit={handleSubmit(handleAvatar)} className='avatarModal_card'>
        {
          !user?.avatar 
          ?   <img 
                className='avatar_preview' 
                src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' 
                alt=''
              /> 
          : <img className='avatar_preview' src={user.avatar} alt=''/>
        }

        <div  className='avatarModal_card_editor'>
          <input type={"file"} {...register("avatar")}/>
          {/* <button>
            <img src={ExportArrow} alt=""/>
            Upload
          </button> */}
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
          <button  type="submit">Save</button>
        </div>
      </form>
    </Modal>
  )
}

export default EditAvatarModal;