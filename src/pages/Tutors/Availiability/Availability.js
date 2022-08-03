import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DAY } from '../../../constants/global'
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
export const Availability = ({ isAdmin, user_id }) => {
  const [t] = useTranslation('translation')
  const [gatherAvailabilities, setGatherAvailabilities] = useState([])
  const [currentDatas, setCurrentDatas] = useState([])
  const [loaded, setLoaded] = useState(true)
  // for debugging
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
  useEffect(() => {
    var savedData = []
    if (tutorInfo?.availabilities) {
      let count = 0
      for (const property in tutorInfo.availabilities) {
        if (tutorInfo.availabilities[property].length === 1) {
          var temp = {}
          temp.id = count++
          temp.day = property
          temp.slots = tutorInfo.availabilities[property]
          savedData.push(temp)
        }
        if (tutorInfo.availabilities[property].length > 1) {
          tutorInfo.availabilities[property].map(data => {
            var temp = {}
            temp.id = count++
            temp.day = property
            var array = []
            array.push(data)
            temp.slots = array
            savedData.push(temp)
          })
        }
      }
    }
    setGatherAvailabilities(savedData)
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
  }, [tutorInfo])

  // saving data in DB using loader
  const onSubmit = async () => {
    setTimeout(() => {
      setLoaded(true)
      dispatch(updateTutorAvailability(gatherAvailabilities, user_id))
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
      <div className='container ms-3 align-width_Availability'>
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
            style={{ display: 'flex', justifyContent: 'end', maxWidth: '100%' }}
          >
            <button
              type='button'
              className='btn btn-secondary save_button'
              data-bs-dismiss='modal'
              onClick={() => onSubmit(setLoaded(!loaded))}
              disabled={hasValidTimes}
            >
              <strong>Save</strong>
            </button>
          </div>
        </div>
      </div>
      <div className='border-availabilities-top mt-5'>
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
            <div className='col-8 over-ride-date-main'>
              <div className='over-ride-date'>
                {Object.keys(result).map((data, ids) => {
                  let iteratingData = result[data]
                  return (
                    <div className='date-alignframe border_align_row'>
                      <div className='dates-fetch' key={ids}>
                        {moment(data).tz(times_city[0]).format('DD MMM yyyy')}
                      </div>
                      {iteratingData.map((datas, iter) => (
                        <div className='row mx-0 rows_align' key={iter}>
                          <div className='col-auto align_time_img-time'>
                            <div className='d-flex'>
                              <TimePicker
                                className='time_picker text-center p-3'
                                start='09:00'
                                end='17:00'
                                step={30}
                                value={datas.from}
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
                                end='17:00'
                                step={30}
                                value={datas.to}
                              />
                      
                            </div>
                          </div>

                          <div className='col-auto align-self-center ms-3'>
                            <button
                              type='button'
                              className='btn fa_trash_can ms-3 pb-0'
                              disabled={false}
                              onClick={() => deleteRow({ id: datas.id })}
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
      </div>
    </React.Fragment>
  )
}

export default Availability
