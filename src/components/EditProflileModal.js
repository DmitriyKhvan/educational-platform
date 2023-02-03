import Modal from 'react-modal'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ReactComponent as Close } from '../assets/images/Close icon.svg'
import AvatarImg from '../assets/avatar.png'
import { TextInput } from './TextInput'
import { useAuth } from '../modules/auth'
import profileAvatar from '../assets/images/Avatar.png'
import { MUTATION_UPDATE_STUDENT } from '../modules/auth/graphql'
import { useMutation } from '@apollo/client'
import timezone from 'timezones-list'

const EditProflileModal = ({ isOpen, setIsOpen }) => {
  const [updateStudent, { loading: updateUserLoading }] = useMutation(
    MUTATION_UPDATE_STUDENT
  )

  const { user, refetchUser } = useAuth()
  const timezones = timezone.map(x => x.label)

  const { reset, register, handleSubmit } = useForm()

  const closeModal = () => {
    setIsOpen(false)
    reset()
  }

  const userInfo = {
    avatar: profileAvatar,
    firstName: 'Addison',
    equivalent: '알렉스',
    gender: ['Female', 'Male', 'Other'],
    pronouns: ['She / Her', 'He / His', 'It'],
    birthday: '14/04/2002',
    parent_name: 'Jessica Kim',
    phone_number: '+1 (555) 555-5555',
    address: '123 Street, City, State',
    country: ['Korea', 'USA', 'Germany'],
    holiday: [
      'Yes, please schedule lessons on holidays. ',
      'Noe, please do not schedule lessons on holidays.'
    ],
    password: '123123123',
    timeZone: [
      'UTC +9 (Korean Standard Time)',
      'UTC -10	HST	Hawaii Standard Time'
    ],
    lastName: 'Mishele'
  }

  const onSubmit = async area => {
    console.log(area)

    const { data } = await updateStudent({
      variables: {
        where: {
          id: parseInt(user?.student?.id)
        },
        data: {
          avatar: { upload: area.avatar[0] }
        }
      }
    })

    if (data) {
      closeModal()
    }

    await refetchUser()
  }

  const avatar = user?.student?.avatar?.url || AvatarImg

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={
        window.innerHeight >= 1668
          ? `edit-profile-modal maxHeight`
          : 'edit-profile-modal'
      }
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className='header'>
        <h3>Edit Profile</h3>
        <button onClick={closeModal}>
          <Close />
        </button>
      </div>
      <div className='avatar-block'>
        {avatar && <img src={avatar} alt={userInfo.tutorName} />}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='body'>
        {/* <div>
          <TextInput 
            label="Full Name"
            type={"text"}
            value={"Addison.12"}
            {...register("fullName")}
          />
        </div> */}
        <div>
          <TextInput
            label='Korean Equivalent'
            type={'text'}
            defaultValue={userInfo.equivalent}
            {...register('koreanEquivalent', {
              required: 'This field is required!'
            })}
          />
        </div>
        <div>
          <label>
            Gender
            <select
              {...register('gender', {
                required: 'This field is required!'
              })}
            >
              {userInfo.gender.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Time zone (optional)
            <select
              {...register('timeZone', {
                required: 'This field is required!'
              })}
            >
              {timezones.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <TextInput
            label='Last Name'
            type={'text'}
            defaultValue={userInfo.lastName}
            {...register('lastName', {
              required: 'This field is required!'
            })}
          />
        </div>
        <div>
          <TextInput
            label='First Name'
            type={'text'}
            defaultValue={userInfo.firstName}
            {...register('firstName', {
              required: 'This field is required!'
            })}
          />
        </div>
        <div>
          <TextInput
            label='Phone Number'
            type={'text'}
            defaultValue='+1(555)555-5555'
            {...register('phoneNumber', {
              required: 'This field is required!'
            })}
          />
        </div>
        <div>
          <TextInput
            label='Address'
            type={'text'}
            defaultValue='123 Street, City, State'
            {...register('address', {
              required: 'This field is required!'
            })}
          />
        </div>
        <div>
          <label>
            Country
            <select
              {...register('country', {
                required: 'This field is required!'
              })}
            >
              {userInfo.country.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <TextInput
            label='Avatar'
            type={'file'}
            multiple={true}
            {...register('avatar', {
              required: 'This field is required!'
            })}
          />
        </div>

        <button style={{ cursor: 'pointer' }} type='submit'>
          Save Edits
        </button>
      </form>
    </Modal>
  )
}

export default EditProflileModal
