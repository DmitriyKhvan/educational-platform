import React from 'react'
import { useParams } from 'react-router-dom'
import FavIcon from '../../assets/images/Favorite.png'

import './StudentsModal.scss'

const StudentsModal = ({
  setShowStudentModal,
  studentId,
  studentList,
  handleStatusTutor
}) => {
  const { id } = useParams()

  const renderSelectedTutor = studentList?.find(
    item => item.id === (studentId ? studentId : id)
  )

  return (
    <div className='tutor_alfa'>
      <div className='tutor_modal'>
        <img
          src={renderSelectedTutor?.avatar?.url}
          width='500px'
          className='student_image'
          alt=''
        />
        <div className='tutor_more-content'>
          {renderSelectedTutor?.isFavourite && (
            <img src={FavIcon} alt='' className='favTutorIcon' />
          )}
          <h1>{`${renderSelectedTutor?.user.firstName} ${renderSelectedTutor?.user.lastName}`}</h1>
          <p>{renderSelectedTutor?.about}</p>

          <div className='bottom_content'>
            <p>
              “Great review about Sarah by a fellow NaoNow Student”.
              <br />
              <span>— Jane Doe (Age 14)</span>
            </p>
            <p>
              “Great review about Sarah by a fellow NaoNow Student”.
              <br />
              <span>— Jane Doe (Age 14)</span>
            </p>

            <div className='bottom_content-button'>
              <button onClick={() => setShowStudentModal(false)}>Cancel</button>
              <button>Message</button>
              <button onClick={() => handleStatusTutor(parseInt(studentId))}>
                {renderSelectedTutor?.isFavourite ? 'Remove' : 'Favorite'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentsModal
