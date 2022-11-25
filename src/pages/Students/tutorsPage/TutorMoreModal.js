

import React from 'react'
import FavIcon from "../../../assets/images/Favorite.png"

import "./TutorModal.scss"

const TutorMoreModal = ({
    setShowTutorModal, 
    tutorId, 
    tutorsList, 
    handleStatusTutor,
  }) => {

  const renderSelectedTutor = tutorsList.find(item => item.id === parseInt(tutorId));
  
  return (
    <div className='tutor_alfa'>
      <div className='tutor_modal'>
        <div className='tutor_banner' style={{background:`url('${(renderSelectedTutor.img)}') center / cover `}}></div>
        <div className='tutor_more-content'>
          {renderSelectedTutor.isFavourite && <img src={FavIcon} alt='' className='favTutorIcon'/>}
          <h1>{renderSelectedTutor.name}</h1>
          <p>
            I’m from San Diego, California, I received a Bachelor’s Degree in English from Harvard University
          </p>
          <p>
            I have a true passion for working with the youngest learners!! Helping each child progress in all areas of their academic development is a challenge that I am honored to accept daily.
          </p>

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

            <div className='bottom_content-status'>
              <div>
                <p>School</p>
                <h3>{renderSelectedTutor.univer}</h3>
              </div>
              <div>
                <p>Degree / Major</p>
                <h3>{renderSelectedTutor.lang}</h3>
              </div>
              <div>
                <p>Topics </p>
                <h3>English, Writing, Debate</h3>
              </div>
            </div>

            <div className='bottom_content-button'>
              <button onClick={() => setShowTutorModal(false)}>
                Cancel
              </button>
              <button>
                Message
              </button>
              <button onClick={() => handleStatusTutor(parseInt(tutorId))}>
                {renderSelectedTutor.isFavourite ? "Remove" : "Favorite"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorMoreModal
