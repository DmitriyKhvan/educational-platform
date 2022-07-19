import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { uploadAvatar } from '../../actions/user'
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png'
import ProfileModal from '../ProfileModal'
import NotificationManager from '../NotificationManager'

const ProfileImage = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector(state => state.users.user)
  const [profileImage, setProfileImage] = useState('')
  const border = { border: '1px solid #DEDEE1' }
  useEffect(() => {
    if (user.avatar) {
      setProfileImage(user.avatar)
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar)
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar)
    }
  }, [user])

  const onDelete = async () => {
    try {
      const res = await dispatch(uploadAvatar(null, user.id))
      if (res.type === 'UPLOAD_AVATAR_SUCCESS') {
        
        if (user.gender === 'female') {
          setProfileImage(femaleAvatar)
        } else {
          setProfileImage(maleAvatar)
        }
      } else {
        NotificationManager.error('Avatar Deleted Failed', t)
      }
    } catch (error) {
      NotificationManager.error(error.message, t)
    }
  }

  return (
    <div className='container-fluid mx-5'>
      <div className='row px-3'>
        <div className='col-6'>
          <div className='row'>
            <div className='col-6'>
              <h1>{t('change_profile_photo')}</h1>
              <img
                className='img-fluid rounded-corners'
                src={profileImage}
                alt=''
              />
            </div>
            <div className='col-6 mt-5 pt-5'>
              <div className='row mt-5'>
                <button
                  className='btn enter-btn'
                  style={border}
                  onClick={() => setIsOpen(true)}
                >
                  {t('upload_new_photo')}
                </button>
              </div>
              <div className='row mt-4'>
                <button
                  className='btn enter-btn'
                  style={border}
                  onClick={onDelete}
                >
                  {t('delete_photo')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-6'></div>
      </div>
      <ProfileModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setProfileImage={setProfileImage}
      />
    </div>
  )
}

export default ProfileImage
