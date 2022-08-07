import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Dropzone from 'react-dropzone'
import ModalWrapper from './ModalWrapper'
import NotificationManager from './NotificationManager'
import { uploadAvatar } from '../actions/user'

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
      <div className='d-flex justify-content-between pt-3'>
        <div className='flex-row'>
          <div>
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
          <div className='flex-row'>
            {profile && (
              <img
                // todropbox max height
                style={{ height: '23vh' }}
                src={profile}
                alt='profile'
                className='rounded-corners img-fluid pe-4'
              />
            )}
          </div>
        </div>
      </div>
      <div className='d-flex ps-3 pe-3 pb-3'>
        <button
          className='enter-btn btn drop_box_modal_submit_btn'
          onClick={closeModal}
        >
          {t('cancel')}
        </button>
        <button
          className='enter-btn btn btn-primary drop_box_modal_submit_btn'
          onClick={onSave}
        >
          {t('save')}
        </button>
      </div>
    </ModalWrapper>
  )
}

export default ProfileModal
