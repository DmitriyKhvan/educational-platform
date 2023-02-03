import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import Loader from 'react-loader-spinner';

import GeneralProfile from './GeneralProfile';
// import TutorProfile from './Tutors';
import TutorProfile from '../../pages/Profile/Tutors/Profile';

import StudentProfile from './Tutors/Student';
import { useSelector } from 'react-redux';

const Profile = ({ user, selectedUser, isAdmin = false }) => {
  const [t, i18n] = useTranslation('translation')
  const [isTutor, setIsTutor] = useState(null)
  const [update, setUpdate] = useState(false)
  const admin = useSelector(state => state)

  const [disabled, setDisabled] = useState(true)

  console.log(user)

  const roles = user && user.role && user.role;

  useEffect(() => {
    if (user && roles) {
      if (roles === 'tutor') {
        setIsTutor(true)
      } else if (roles === 'student') {
        setIsTutor(false)
      } else {
        setIsTutor(null)
      }
    }
    
    
  }, [user, roles])

  
  return (
    <div className='profile-layout'>
      <div className='profile-wrapper'>
        {user && user.role ? (
          <React.Fragment>
            <div className='profile-body'>
              {
                (isTutor === false && roles === 'student' && !isAdmin) &&  (
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
                />
              )}
              {isAdmin && (
                <StudentProfile selectedUser={selectedUser} user={user} update={update} isAdmin={isAdmin} />
              )}
            </div>
          </React.Fragment>
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
