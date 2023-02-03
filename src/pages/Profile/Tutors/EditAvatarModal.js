

import React, { useState } from 'react'
import Modal from 'react-modal'
import ExportArrow from "../../../assets/ExportArrow.png"
import Rotate from "../../../assets/rotate.png"
import Crop from "../../../assets/crop.png"

import "./EditAvatar.scss"
import { useAuth } from '../../../modules/auth'
import { ME_QUERY, MUTATION_UPDATE_TUTOR } from '../../../modules/auth/graphql'
import { useMutation, useQuery } from '@apollo/client'

const EditAvatarModal = ({isOpen, closeModal}) => {
  const { user } = useAuth()
  const [updateTutor] = useMutation(MUTATION_UPDATE_TUTOR);
  const {  userLoading, refetch: refetchUser } = useQuery(ME_QUERY);

  const [file, setFile] = useState({});

  const updateAvatar = async (e) => {
    e.preventDefault();
    const {target: { validity, files }} = file;

    if(validity.valid) {
      const { data } = await updateTutor({
        variables: {
          where: {
            id: parseInt(user?.tutor?.id)
          },
          data: { avatar: { upload: files[0] }}
        }
      })

      await refetchUser()

      return {data}
    }
  }

  const avatar = user?.tutor?.avatar;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={`avatar-modal`}
      bodyOpenClassName={'edit-modal-open'}
    >
      <form onSubmit={updateAvatar} className='avatarModal_card'>
        {
          !avatar 
          ?   <img 
                className='avatar_preview' 
                src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' 
                alt=''
              /> 
          : <img className='avatar_preview' src={avatar?.url} alt=''/>
        }

        <div  className='avatarModal_card_editor'>
          <input type={"file"} multiple onChange={e => setFile(e)}/>
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