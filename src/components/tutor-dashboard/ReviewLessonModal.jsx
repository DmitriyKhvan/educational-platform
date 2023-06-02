import React from 'react';
import Modal from 'react-modal';
import Tutor from '../../assets/images/tutor.png';
import { useForm, Controller } from 'react-hook-form';
import { FileUploader } from 'react-drag-drop-files';
import RadioGroup from '../RadioGroup';

const ReviewLessonModal = ({ isOpen, setIsOpen, lessonInfo }) => {
  const { register, handleSubmit, control, reset } = useForm();
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  lessonInfo = {
    subjectName: 'English',
    studentPic: Tutor,
    studentName: 'Sarah B.',
    level: 2,
    duration: '60',
    date: new Date(),
  };

  const onSubmit = () => {
    closeModal();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName="review-tutor-lesson-modal-overlay"
        className="review-tutor-lesson-modal"
        bodyOpenClassName={'review-tutor-modal-open'}
      >
        <div className="subject-info">
          <div className="left">
            <img src={lessonInfo.studentPic} alt={lessonInfo.studentName} />
            <h1>{lessonInfo.studentName}</h1>
          </div>
          <span>
            {'Level '}{' '}
            <input
              type="text"
              {...register('level', { maxLength: 1 })}
              maxLength={1}
            />
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="body">
            <input
              type="text"
              className="title-input"
              placeholder="Enter title"
              {...register('review_title')}
            />
            <h4>Write feedback</h4>
            <textarea
              name="review"
              id="review"
              placeholder="Write your review here..."
              {...register('review')}
            ></textarea>
            <Controller
              control={control}
              name="file"
              render={({ field: { onChange } }) => (
                <FileUploader types={['PDF']} handleChange={onChange} />
              )}
            />
          </div>

          <div className="modal-footer">
            <div className="buttons">
              <button className="close" onClick={closeModal}>
                Close
              </button>
              <button type="submit">Submit Review</button>
            </div>

            <div className="attendance">
              <h4>Student Attendance</h4>
              <Controller
                control={control}
                name="attendance"
                render={({ field: { onChange, name } }) => (
                  <RadioGroup
                    onChange={onChange}
                    options={[
                      {
                        name: 'present',
                        text: 'Student was present',
                      },
                      {
                        name: 'late',
                        text: 'Student was late',
                      },
                      {
                        name: 'noshow',
                        text: 'No show',
                      },
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
  );
};

export default ReviewLessonModal;
