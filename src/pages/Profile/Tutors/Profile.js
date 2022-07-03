import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { getTutorInfo } from '../../../actions/tutor'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

const Profile = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
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

  useEffect(() => {
    if (user.tutor_profile?.id) {
      dispatch(getTutorInfo(user.tutor_profile?.id))
    }
  }, [user, dispatch])
  return (
    <Layout>
      <div id='profile-wrapper'>
        <img id='profile_image' src={profileImage} alt='Profile Avatar' />
      </div>
      <div className='children-wrapper pt-1'>
        <div className='row'>
          <div className='col-9'>
            <h1>{user.full_name}</h1>
            <h2 className='mt-1 text-primary'>{tutor?.degree}</h2>
          </div>
          <div className='col-3 my-auto'>
            <Link
              className='btn enter-btn'
              style={border}
              to='/tutor/new-profile-page'
            >
              {t('edit_profile')}
            </Link>
          </div>
        </div>
        <div className='row'>
          <div className='col-7 pe-5'>
            <h3>About me</h3>
            <p>{tutor?.introduction}</p>
          </div>
          <div className='col-5 ps-5 pt-4'>
            <div className='row ps-3'>
              <div className='col-6'>
                <div className='row'>
                  <h4 className='mb-1'>Location</h4>
                  <p className='mt-1'>{user.country}</p>
                </div>
                <div className='row'>
                  <h4 className='mb-1'>Timezone</h4>
                  <p className='mt-1'>{user.time_zone}</p>
                </div>
                <div className='row'>
                  <h4 className='mb-1'>Email Address</h4>
                  <p className='mt-1'>{user.email}</p>
                </div>
              </div>
              <div className='col-6'>
                <div className='row'>
                  <h4 className='mb-1'>University</h4>
                  <p className='mt-1'>{tutor?.university.trim()}</p>
                </div>
                <div className='row'>
                  <h4 className='mb-1'>Phone Number</h4>
                  <p className='mt-1'>{user.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
