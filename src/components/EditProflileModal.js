import Modal from 'react-modal'
import React from 'react'
import {  useForm } from 'react-hook-form'
import { ReactComponent as Close } from '../assets/images/Close icon.svg'
import AvatarImg from '../assets/avatar.png'
import { TextInput } from './TextInput'

const EditProflileModal = ({isOpen, setIsOpen}) => {

  const {
    reset,
    register,
    handleSubmit,
  } = useForm()

  const closeModal = () => {
    setIsOpen(false)
    reset()
  }

  const userInfo = {
    userName: 'Addison.12',
    avatar: AvatarImg,
    name: 'Addison',
    equivalent:"알렉스",
    gender: ['Female', "Male", "Other"],
    pronouns: ["She / Her", "He / His" , "It"],
    birthday: "14/04/2002",
    parent_name: "Jessica Kim",
    phone_number: "+1 (555) 555-5555",
    address: "123 Street, City, State",
    country: ["Korea", "USA", "Germany"],
    holiday: ["Yes, please schedule lessons on holidays. ", "Noe, please do not schedule lessons on holidays."],
    password: "123123123"
  }

  const onSubmit = data => {
    console.log(data)
    closeModal()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={window.innerHeight >= 1668 ? `edit-profile-modal maxHeight` : "edit-profile-modal"}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className='header'>
        <h3>Edit Profile</h3>
        <button onClick={closeModal}>
          <Close />
        </button>
      </div>
      <div className='avatar-block'>
        <img src={userInfo.avatar} alt={userInfo.tutorName} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='body'>
        <div>
          <TextInput 
            label="Username"
            type={"text"}
            value={userInfo.userName}
            {...register("username")}
          />
        </div>
        <div>
          <TextInput 
            label="Korean Equivalent"
            type={"text"}
            value={userInfo.equivalent}
            {...register("korean_equivalent")}
          />
        </div>
        <div>
          <label>
            Gender
            <select {...register("gender")}>
              {userInfo.gender.map(item => 
                <option key={item} value={item}>{item}</option>
              )}
            </select>
          </label>
        </div>
        <div>
          <label>
            Pronouns (optional)
            <select {...register("pronouns")}>
              {userInfo.pronouns.map(item => 
                <option key={item} value={item}>{item}</option>
              )}
            </select>
          </label>
        </div>
        <div>
          <TextInput 
            label="Birthday"
            type={"text"}
            value="14/04/2002"
            {...register("birthday")}
          />
        </div>
        <div>
          <TextInput 
            label="Parent Name"
            type={"text"}
            value="Jessica Kim"
            {...register("parent_name")}
          />
        </div>
        <div>
          <TextInput 
            label="Phone Number"
            type={"text"}
            value="+1 (555) 555-5555"
            {...register("phone_number")}
          />
        </div>
        <div>
          <TextInput 
            label="Address"
            type={"text"}
            value="123 Street, City, State"
            {...register("address")}
          />
        </div>
        <div>
          <label>
            Country
            <select {...register("country")}>
              {userInfo.country.map(item => 
                <option key={item} value={item}>{item}</option>
              )}
            </select>
          </label>
        </div>
        <div>
          <label>
            Would you like to schedule lessons on holidays?
            <select {...register("schedule_lesson")}>
              {userInfo.holiday.map(item => 
                <option key={item} value={item}>{item}</option>
              )}
            </select>
          </label>
        </div>
        <div>
          <TextInput 
            label="Password"
            type={"password"}
            value="123 Street, City, State"
            {...register("password")}
          />
        </div>
        <button type='submit'>Save Edits</button>
      </form>
    </Modal>
  )
}

export default EditProflileModal
