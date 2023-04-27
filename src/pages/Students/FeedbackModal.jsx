import React from 'react';
import Modal from 'react-modal';

export default function FeedbackModal({ isOpen, closeModal }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="edit-profile-modal-overlay"
      className={'feedback-modal'}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className="feedback-modal_title">
        <h2>Lesson Feedback</h2>

        <span onClick={closeModal}>&times;</span>
      </div>

      <div className="feedback-modal_lessonInfo">
        <div>
          <h3>Jurrasic Park</h3>
          <div className="inline_btns">
            <button>Private Lesson</button>
            <button>30 minutes</button>
            <button>Level 3</button>
          </div>
        </div>
        <div>
          <img
            src="https://pngimg.com/uploads/girls/girls_PNG6465.png"
            alt=""
          />
        </div>
      </div>

      <div className="feedback-modal_topics">
        <h2>Topic</h2>

        <div className="topic_block">
          <h3>Jurrasic Park</h3>
          <div>Enter your lesson where you finish the class</div>
        </div>

        <div className="choose_topic">
          <p>Choose the next topic</p>

          <select>
            <option value="">Jurrasic Park</option>
            <option value="">Marvel</option>
            <option value="">DC</option>
          </select>
        </div>

        <div className="topic_comment">
          <textarea></textarea>
          <button>Submit</button>
        </div>

        <div className="topic_date">
          <h3>Jan 14, 2022</h3>
          <button>{'1:00 PM => 1:30 PM'}</button>
        </div>
      </div>
    </Modal>
  );
}
