/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
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
  fetchAppointments
}) => {
  const [t] = useTranslation('translation')
  const [isOpen, setIsOpen] = useState(false)
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [modalType, setModalType] = useState('')

  const [tabIndex, setTabIndex] = useState(0)
  const hours = 13 * 60 * 60
  date = date.length > 9 ? date * 1000 + hours : date + hours
  const isToday = moment(date).isSame(moment(), 'day')
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
  const endEpoch = date + data.duration * 60
  const startTime = moment.unix(date).format('LT')
  const endTime = moment.unix(endEpoch).format('LT')

  const today = moment()
  const startTimeEpoch = moment.unix(date)
  const oneMinuteAfterStart = moment.unix(
    moment(startTimeEpoch).unix() + 1 * 60
  )
  const fiveMinutesBefore = moment.unix(moment(startTimeEpoch).unix() - 10 * 60)
  const isBetween = moment(today).isBetween(
    fiveMinutesBefore,
    oneMinuteAfterStart
  )
  const joinLesson = async () => {
    if (isBetween) {
      window.location.href = zoomlink.url
    } else {
      setIsWarningOpen(true)
    }
  }

  return (
    <div
      className={`page-card ${
        index !== 0 ? 'purple' : 'grey-border bg-white'
      } small-card pt-2 mt-4`}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-9'>
            <h1 className={`${index !== 0 ? 'text-white' : 'text-black'}`}>
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3 className={`${index !== 0 ? 'text-white' : 'text-muted'}`}>
              {isToday ? 'Today' : moment.unix(date).format('ddd')} at{' '}
              {startTime} → {endTime}
            </h3>
          </div>
          <div className='col-3'>
            <img
              src={gender === 'male' ? maleAvatar : femaleAvatar}
              className='img-fluid align-middle schedule-image rounded-corners'
              alt=''
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='schedule-card-col'>
          <a
            onClick={joinLesson}
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('join_lesson')}
          </a>
        </div>
        <div className='schedule-card-col'>
          {/* <Dropdown trigger={['click']} overlay={menu} animation='slide-up'> */}
          <a
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
            onClick={onSelect}
          >
            Reschedule
          </a>
          {/* </Dropdown> */}
        </div>
        <div className='schedule-card-col'>
          <a
            onClick={onCancel}
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
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
