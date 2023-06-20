import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, { useEffect, useState } from 'react';

import Loader from 'react-loader-spinner';

import GeneralProfile from '../../pages/Students/Profile/profile/StudentProfile';

import TutorProfile from '../../pages/Mentors/Profile/TutorProfile';

const SwitchProfile = ({ user, isAdmin = false }) => {
  const [isMentor, setIsMentor] = useState(null);

  const roles = user && user.role && user.role;

  useEffect(() => {
    if (user && roles) {
      if (roles === 'mentor') {
        setIsMentor(true);
      } else if (roles === 'student') {
        setIsMentor(false);
      } else {
        setIsMentor(null);
      }
    }
  }, [user, roles]);

  return (
    <div className="profile-layout">
      <div className="profile-wrapper">
        {user && user.role ? (
          <React.Fragment>
            <div className="profile-body">
              {isMentor === false && roles === 'student' && !isAdmin && (
                <GeneralProfile currentUser={user} isAdmin={isAdmin} />
              )}
              {isMentor === true && (
                <TutorProfile user={user} isAdmin={isAdmin} />
              )}
            </div>
          </React.Fragment>
        ) : (
          <Loader
            className="align-center"
            type="Audio"
            color="#00BFFF"
            height={50}
            width={50}
          />
        )}
      </div>
    </div>
  );
};

export default SwitchProfile;
