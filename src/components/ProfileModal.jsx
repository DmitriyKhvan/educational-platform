import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Dropzone from 'react-dropzone'
import ModalWrapper from './ModalWrapper'
import NotificationManager from './NotificationManager'
import { getUserInfo, uploadAvatar } from '../actions/user'

const ProfileModal = ({ isOpen, setIsOpen, setProfileImage }) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [profile, setProfile] = useState('')
  const user = useSelector(state => state.users.user)
  const closeModal = () => {
    setIsOpen(false)
    setProfile('')
  }

  const onDrop = files => {
    files.map(file => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onloadend = () => {
        const image = reader.result
        setProfile(image)
      }
      reader.readAsDataURL(file)
    })
  }

  const onSave = async () => {
    setProfileImage(profile)
    try {
      const res = await dispatch(uploadAvatar(profile, user.id))
      if (res.type === 'UPLOAD_AVATAR_SUCCESS') {
        dispatch(getUserInfo())
      } else {
        NotificationManager.error('Avatar Uploaded/Updated Failed', t)
      }
    } catch (error) {
      NotificationManager.error(error.message, t)
    } finally {
      closeModal()
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className='container-fluid'>
        <div className='row justify-content-between pt-3'>
          <div className='col-7'>
            <Dropzone
              onDrop={onDrop}
              accept='image/*'
              minSize={1024}
              maxSize={3072000}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <p>{t('drag_n_drop_image')}</p>
                </div>
              )}
            </Dropzone>
          </div>
          <div className='col-4'>
            {profile && (
              <img
                src={profile}
                alt='profile'
                style={{ maxWidth: '190px' }}
                className='rounded-corners img-fluid'
              />
            )}
          </div>
        </div>
        <div className='row pt-3'>
          <div className='col-6'>
            <button className='col-10 enter-btn btn' onClick={closeModal}>
              {t('cancel')}
            </button>
          </div>
          <div className='col-6'>
            <button
              className='col-12 enter-btn btn btn-primary'
              onClick={onSave}
            >
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ProfileModal
