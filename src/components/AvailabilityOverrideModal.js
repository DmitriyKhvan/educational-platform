import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AvailabilityPicker from '../pages/Tutors/Availiability/AvailabilityPicker'
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider'
import plusIcon from '../assets/images/plus_icon.svg'

const AvailabilityOverrideModal = ({ showModal, toggleModal }) => {
  const [t] = useTranslation()
  const avail = useContext(AvailProv)

  const addAvailRow = () => {
    const id = Math.random()
    avail.setAvailabilityRow(row => [...row, { id: id }])
  }

  return (
    <>
      {showModal && (
        <div className='modal fade' id='overrideModal '>
          <div className='modal-dialog modalSize'>
            <div className='modal-content p-0'>
              <div className='modal-header  border-availabilities ps-3 pt-3'>
                <h2
                  className='modal-title modal_title mb-0 ps-3'
                  id='overrideModalLabel'
                >
                  {t('override_dates')}
                </h2>
                <p className='date_override_text_color mt-0 pt-0 ps-3 pe-3 '>
                  {t('override_date_info')}
                </p>
              </div>
              <div className='modal-body ps-3 pb-0 m-0 border-availabilities'>
                <div class='container pt-3 pb-3'>
                  <div className='row'>
                    <div className='col'>
                      <p>TODO: ADD date-picker </p>
                    </div>
                    <div className='col '>
                      <div className='ms-3'>
                        {avail.availabilityRow.map(k => {
                          return (
                            <AvailabilityPicker
                              key={k.id}
                              i={avail.availabilityRow.length + 1}
                              id={k.id}
                            />
                          )
                        })}
                      </div>

                      <div className='d-flex flex-row-reverse'>
                        <button
                          className='btn fa_trash_can'
                          onClick={addAvailRow}
                        >
                          <img className='plus_button' src={plusIcon} alt='' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary modal_close_button'
                  data-bs-dismiss='modal'
                  onClick={toggleModal}
                >
                  <strong>Cancel</strong>
                </button>
                <button
                  type='button'
                  className='btn btn-secondary modal_save_button'
                  data-bs-dismiss='modal'
                  onClick={toggleModal}
                >
                  <strong>Save</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AvailabilityOverrideModal
