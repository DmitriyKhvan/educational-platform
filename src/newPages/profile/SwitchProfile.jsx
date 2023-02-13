import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, {
  useEffect,
  useState,
} from 'react';

import Loader from 'react-loader-spinner';

import GeneralProfile from './student/StudentProfile';

import TutorProfile from './Tutors/TutorProfile';

const SwitchProfile = ({ user, isAdmin = false }) => {
  const [isTutor, setIsTutor] = useState(null)

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
                    isAdmin={isAdmin}
                  />  
                )
              }
              {isTutor === true && (
                <TutorProfile
                  user={user}
                  isAdmin={isAdmin}
                />
              )}
              {/* {isAdmin && (
                // <StudentProfile selectedUser={selectedUser} user={user} update={update} isAdmin={isAdmin} />
              )} */}
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

export default SwitchProfile;
