import React from 'react'
import { useTranslation } from 'react-i18next'

const AvailabilityPolicyModal = ({ showModal, toggleModal }) => {
  const [t] = useTranslation()
  return (
    <>
      {showModal && (
        <div className='modal fade' id='policyModal' tabindex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content p-0'>
              <div className='modal-header  border-availabilities pt-2 ps-2'>
                <h2
                  className='modal-title modal_title mb-0 ps-3'
                  id='policyModal'
                >
                  {t('tutor_policies')}
                </h2>
                <p className='date_override_text_color mt-0 pt-0 ps-3 '>
                  {t('tutor_policies_desc')}
                </p>
              </div>
              <div className='modal-body ps-4 pt-3 pb-3 m-0 border-availabilities'>
                <span>
                  <strong>Heading</strong>
                </span>
                <p className='modal_text_wrapper'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Dignissim suspendisse in est ante in nibh.
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary modal_close_button'
                  data-bs-dismiss='modal'
                  onClick={toggleModal}
                >
                  <strong> Close Window</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AvailabilityPolicyModal
