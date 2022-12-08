import React from 'react'
import Modal from 'react-modal'
import { useState } from 'react'
import Tutor from '../assets/images/tutor.png'
import { ReactComponent as Close } from '../assets/images/Close icon.svg'
import ImgStarOutline from '../assets/images/star_outline_red.svg'
import ImgStarFill from '../assets/images/star_fill_red.svg'

const ReviewLessonModal = ({ isOpen, setIsOpen, lessonInfo }) => {
  const closeModal = () => {
    setIsOpen(false)
  }
  const [isChecked, onCheck] = useState()
  const [starIndex, setStarIndex] = useState()

  lessonInfo = {
    subjectName: 'English',
    tutorPic: Tutor,
    tutorName: 'Sarah',
    duration: '60',
    date: new Date()
  }

  const lessonStartDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric'
  }).format(lessonInfo.date)

  const lessonEndDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric'
  }).format(new Date(lessonInfo.date.getTime() + lessonInfo.duration * 60000))

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName='review-lesson-modal-overlay'
        className='review-lesson-modal'
      >
        <div className='header'>
          <h3>Lesson Feedback</h3>
          <button>
            <Close />
          </button>
        </div>
        <div className='subject-info'>
          <div className='left'>
            <h1>{lessonInfo.subjectName}</h1>
            <p>
              {lessonStartDate} → {lessonEndDate}
            </p>
          </div>
          <img src={lessonInfo.tutorPic} alt={lessonInfo.tutorName} />
        </div>
        <div className='body'>
          <h4>Why am I being asked this?</h4>
          <p>
            Providing feedback helps NaoNow create a better experience for
            students and tutors.
          </p>
          <h4>Will tutor see my responses?</h4>
          <p>No, your lesson review will be kept private.</p>
          <h4>Tutor attendance</h4>
          <div className='attendance-selector'>
            <label htmlFor='present'>
              <input
                id='present'
                type='radio'
                name='attendance'
                value='present'
                defaultChecked
              />
              Tutor was present
            </label>
            <label htmlFor='late'>
              <input id='late' type='radio' name='attendance' value='late' />
              Tutor was late
            </label>
            <label htmlFor='noshow'>
              <input
                id='noshow'
                type='radio'
                name='attendance'
                value='noshow'
              />
              No show
            </label>
          </div>
          <h4>Rate this tutor</h4>
          <div className='rating'>
            <div className='stars'>
              {[0, 1, 2, 3, 4].map((value, index) => (
                <img
                  key={`img-${index}`}
                  src={starIndex >= index ? ImgStarFill : ImgStarOutline}
                  alt=''
                  onClick={() => setStarIndex(index)}
                />
              ))}
            </div>
          </div>

          <h4>Write a review</h4>
          <textarea
            name='review'
            id='review'
            placeholder='Write your review here...'
          ></textarea>
          <button type='submit'>Submit Review</button>
        </div>
      </Modal>
    </>
  )
}

export default ReviewLessonModal
