import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import '../assets/styles/date.css'
import { getTutorInfo, updateExceptionDates } from '../actions/tutor'
import { AvailabilityProvider } from '../pages/Tutors/Availiability/AvailabilityProvider'
import AvailabilityDayRowOver from '../components/AvailabilityDayRowOver'
import AvailabilityPickerOver from '../pages/Tutors/Availiability/AvailabilityPicker'
import CloseIcon from '../assets/images/Close icon.svg'
import { useSelector } from 'react-redux'
import ClipLoader from 'react-spinners/ClipLoader'
const AvailabilityOverrideModal = ({
  showModal,
  toggleModal,
  user_id,
  isAdmin
}) => {
  const [t] = useTranslation()
  const avail = useContext(AvailProv)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [gatherAvailabilities, setGatherAvailabilities] = useState([])
  const [hasValidTimes, setHasValidTimes] = useState(false)
  const dispatch = useDispatch()
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )
  useEffect(() => {
    if (user && user.tutor_profile)
      dispatch(getTutorInfo(user.tutor_profile.id))
  }, [user])
  const [currentDatas, setCurrentDatas] = useState([])
  useEffect(() => {
    setCurrentDatas(tutorInfo?.exceptiondates)
  }, [tutorInfo])
  const [loadings, setLoadings] = useState(false)
  const [loading, setLoading] = useState(false)
  const onSubmits = async () => {
    setTimeout(() => {
      setLoading(true)
      gatherAvailabilities.map((date, index) => {
        date.date = startDate
      })
      var updatedData = [...gatherAvailabilities]
      currentDatas.map(data => {
        var temp = {}
        var time = []
        time.push(data)
        temp.slots = time
        temp.date = data.date
        updatedData.push(temp)
      })
      dispatch(updateExceptionDates(updatedData, user_id))
      setLoadings(toggleModal)
      setLoading(false)
    }, 1000)
    setTimeout(() => {
      dispatch(getTutorInfo(user.tutor_profile.id))
    }, 2000)
  }
  return (
    <>
      {showModal && (
        <div className='modal fade' id='overrideModal '>
          <div className='modal-dialog modalSize'>
            <div className='modal-content p-0'>
              <div className='modal-header  border-availabilities ps-3 pt-3'>
                <div className='d-flex'>
                  <h2
                    className='modal-title modal_title mb-0 ps-3'
                    id='overrideModalLabel'
                  >
                    {t('override_dates')}
                  </h2>
                  <img
                    className='Close_Icon'
                    src={CloseIcon}
                    alt=''
                    onClick={toggleModal}
                  />
                </div>

                <p className='date_override_text_color mt-0 pt-0 ps-3 pe-3 '>
                  {t('override_date_info')}
                </p>
              </div>
              <div className='modal-body pb-0 m-0'>
                <div className='container'>
                  <div className='row'>
                    <div className='col-5 border-availabilities-right'>
                      <DatePicker
                        dateFormat='d MMM yyyy'
                        formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        startDate={startDate}
                        minDate={new Date()}
                        endDate={endDate}
                        inline
                      />
                    </div>
                    <div className='col align-override-ui'>
                      <div className='ms-3 check'>
                        <div className='selct-time '>{t('select_the_time')}</div>
                        <AvailabilityProvider
                          date={startDate}
                          setGatherAvailabilities={setGatherAvailabilities}
                          gatherAvailabilities={gatherAvailabilities}
                        >
                          <AvailabilityDayRowOver
                            date={startDate}
                            setGatherAvailabilities={setGatherAvailabilities}
                            gatherAvailabilities={gatherAvailabilities}
                            hasValidTimes={hasValidTimes}
                            setHasValidTimes={setHasValidTimes}
                          />
                        </AvailabilityProvider>
                        {avail.availabilityRow.map(k => {
                          return (
                            <>
                              <AvailabilityPickerOver
                                key={k.id}
                                i={avail.availabilityRow.length + 1}
                                id={k.id}
                                date={startDate}
                              />
                            </>
                          )
                        })}
                      </div>
                      <div className='footer-columnwise'>
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
                          onClick={() => onSubmits(setLoading(!loading))}
                          disabled={hasValidTimes}
                        >
                          {loading ? (
                            <ClipLoader
                              loading={loading}
                              size={20}
                              color='white'
                            />
                          ) : (
                            <strong>Save</strong>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default AvailabilityOverrideModal
