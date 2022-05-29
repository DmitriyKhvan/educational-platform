import React from 'react'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

const TutorImageRow = ({ tutor }) => {
  const tutorProfile = tutor.avatar
    ? tutor.avatar
    : tutor.gender === 'female'
    ? femaleAvatar
    : maleAvatar
  return (
    <React.Fragment>
      <div className='col-3 pe-3 me-3'>
        <img
          className='img-fluid rounded-corners ps-1'
          src={tutorProfile}
          alt=''
          style={{
            objectFit: 'cover',
            height: '150px',
            width: '150px'
          }}
        />
      </div>
      <div className='col-3 pt-4'>
        <div className='row'>
          <h1 className='text-purple'>
            {tutor.first_name + ' ' + tutor.last_name.charAt(0) + '.'}
          </h1>
        </div>
        <div className='row'>
          <h5 className='text-light-grey'>
            <strong>{tutor.university}</strong>
          </h5>
        </div>
        <div className='row'>
          <h5 className='text-light-grey'>{tutor.major || ''}</h5>
        </div>
      </div>
    </React.Fragment>
  )
}

export default TutorImageRow
