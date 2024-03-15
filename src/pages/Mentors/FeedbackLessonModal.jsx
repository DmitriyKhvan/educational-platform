import React from 'react';
import Modal from 'react-modal';
import { AiOutlineCheck } from 'react-icons/ai';

export default function FeedbackLessonModal({ isOpen, closeModal }) {
  const [showSectionName, setSectionName] = React.useState(false);
  const [pageState, setPageState] = React.useState(1);
  const pages = [1, 2];

  const handleComplete = (e) => {
    if (e === 'no') {
      setSectionName(true);
    } else {
      setSectionName(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="edit-profile-modal-overlay"
      className={'feedback-mentor-modal'}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className="feedback-mentor-modal_title">
        <h2>Lesson Feedback</h2>

        <div className="feedback-modal-pages">
          {pages.map((item) => (
            <button
              onClick={() => setPageState(item)}
              className={pageState === item ? 'active-page-button' : ''}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {pageState === 1 && (
        <article>
          <section>
            <div className="feedback-mentor-modal_lessonInfo">
              <div>
                <h3>Jurrasic Park</h3>
                <div className="inline_btns">
                  <button>Private Lesson</button>
                  <button>30 minutes</button>
                  <button>Level 3</button>
                  <button>Rachel</button>
                </div>
              </div>
              <div>
                <img
                  src="https://pngimg.com/uploads/girls/girls_PNG6465.png"
                  alt=""
                />
              </div>
            </div>

            <div className="lesson_topic">
              <h3>Lesson Topic</h3>
              <select>
                <option>Iron Man:</option>
                <option>Jurrasic Park</option>
              </select>
            </div>

            <div className="complete_lesson">
              <h3>Did you complete the lesson?</h3>
              <div>
                <select onChange={(e) => handleComplete(e.target.value)}>
                  <option value={'yes'}>Yes</option>
                  <option value={'no'}>No</option>
                </select>

                {showSectionName && (
                  <select>
                    <option value={''}>Section Name</option>
                    <option value={'no'}>Iron Man</option>
                  </select>
                )}
              </div>
            </div>
          </section>

          <section className="summary_lesson">
            <div>
              <h3>Summary of the lesson:</h3>
              <textarea
                value={
                  'Арно́льд Ало́ис Шварцене́ггер — американский культурист, предприниматель, киноактёр, продюсер, государственный и политический деятель австрийского происхождения.'
                }
              ></textarea>
              <p>0 characters left</p>
            </div>

            <div className="vocab">
              <h3>Vocabulary</h3>

              <div className="vocab_inline">
                <button>Net</button>
                <button>Professional</button>
                <button>Spend</button>
                <button>Math</button>
              </div>
            </div>
          </section>

          <section className="foot_btns">
            <div>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={() => setPageState(2)}>Next</button>
            </div>
          </section>
        </article>
      )}

      {pageState === 2 && (
        <article>
          <section>
            <div className="feedback-mentor-modal_lessonInfo">
              <div className="homework_info_inline">
                <h3>Iron Man</h3>
                <div className="inline_btns">
                  <button>Private Lesson</button>
                  <button>30 minutes</button>
                  <button>Level 3</button>
                </div>
              </div>
            </div>

            <div className="student_key">
              <h4>Student&apos;s key strength:</h4>

              <textarea
                value={
                  'Арно́льд Ало́ис Шварцене́ггер — американский культурист, предприниматель, киноактёр, продюсер, государственный и политический деятель австрийского происхождения.'
                }
              ></textarea>
              <p>500 characters left</p>
            </div>
            <div className="student_key">
              <h4>Opportunities for growth:</h4>

              <textarea
                value={
                  'Арно́льд Ало́ис Шварцене́ггер — американский культурист, предприниматель, киноактёр, продюсер, государственный и политический деятель австрийского происхождения.'
                }
              ></textarea>
              <p>500 characters left</p>
            </div>

            <div className="choose_hw">
              <h3>Choose home work to assign:</h3>

              <div className="type_lessons">
                <div className="type_lessons_card">
                  <article>
                    <div>
                      <h3>Video</h3>
                    </div>
                    <div className="type_lessons_card_info">
                      <button>Option 1</button>
                      <p>Do you any art in your home?</p>
                    </div>
                  </article>
                  <article>
                    <div className="type_right">
                      <button>
                        <div>!</div>
                      </button>
                      <button>
                        <AiOutlineCheck />
                      </button>
                    </div>
                  </article>
                </div>
                <div className="type_lessons_card">
                  <article>
                    <div>
                      <h3>Video</h3>
                    </div>
                    <div className="type_lessons_card_info">
                      <button>Option 1</button>
                      <p>Do you any art in your home?</p>
                    </div>
                  </article>
                  <article>
                    <div className="type_right">
                      <button>
                        <div>!</div>
                      </button>
                      <button>
                        <AiOutlineCheck />
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="foot_btns">
            <div>
              <button onClick={closeModal}>Cancel</button>
              <button>Submit</button>
            </div>
          </section>
        </article>
      )}
    </Modal>
  );
}
