import React from 'react';
import { Avatar } from 'src/widgets/Avatar/Avatar';

const TutorImageRow = ({ tutor }) => {
  return (
    <React.Fragment>
      <div className="col-3 pe-3 me-3 image-align-tutor">
        <div className="w-[150px] h-[150px] rounded-[15px] overflow-hidden">
          <Avatar avatarUrl={tutor.avatar?.url} gender={tutor.gender} />
        </div>
      </div>
      <div className="col-3 pt-4 Text-align-tutor">
        <div className="row">
          <h1 className="text-purple select_tutors_aligns">
            {tutor.fullName || tutor.firstName + ' ' + tutor.lastName}
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
