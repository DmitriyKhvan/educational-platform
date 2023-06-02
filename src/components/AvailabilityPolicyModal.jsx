import React from 'react';
import { useTranslation } from 'react-i18next';
const AvailabilityPolicyModal = ({ showModal, toggleModal }) => {
  const [t] = useTranslation();
  return (
    <>
      {showModal && (
        <div className="modal fade" id="policyModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-0">
              <div className="modal-header  border-availabilities pt-2 ps-2">
                <h2
                  className="modal-title modal_title mb-0 ps-3"
                  id="policyModal"
                >
                  {t('tutor_policies')}
                </h2>
                <p className="date_override_text_color mt-0 pt-0 ps-3 ">
                  {t('tutor_policies_desc')}
                </p>
              </div>
              <div className="modal-body ps-4 pt-3 pb-3 m-0 border-availabilities">
                <p className="modal_text_wrapper">
                  Nao Now has created this policy to define the requirements of
                  establishing and maintaining a consistent attendance policy.
                  Teacher attendance is directly related to student academic
                  outcomes and parent satisfaction. Being absent, late to class,
                  or requesting frequent subs affects many parties and is a
                  disruption to the learning experience of our students.
                </p>
                <p className="modal_text_wrapper">
                  <b>Scenario A: No-Show or Cancellation Within 24 Hours</b>
                  <ol>
                    <li>If you no-show or cancel a class within 24 hours:</li>
                    <ol type="a">
                      <li>
                        <b>
                          If you do not provide proof of a legitimate reason
                        </b>{' '}
                        after class, you will be fined the amount you would have
                        been paid per class.
                      </li>
                      <li>
                        <b>
                          If you are able to provide proof of a legitimate
                          excuse with documentation
                        </b>
                        , there will be no repercussions. Your fines will be
                        refunded. NO-SHOWS and last minute cancellations that
                        are documented with a legitimate reason are stricken
                        from your record and will not affect your tutoring
                        status at Nao Now. We request that you try your very
                        best to notify us in advance of a last minute emergency
                        cancellation if at all possible.
                      </li>
                    </ol>
                    <li>
                      <b>
                        After the third no-show (or cancellation of a scheduled
                        class) within 3 months
                      </b>
                      , we will terminate your contract with Nao Now.
                    </li>
                    <li>
                      No-showing or last minute cancellations for multiple
                      classes within one day would count as one strike on your
                      record.
                    </li>
                  </ol>
                  <b>
                    Scenario B: Cancellation of a Scheduled Class More Than 24
                    Hours In Advance
                  </b>
                  <ol>
                    <li>
                      After a student has booked a lesson with you, if you
                      cannot teach:
                    </li>
                    <ol type="a">
                      <li>
                        <b>
                          If you do not provide proof of a legitimate excuse
                        </b>
                        , you will be fined half the amount you would have been
                        paid for the class.
                      </li>
                      <li>
                        <b>If you provide proof of a legitimate excuse</b>,
                        there will be no repercussions.
                      </li>
                    </ol>
                    <li>
                      After the third{' '}
                      <b>cancellation (or no-show) within 3 months</b>, we will
                      terminate your contract with Nao Now.
                    </li>
                    <li>
                      Cancellations for multiple classes within one day would
                      count as one strike on your record.
                    </li>
                  </ol>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary modal_close_button"
                  data-bs-dismiss="modal"
                  onClick={toggleModal}
                >
                  <strong>Close Window</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailabilityPolicyModal;
