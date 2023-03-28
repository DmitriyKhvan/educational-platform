import React, { useEffect, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DAY } from '../../../constants/global'
import { AvailProv } from './AvailabilityProvider'

import {
  getTutorInfo,
  updateTutorAvailability,
  updateExceptionDates
} from '../../../actions/tutor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import AvailabilityDayRow from '../../../components/AvailabilityDayRow'
import AvailabilityPolicyModal from '../../../components/AvailabilityPolicyModal'
import AvailabilityOverrideModal from '../../../components/AvailabilityOverrideModal'
import { AvailabilityProvider } from './AvailabilityProvider'
import TimePicker from 'react-bootstrap-time-picker'
import trashCan from '../../../assets/images/trash_can.svg'
import moment from 'moment-timezone'
import timezone from 'timezones-list'
import { DarkBackground } from '../../../components/common/OverlayStyle'
import LoadingOverlay from 'react-loading-overlay'
import Swal from 'sweetalert2'
import NotificationManager from '../../../../src/components/NotificationManager'
import { v4 as uuid } from 'uuid'
import { useAuth } from '../../../modules/auth'
import { Link } from 'react-router-dom'

export const Availability = ({ isAdmin, user_id }) => {
  const [t] = useTranslation('translation')
  const [gatherAvailabilities, setGatherAvailabilities] = useState({
    exceptiondates: [],
    availability: []
  })
  const [currentDatas, setCurrentDatas] = useState([])
  const [loaded, setLoaded] = useState(true)
  // for debugging
  const [hasValidTimes, setHasValidTimes] = useState(false)
  const [disableSave, handleDisableSave] = useState(true)
  const [isteachAddHours, setIsTeachAddHours] = useState([])
  const [disablePlusBtn, setDisablePlusBtn] = useState(false)
  const [initialId, setInitialId] = useState()
  // tutor policies state and handler
  const [togglePolicyModal, setTogglePolicyModal] = useState(false)
  const [isMonthCheck, setIsMonthCheck] = useState(false)
  const handlePolicyModal = () => {
    setTogglePolicyModal(!togglePolicyModal)
    setIsTeachAddHours(false)
  }
  // tutor policies state and handler
  const [toggleOverrideModal, setToggleOverrideModal] = useState(false)
  const handleOverrideModal = () => {
    setToggleOverrideModal(!toggleOverrideModal)
  }
  const dispatch = useDispatch()
  const tutorInfo = useSelector(state => state.tutor.info)
  const { user } = useAuth()
  const [newRow, setNewRow] = useState(false)
  const [currentToTime, setCurrentToTime] = useState('16:00')

  useEffect(() => {
    if (user && user?.tutor) dispatch(getTutorInfo(user?.tutor?.id))
  }, [user])

  useEffect(() => {
    setInitialId(uuid)
  }, [])

  useEffect(() => {
    var savedData = []
    if (tutorInfo?.availabilities) {
      let count = 0
      for (const property in tutorInfo.availabilities) {
        if (tutorInfo.availabilities[property].length === 1) {
          var temp = {}
          temp.id = String(count++)
          temp.day = property
          temp.slots = tutorInfo.availabilities[property]
          savedData.push(temp)
        }
        if (tutorInfo.availabilities[property].length > 1) {
          tutorInfo.availabilities[property].map(data => {
            var temp = {}
            temp.id = String(count++)
            temp.day = property
            var array = []
            array.push(data)
            temp.slots = array
            savedData.push(temp)
          })
        }
      }
    }
    const tempData = [
      { id: initialId, day: undefined, slots: [{ from: '09:00', to: '17:00' }] }
    ]
    storeAvailablitiy({ exceptiondates: tempData, availability: savedData })
  }, [tutorInfo])
  useEffect(() => {
    if (tutorInfo?.exceptiondates !== undefined) {
      var withId = []
      let count = 0
      tutorInfo.exceptiondates.map(data => {
        var temp = { ...data }
        temp.id = ++count
        withId.push(temp)
      })
      setCurrentDatas(withId)
    }
    const unique = [
      ...new Set(tutorInfo?.exceptiondates.map(item => item.date))
    ]
    if (unique.length >= 9) {
      setIsMonthCheck(true)
    } else {
      setIsMonthCheck(false)
    }
  }, [tutorInfo])

  // saving data in DB using loader
  const onSubmit = async e => {
    setLoaded(!loaded)
    setTimeout(() => {
      setLoaded(true)
      dispatch(
        updateTutorAvailability(gatherAvailabilities.availability, user_id)
      )
      e.target.blur()
      handleDisableSave(true)
    }, 1000)
  }

  // this delete function is Set override date function
  // Add npm package sweetalert2 using delete function
  const deleteRow = async ({ id }) => {
    Swal.fire({
      title: t('swal_fire_title'),
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6133af',
      cancelButtonColor: '#d33',
      cancelButtonText: t('swal_cancel_Button_Text'),
      confirmButtonText: t('swal_confirm_Button_Text')
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire(
          t('swal_fire_title_conform_msg'),
          t('swal_fire_title_conform_msg1'),
          t('swal_fire_title_conform_msg2')
        )
        handleDisableSave(false)
        var filtered = currentDatas.filter(e1 => e1.id !== id)
        var filteredDate = []
        filtered.map(data => {
          var temp = {}
          var array = []
          temp.date = data.date
          var object = {}
          object.from = data.from
          object.to = data.to
          array.push(object)
          temp.slots = array
          filteredDate.push(temp)
        })
        setCurrentDatas(filtered)
        dispatch(updateExceptionDates(filteredDate, user_id))
      }
      setTimeout(() => {
        dispatch(getTutorInfo(user.tutor_profile.id))
      }, 2000)
    })
  }
  const [userData, setUserData] = useState({
    time_zone: ''
  })
  useEffect(() => {
    setUserData({
      time_zone: user.time_zone
    })
  }, [user])
  // timezone map looping
  const timezones = timezone.map(x => x.label)
  // default time-zone is America/Los_Angeles (GMT-08:00)
  const defaultTimezone = timezones[15]
  const array = defaultTimezone || userData.time_zone
  const times_city = array.split(' (GM')
  // date override date groupby date map
  var final = currentDatas
  var result = final.reduce(function (r, a) {
    r[a.date] = r[a.date] || []
    r[a.date].push(a)
    return r
  }, Object.create(null))

  const validateTimesSelected = (availability, day) => {
    /* flat map the time slots array **/
    const timeSlots = availability.flatMap(v => {
      if (v.day === day) {
        return v.slots
      }
    })
    for (let i = 0; i < timeSlots.length; i++) {
      if (timeSlots[i]?.from >= timeSlots[i]?.to) {
        setHasValidTimes(true)
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.'
          ),
          t
        )
        return
      } else if (timeSlots[i + 1]?.from < timeSlots[i]?.to) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.'
          ),
          t
        )
        setHasValidTimes(true)
        return
      } else if (
        timeSlots[i] != undefined &&
        timeSlots[i]?.from === timeSlots[i]?.to
      ) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.'
          ),
          t
        )
        setHasValidTimes(true)
        return
      } else {
        setHasValidTimes(false)
      }
    }
  }

  const AvailabilitySlots = (fromTime, toTime, id, day) => {
    const from = fromTime
    const to = toTime
    const avail = { id, day, slots: [{ from, to }] }
    storeAvailablitiy(
      [...gatherAvailabilities.availability, ...[avail]],
      'availability'
    )
    const data = gatherAvailabilities.availability
    for (const availability of data) {
      const availId = availability.id
      if (availId === id) {
        if (to >= '23:30') {
          setDisablePlusBtn(true)
          // setIsTeachAddHours(true)
        } else {
          setDisablePlusBtn(false)
          // setIsTeachAddHours(false)
        }
        availability.slots[0] = { from, to }
        //validateTimesSelected(data, day)
        storeAvailablitiy(data, 'availability')
      }
    }
  }

  const storeAvailablitiy = (data, type) => {
    if (type) {
      handleDisableSave(false)
      setGatherAvailabilities({ ...gatherAvailabilities, [type]: data })
    } else {
      setGatherAvailabilities(data)
    }
  }
  return (
    <React.Fragment>
      <div className='border-availabilities'>
        <div className='container-fluid mx-0 '>
          <div className='row ms-4'>
            <div className='col-xs-12 col-md-8 p'>
              <h1 className='title'>{t('set_your_availability')}</h1>
              <h3>{t('edit_your_shedule_below')}</h3>
            </div>
            <div className='col-xs-6 col-md-4 pe-5 text-end align-self-center'>
              <Link
                to='/tutor/avail/settings'
                className='btn btn-default align-content-end'
                type='button'
              >
                <FontAwesomeIcon icon={faGear} size='1x' className='me-2' />
                <strong>{t('settings')}</strong>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='container ms-3 align-width_Availability'>
        <h2 className='date_override_title'>{t('set_your_teaching_hours')}</h2>
        <div className='container align-self-center remove-last-border'>
          {DAY.map((day, i) => (
            <AvailabilityProvider
              key={i}
              setGatherAvailabilities={storeAvailablitiy}
              gatherAvailabilities={gatherAvailabilities.availability}
              setIsTeachAddHours={setIsTeachAddHours}
              disablePlusBtn={disablePlusBtn}
              setDisablePlusBtn={setDisablePlusBtn}
              setNewRow={setNewRow}
              AvailabilitySlots={AvailabilitySlots}
              day={t(day)}
              isteachAddHours={isteachAddHours}
              type={'availability'}
              validateTimesSelected={validateTimesSelected}
            >
              <AvailabilityDayRow
                day={t(day)}
                setGatherAvailabilities={storeAvailablitiy}
                gatherAvailabilities={gatherAvailabilities.availability}
                hasValidTimes={hasValidTimes}
                setHasValidTimes={setHasValidTimes}
                isteachAddHours={isteachAddHours}
                setIsTeachAddHours={setIsTeachAddHours}
                setNewRow={setNewRow}
                AvailabilitySlots={AvailabilitySlots}
                setCurrentToTime={setCurrentToTime}
                currentToTime={currentToTime}
                type={'availability'}
              />
            </AvailabilityProvider>
          ))}
          <div
            style={{ display: 'flex', justifyContent: 'end', maxWidth: '100%' }}
          >
            <button
              type='button'
              className='btn btn-secondary save_button'
              data-bs-dismiss='modal'
              onClick={onSubmit}
              disabled={hasValidTimes || disableSave}
            >
              <strong>Save</strong>
            </button>
          </div>
        </div>
      </div>
      {
        //Commented out for now
      }
      {/* <div className='border-availabilities-top mt-5 d-none'>
        <div className='container-fluid'>
          <DarkBackground disappear={!loaded}>
            <LoadingOverlay
              active={true}
              spinner={true}
              text={t('saving_data_loader_content')}
            ></LoadingOverlay>
          </DarkBackground>
          <div className='row justify-content-start'>
            <div className='col-4 pe-3 border-availabilities_right pb-4'>
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
                  disabled={isMonthCheck}
                  onClick={handleOverrideModal}
                >
                  <strong>{t('add_date_override')}</strong>
                </button>
                <AvailabilityProvider>
                  {toggleOverrideModal && (
                    <AvailabilityOverrideModal
                      showModal={toggleOverrideModal}
                      toggleModal={handleOverrideModal}
                      disablePlusBtn={disablePlusBtn}
                      setDisablePlusBtn={setDisablePlusBtn}
                      isteachAddHours={isteachAddHours}
                      setIsTeachAddHours={setIsTeachAddHours}
                      setCurrentToTime={setCurrentToTime}
                      currentToTime={currentToTime}
                      setGatherAvailabilities={storeAvailablitiy}
                      gatherAvailabilities={
                        gatherAvailabilities?.exceptiondates
                      }
                      type={'exceptiondates'}
                      id={initialId}
                    />
                  )}
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
            <div className='col-8 over-ride-date-main'>
              <div className='over-ride-date'>
                {Object.keys(result).map((data, ids) => {
                  let iteratingData = result[data]
                  return (
                    <div className='date-alignframe border_align_row'>
                      <div className='dates-fetch' key={ids}>
                        {moment(data).format('DD MMM yyyy')}
                      </div>
                      {iteratingData.map((datas, iter) => (
                        <div className='row mx-0 rows_align' key={iter}>
                          <div className='col-auto align_time_img-time'>
                            <div className='d-flex'>
                              <TimePicker
                                className='time_picker text-center p-3'
                                start='09:00'
                                end='24:00'
                                step={30}
                                value={datas.from}
                                disabled
                              />
                            </div>
                          </div>
                          <div className='col-auto align-self-center pickerToText'>
                            <span className='text-muted availability_to_text'>
                              TO
                            </span>
                          </div>
                          <div className='col-auto align_time_img-time'>
                            <div className='d-flex'>
                              <TimePicker
                                className='time_picker text-center p-3'
                                start='09:00'
                                end='24:00'
                                step={30}
                                value={datas.to}
                                disabled
                              />
                            </div>
                          </div>

                          <div className='col-auto align-self-center ms-3'>
                            <button
                              type='button'
                              className='btn fa_trash_can ms-3 pb-0'
                              disabled={false}
                              onClick={() => {
                                deleteRow({ id: datas.id })
                              }}
                            >
                              <img src={trashCan} className='fa_icon' alt='' />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div
                        className={`${
                          data && Object.keys(result).length !== ids + 1
                            ? 'border_align_rows'
                            : null
                        }`}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </React.Fragment>
  )
}

export default Availability
