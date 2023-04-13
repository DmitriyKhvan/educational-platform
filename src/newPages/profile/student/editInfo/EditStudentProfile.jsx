import React from 'react'
import {  Controller, useForm } from 'react-hook-form'
import { TextInput } from '../../../../components/TextInput'
import { useAuth } from '../../../../modules/auth'
import Select from 'react-select';
import femaleAvatar from '../../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../../assets/images/avatars/img_avatar_male.png'
import './index.scss';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER
} from '../../../../modules/auth/graphql'
import { useMutation } from '@apollo/client'
import timezone from 'timezones-list'
import { toast } from 'react-toastify'
import { getData } from 'country-list'

import { AiFillEdit } from "react-icons/ai"
import Layout from '../../../../components/Layout'
import { useHistory } from 'react-router-dom'

const EditProflileStudent = () => {
  const [updateStudent] = useMutation(
    MUTATION_UPDATE_STUDENT
  )
  const [profileImage, setProfileImage] = React.useState('')

  const history = useHistory()
  const [preview, setPreview] = React.useState({});

  const notifyAvatar = () => toast("Avatar is changed!")
  const notify = () => toast("Student information is changed!")

  const [updateUser] =
    useMutation(MUTATION_UPDATE_USER)

  const { user, refetchUser } = useAuth()
  const timezones = timezone.map(x => x.label)

  const { register, handleSubmit, control  } = useForm({
    defaultValues: {
      koreanEquivalent: user?.koreanEquivalent,
      gender: user?.gender,
      lastName: user?.lastName,
      firstName: user?.firstName,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
    }
  })

  const avatar = user?.student?.avatar?.url;
  
  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar)
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar)
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar)
    } else {
      setProfileImage(maleAvatar)
    }
  }, [user, avatar])

  const onSubmit = async area => {
    if (area.avatar?.length) {
      setPreview(area.avatar)

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
        notifyAvatar()
        history.push("/student/profile")
      }

       await refetchUser()
    }

    const { data: userData } = await updateUser({
      variables: {
        where: {
          id: parseInt(user?.id)
        },
        data: {
          koreanEquivalent: area.koreanEquivalent,
          lastName: area.lastName,
          gender: area.gender,
          timeZone:area.timeZone,
          phoneNumber: area.phoneNumber,
          firstName: area.firstName,
          country: area.country,
          address: area.address
        }
      }
    })

    if (userData) {
      notify()
      history.push("/student/profile")
    }

    await refetchUser()
  }

  const countries = getData().map(x => x.name)

  return (
    <Layout
    >
      <section className='edit-profile-modal'>
        <div className='header'>
          <h3>Edit Profile</h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className='body'>
          <div className='avatar-block'>
            {avatar && <img src={profileImage} alt={"userInfo.tutorName"} />}
            <label for="inputTag" className='file_upload'>
              <input 
                {...register("avatar")} 
                webkitdirectory 
                directory  
                id="inputTag"  
                type={"file"} 
              />
              <AiFillEdit className="edit-icon"/>
            </label>
          </div>
          <section className='scroll-form'>
            <section>
              <TextInput
                label='Korean Equivalent'
                type={'text'}
                placeholder={"알렉스"}
                {...register('koreanEquivalent')}
              />
            </section>
            <section>
              <label>
                Gender
                <select {...register('gender')}>
                  <option  value={"male"}>
                    Male
                  </option>
                  <option  value={"female"}>
                    Female
                  </option>
                </select>
              </label>
            </section>
        
            <div className='student_country'>
              <label>
                Time zone (optional)
              </label>
              <Controller
                control={control}
                defaultValue={user?.timeZone}
                name="timeZone"
                render={({ field: { ref, value, onChange } }) => (
                  <Select
                    inputRef={ref}
                    value={{ label: value, value: value }}
                    options={timezones.map(each => {
                      return { label: each, value: each };
                    })}
                    onChange={e => onChange(e.value)}
                  />
                )}
              />
            </div>
            <div className='student_country'>
              <label htmlFor='country'>
                Country
              </label>
              <Controller
                control={control}
                defaultValue={user?.country}
                name="country"
                render={({ field: { ref, value, onChange } }) => (
                  <Select
                    inputRef={ref}
                    value={{ label: value, value: value }}
                    options={countries.map(each => {
                      return { label: each, value: each };
                    })}
                    onChange={e => onChange(e.value)}
                  />
                )}
              />
            </div>

            <section>
              <TextInput
                label='Last Name'
                type={'text'}
                placeholder={"Addison"}
                {...register('lastName')}
              />
            </section>
            <section>
              <TextInput
                label='First Name'
                type={'text'}
                placeholder={"Alisa"}
                {...register('firstName')}
              />
            </section>
            <section>
              <TextInput
                label='Phone Number'
                type={'text'}
                placeholder="+1(555)555-5555"
                {...register('phoneNumber')}
              />
            </section>
            <section>
              <TextInput
                label='Address'
                type={'text'}
                placeholder={"Bakarov 98"}
                {...register('address')}
              />
            </section>
            
          </section>
          <button style={{ cursor: 'pointer' }} type='submit'>
            Save Edits
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default EditProflileStudent;
