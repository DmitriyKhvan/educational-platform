
import React from 'react'

import cls from "./Sample.module.scss"

import PlaceImg from "../../../assets/Placeholder.png"
import Modal from 'react-modal'
import Check from "../../../assets/check.png"

const SampleModal = ({isOpen, closeModal}) => {

  const sampleInfo = [
    {
      id:1,
      text: "Smile and look at the camera"
    },
    {
      id:2,
      text: "Frame your head and shoulders"
    },
    {
      id:3,
      text: "Your photo is centered and upright"
    },
    {
      id:4,
      text: "Use neutral lighting and background"
    },
    {
      id:5,
      text: "Your face and eyes are fully visible (excerpt for religious reasons)"
    },
    {
      id:6,
      text: "Avoid logos or contact information"
    },
    {
      id:7,
      text: "You are the only person in the photo"
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName='edit-profile-modal-overlay'
      className={cls.sample_modal}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className={cls.sample_card}>
        <div className={cls.sample_card_row}>
          <div className={cls.sample_card_row_left}>
            <section className={cls.sample_card_row_left_title}>
              <h2>Tips for an amazing photo</h2>
            </section>
            <section className={cls.sample_types_row}>
              <div>
                {Array.from({length:6}).map(item => <img src={PlaceImg} alt=""/>)}
              </div>
            </section>
          </div>
          <div className={cls.sample_card_row_right}>
            <span onClick={closeModal}>&times;</span>
            <ul>
              {
                sampleInfo.map(item => 
                  <li>
                    <img src={Check} alt=""/>
                    {item.text}
                  </li>  
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </Modal>
    
  )
}

export default SampleModal