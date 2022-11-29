import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import Loader from 'react-loader-spinner';

import GeneralProfile from './GeneralProfile';
import TutorProfile from './Tutors';
import StudentProfile from './Tutors/Student';
import { useSelector } from 'react-redux';

const Profile = ({ user, selectedUser, isAdmin = false }) => {
  const [t, i18n] = useTranslation('translation')
  const [isTutor, setIsTutor] = useState(null)
  const [update, setUpdate] = useState(false)
  const admin = useSelector(state => state)

  const [disabled, setDisabled] = useState(true)

  const roles = user && user.roles && user.roles[0].role_name;

  useEffect(() => {
    if (user && user.roles) {
      if (roles === 'tutor') {
        setIsTutor(true)
      } else if (roles === 'student') {
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
              {
                isTutor === false && roles === 'student' && !isAdmin &&  (
                  <GeneralProfile
                    currentUser={user}
                    update={update}
                    isAdmin={isAdmin}
                    setDisabled={setDisabled}
                  />  
                )
              }
              {isTutor === true && (
                <TutorProfile
                  user={user}
                  update={update}
                  isAdmin={isAdmin}
                  // setDisabled={d => setDisabled(d)}
                />
              )}
              {isAdmin && (
                <StudentProfile selectedUser={selectedUser} user={user} update={update} isAdmin={isAdmin} />
              )}
            </div>
            {/* <div className='profile-footer'>
              <button
                className='btn-update'
                onClick={() => {
                  setUpdate(true)
                  setTimeout(() => {
                    setUpdate(false)
                    setDisabled(true)
                  }, 1000)
                }}
                disabled={disabled}
              >
                {t('save_changes')}
              </button>
            </div> */}
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
