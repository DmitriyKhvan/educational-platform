import React from 'react'
import Modal from 'react-modal'
import Tutor from '../../assets/images/tutor.png'
import { useForm, Controller } from 'react-hook-form'
import { FileUploader } from 'react-drag-drop-files'
import RadioGroup from '../RadioGroup'

const ReviewLessonModal = ({ isOpen, setIsOpen, lessonInfo }) => {
  const { register, handleSubmit, control, reset } = useForm()
  const closeModal = () => {
    setIsOpen(false)
    reset()
  }

  lessonInfo = {
    subjectName: 'English',
    studentPic: Tutor,
    studentName: 'Sarah B.',
    level: 2,
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

  const onSubmit = data => {
    console.log(data)
    closeModal()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName='review-tutor-lesson-modal-overlay'
        className='review-tutor-lesson-modal'
        bodyOpenClassName={'review-tutor-modal-open'}
      >
        <div className='subject-info'>
          <div className='left'>
            <img src={lessonInfo.studentPic} alt={lessonInfo.studentName} />
            <h1>{lessonInfo.studentName}</h1>
          </div>
          <span>{'Level ' + lessonInfo.level}</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='body'>
            <h1>Nao Now Level 2: Golden Gate Bridge</h1>
            <h4>Write a review</h4>
            <textarea
              name='review'
              id='review'
              placeholder='Write your review here...'
              {...register('review')}
            ></textarea>
            <Controller
              control={control}
              name='file'
              render={({ field: { onChange } }) => (
                <FileUploader types={['PDF']} handleChange={onChange} />
              )}
            />
          </div>

          <div className='modal-footer'>
            <div className='buttons'>
              <button className='close' onClick={closeModal}>
                Close
              </button>
              <button type='submit'>Submit Review</button>
            </div>

            <div className='attendance'>
              <h4>Student Attendance</h4>
              <Controller
                control={control}
                name='attendance'
                render={({ field: { onChange, name } }) => (
                  <RadioGroup
                    onChange={onChange}
                    options={[
                      {
                        name: 'present',
                        text: 'Student was present'
                      },
                      {
                        name: 'late',
                        text: 'Student was late'
                      },
                      {
                        name: 'noshow',
                        text: 'No show'
                      }
                    ]}
                    name={name}
                  />
                )}
              ></Controller>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default ReviewLessonModal
