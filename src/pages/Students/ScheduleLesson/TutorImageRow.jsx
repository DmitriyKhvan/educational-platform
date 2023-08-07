import React from 'react';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';

const TutorImageRow = ({ tutor }) => {
  const tutorProfile = tutor.avatar?.url
    ? tutor.avatar.url
    : tutor.avatar
    ? tutor.avatar
    : tutor.gender === 'female'
    ? femaleAvatar
    : maleAvatar;
  return (
    <React.Fragment>
      <div className="col-3 pe-3 me-3 image-align-tutor">
        <img
          className="img-fluid rounded-corners ps-0"
          src={tutorProfile}
          alt=""
          style={{
            objectFit: 'cover',
            height: '150px',
            width: '150px',
          }}
        />
      </div>
      <div className="col-3 pt-4 Text-align-tutor">
        <div className="row">
          <h1 className="text-purple select_tutors_aligns">
            {tutor.firstName + ' ' + tutor.lastName}
          </h1>
        </div>
        <div className="row">
          <h5 className="text-light-grey university-text-font select_tutors_aligns">
            <div>{tutor.university}</div>
          </h5>
        </div>
        <div className="row">
          <h5 className="text-light-grey select_tutors_aligns">
            {tutor.major || ''}
          </h5>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TutorImageRow;
