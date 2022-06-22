import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DAY } from '../../../constants/global'
import { getTutorInfo, updateTutorAvailability } from '../../../actions/tutor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import AvailabilityDayRow from '../../../components/AvailabilityDayRow'
import AvailabilityPolicyModal from '../../../components/AvailabilityPolicyModal'
import AvailabilityOverrideModal from '../../../components/AvailabilityOverrideModal'
import { AvailabilityProvider } from './AvailabilityProvider'

export const Availability = ({ isAdmin, user_id }) => {
  const [t] = useTranslation('translation')
  const [gatherAvailabilities, setGatherAvailabilities] = useState([])

  // for debugging
  console.log(gatherAvailabilities)
  const [hasValidTimes, setHasValidTimes] = useState(false)

  // tutor policies state and handler
  const [togglePolicyModal, setTogglePolicyModal] = useState(false)
  const handlePolicyModal = () => {
    setTogglePolicyModal(!togglePolicyModal)
  }

  // tutor policies state and handler
  const [toggleOverrideModal, setToggleOverrideModal] = useState(false)
  const handleOverrideModal = () => {
    setToggleOverrideModal(!toggleOverrideModal)
  }

  const dispatch = useDispatch()
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )

  useEffect(() => {
    if (user && user.tutor_profile)
      dispatch(getTutorInfo(user.tutor_profile.id))
  }, [user])

  const onSubmit = async () => {
    await dispatch(updateTutorAvailability(gatherAvailabilities, user_id))
  }

  return (
    <React.Fragment>
      <div className='border-availabilities'>
        <div className='container-fluid ms-4 '>
          <div className='row'>
            <div className='col-xs-12 col-md-8 p'>
              <h1 className='title'>{t('set_your_availability')}</h1>
              <h3>{t('edit_your_shedule_below')}</h3>
            </div>
            <div className='col-xs-6 col-md-4 pe-5 text-end align-self-center'>
              <a
                href='/tutor/avail/settings'
                className='btn btn-default align-content-end'
                type='button'
              >
                <FontAwesomeIcon icon={faGear} size='1x' className='me-2' />
                <strong>{t('settings')}</strong>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='container ms-3'>
        <h2 className='date_override_title'>{t('set_your_teaching_hours')}</h2>
        <div className='container align-self-center remove-last-border'>
          {DAY.map((day, i) => (
            <AvailabilityProvider
              key={i}
              setGatherAvailabilities={setGatherAvailabilities}
              gatherAvailabilities={gatherAvailabilities}
            >
              <AvailabilityDayRow
                day={t(day)}
                setGatherAvailabilities={setGatherAvailabilities}
                gatherAvailabilities={gatherAvailabilities}
                hasValidTimes={hasValidTimes}
                setHasValidTimes={setHasValidTimes}
              />
            </AvailabilityProvider>
          ))}
          <div
            style={{ display: 'flex', justifyContent: 'end', maxWidth: '77%' }}
          >
            <button
              type='button'
              className='btn btn-secondary save_button'
              data-bs-dismiss='modal'
              onClick={onSubmit}
              disabled={hasValidTimes}
            >
              <strong>Save</strong>
            </button>
          </div>
        </div>
      </div>
      <div className='border-availabilities-top mt-5'>
        <div className='container-fluid'>
          <div className='row justify-content-start'>
            <div className='col ms-5 pe-3 border-availabilities_right pb-4'>
              <h2 className='date_override_title mt-4'>
                {t('add_date_overrides')}
              </h2>
              <p className='date_override_text_color date_override_p1_break'>
                {t('add_date_override_info_one')}
              </p>
              <p className='date_override_text_color date_override_p2_break'>
                {t('add_date_override_info_two')}
              </p>
              <div className='align-self-center align-content-center'>
                <button
                  className='btn btn-lg-tutor'
                  type='button'
                  onClick={handleOverrideModal}
                >
                  <strong>{t('add_date_override')}</strong>
                </button>
                <AvailabilityProvider>
                  <AvailabilityOverrideModal
                    showModal={toggleOverrideModal}
                    toggleModal={handleOverrideModal}
                  />
                </AvailabilityProvider>
              </div>
              <div className='align-self-center align-content-center mt-3'>
                <button
                  className='btn btn-sm-tutor'
                  type='button'
                  onClick={handlePolicyModal}
                >
                  <strong>{t('show_tutor_policies')}</strong>
                </button>
                <AvailabilityPolicyModal
                  showModal={togglePolicyModal}
                  toggleModal={handlePolicyModal}
                />
              </div>
            </div>
            <div className='col'></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Availability
