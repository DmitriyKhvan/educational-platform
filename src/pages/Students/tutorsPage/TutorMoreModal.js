

import React from 'react'

import Tut from "../../../assets/images/nao.png"
import MorePic from "../../../assets/images/video container.png"

import "./TutorModal.scss"

const TutorMoreModal = () => {
  return (
    <div className='tutor_alfa'>
      <div className='tutor_modal'>
        <div className='tutor_banner' style={{background:`url(${(Tut)}) center / cover `}}></div>
        <div className='tutor_more-content'>

        </div>
      </div>
    </div>
  )
}

export default TutorMoreModal
