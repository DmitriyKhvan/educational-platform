/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import Menu, { Item as MenuItem, Divider } from 'rc-menu'
import Dropdown from 'rc-dropdown'
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png'
import 'rc-dropdown/assets/index.css'
import RescheduleAndCancelModal from './RescheduleAndCancelModal'
import ZoomWarningModal from './ZoomWarningModal'
import RescheduleModal from './RescheduleModal'

const ScheduleCard = ({
  index,
  lesson,
  zoomlink,
  date,
  data,
  fetchAppointments,
  cancelled
}) => {
  const [t] = useTranslation('translation')
  const [isOpen, setIsOpen] = useState(false)
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const user = useSelector(state => state.users.user)
  const userTimezone = user?.time_zone?.split(' ')[0]

  let gender
  if (data.tutor?.gender) {
    gender = data.tutor.gender
  }

  function onSelect() {
    setIsOpen(true)
    setModalType('reschedule-time')
  }

  const closeModal = () => {
    setIsOpen(false)
    setIsWarningOpen(false)
    setTabIndex(0)
  }

  const onCancel = () => {
    setIsOpen(true)
    setModalType('cancel')
  }

  const menu = (
    <Menu onSelect={onSelect}>
      {/* <MenuItem key='1'>
        <p>Reschedule with my tutor</p>
      </MenuItem>
      <Divider /> */}
      <MenuItem key='2'>
        <p>Reschedule with any tutor</p>
      </MenuItem>
    </Menu>
  )

  const today = moment()
  const tenMinuteBeforeStart = moment(date).subtract(10, 'minutes')
  const fiveMinuteBeforeEnd = moment(date).add(data.duration - 5, 'minutes')

  const isBetween = moment(today).isBetween(
    tenMinuteBeforeStart,
    fiveMinuteBeforeEnd
  )

  const joinLesson = async () => {
    if (isBetween) {
      window.location.href = zoomlink.url
    } else {
      setIsWarningOpen(true)
    }
  }

  const displayDate = () => {
    const eventDate = moment(date).tz(userTimezone).format('MMM Do')
    const start = moment(date).tz(userTimezone).format('hh:mm A')
    const end = moment(date)
      .tz(userTimezone)
      .add(data.duration, 'minutes')
      .format('hh:mm A')
    return `${eventDate} at ${start} → ${end}`
  }
  
  return (
    <div
      className={`page-card_schedule ${
        index === 0 ? 'purple' : 'grey-border bg-white'
      } small-card pt-2 mt-4`}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-10 mobile-schedule_dash'>
            <h1
              className={`${index === 0 ? 'text-white m-0' : 'text-black m-0'}`}
            >
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3
              className={`${
                index === 0
                  ? 'text-white m-0 font_schedule_text'
                  : 'text-muted m-0 font_schedule_text'
              }`}
            >
              {displayDate()}
              
            </h3>
          </div>
          <div className='col-2 cols-image-schedule mobile-schedule_dash'>
            <img
              src={
                data.tutor.user.avatar
                  ? data.tutor.user.avatar
                  : gender === 'male'
                  ? maleAvatar
                  : femaleAvatar
              }
              className={`img-fluid align-middle schedule_images-width ${
                index === 0
                  ? 'img-fluid align-middle schedule_images-width round_schedule-width'
                  : 'img-fluid align-middle schedule_images-width'
              }`}
              alt=''
            />
          </div>
        </div>
      </div>

      <div className='row align_schedule-lesson d-flex'>
        <div className='schedule-card-col join_schedule-lesson ms-2'>
          <a
            onClick={joinLesson}
            className={`schedule_copy-button ${
              index === 0
                ? 'text-purple mobile-schedule_dash'
                : 'grey-border text-black'
            }`}
          >
            {t('join_lesson')}
          </a>
        </div>
        <div className='schedule-card-col re_schedule-lesson ms-2'>
          {/* <Dropdown trigger={['click']} overlay={menu} animation='slide-up'> */}
          <a
            className={`schedule_copy-button ${
              index === 0
                ? 'text-purpless back_schedule-button mobile-schedule_dash'
                : 'grey-border text-black'
            }`}
            onClick={onSelect}
          >
            {t('reschedule')}
          </a>
          {/* </Dropdown> */}
        </div>
        <div className='schedule-card-col cancel_schedule-lesson'>
          <a
            onClick={onCancel}
            className={`schedule_copy-button ${
              index === 0
                ? 'text-purpless back_schedule-button m-0 mobile-schedule_dash'
                : 'grey-border text-black m-0'
            }`}
          >
            {t('cancel')}
          </a>
        </div>
      </div>
      {isOpen && (
        <RescheduleAndCancelModal
          data={data}
          isOpen={isOpen}
          closeModal={closeModal}
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          fetchAppointments={fetchAppointments}
          tabIndex={tabIndex}
          type={modalType}
          cancelled={cancelled}
        />
      )}
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </div>
  )
}

export default ScheduleCard
