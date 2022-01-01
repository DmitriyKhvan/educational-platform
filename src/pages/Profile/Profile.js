import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StudentProfile from './Student'
import TutorProfile from './Tutors'
import GeneralProfile from './GeneralProfile'
import Loader from 'react-loader-spinner'
import IconMedal from '../../assets/images/medal.svg'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { useTranslation } from 'react-i18next'

const Profile = ({ user, isAdmin = false }) => {
  const [t, i18n] = useTranslation('translation')
  const [isTutor, setIsTutor] = useState(null)
  const [update, setUpdate] = useState(false)

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (user && user.roles) {
      if (user.roles[0].role_name === 'tutor') {
        setIsTutor(true)
      } else if (user.roles[0].role_name === 'student') {
        setIsTutor(false)
      } else {
        setIsTutor(null)
      }
    }
  }, [user])

  return (
    <div className='profile-layout'>
      <div className='profile-wrapper'>
        {user && user.roles ? (
          <>
            <div className='profile-body'>
              {/* {isTutor === false &&
                  <div className="level-view">
                    <img src={IconMedal} alt="" />
                    <p>Intermediate level</p>
                  </div>
                } */}
              <GeneralProfile user={user} update={update} isAdmin={isAdmin} />
              {isTutor === true && (
                <TutorProfile
                  user={user}
                  update={update}
                  isAdmin={isAdmin}
                  setDisabled={d => setDisabled(d)}
                />
              )}
              {isTutor === false && (
                <StudentProfile user={user} update={update} isAdmin={isAdmin} />
              )}
            </div>
            <div className='profile-footer'>
              <button
                className='btn-update'
                onClick={() => {
                  setUpdate(true)
                  setTimeout(() => {
                    setUpdate(false)
                  }, 1000)
                }}
                disabled={disabled}
              >
                {t('save_changes')}
              </button>
            </div>
          </>
        ) : (
          <Loader
            className='align-center'
            type='Audio'
            color='#00BFFF'
            height={50}
            width={50}
          />
        )}
      </div>
    </div>
  )
}

export default Profile
