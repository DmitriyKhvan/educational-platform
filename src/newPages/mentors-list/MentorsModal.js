

import React from 'react'
import { useParams } from 'react-router-dom';
import FavIcon from "../../assets/images/Favorite.png"

import "./MentorsModal.scss"

const MentorsModal = ({
    setShowTutorModal, 
    tutorId, 
    tutorsList, 
    handleStatusTutor,
  }) => {
  
  const {id} = useParams();
  
  const renderSelectedTutor = tutorsList?.find(item => item.id === id);
  
  console.log(renderSelectedTutor)
    
  return (
    <div className='tutor_alfa'>
      <div className='tutor_modal'>
        <iframe width="40%" height="100%" src={`https://www.youtube.com/embed/${renderSelectedTutor?.videoUrl}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        
        <div className='tutor_more-content'>
          {renderSelectedTutor?.isFavourite && <img src={FavIcon} alt='' className='favTutorIcon'/>}
          <h1>{renderSelectedTutor?.userName}</h1>
          <p>   
            {renderSelectedTutor?.about}
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
                <h3>{renderSelectedTutor?.university}</h3>
              </div>
              <div>
                <p>Degree / Major</p>
                <h3>{renderSelectedTutor?.language}</h3>
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
                {renderSelectedTutor?.isFavourite ? "Remove" : "Favorite"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorsModal
