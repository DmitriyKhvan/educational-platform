import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getData } from 'country-list'
import timezone from 'timezones-list'
import Dropdown from 'react-dropdown'

import 'react-dropdown/style.css'
import NotificationManager from '../NotificationManager'
import { updateUserInfo } from '../../actions/user'
import Select from 'react-select'

const BasicInfoForm = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const [disableSave, handleDisableSave] = useState(true)

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: '',
    country: '',
    time_zone: ''
  })

  useEffect(() => {
    setUserData({
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email,
      phone_number: user.phone_number,
      country: user.country,
      time_zone: user.time_zone
    })
  }, [user])

  const countries = getData().map(x => x.name)
  const defaultCountry = countries[232]
  const timezones = timezone.map(x => x.label)
  const defaultTimezone = timezones[15]

  const onChange = e => {
    handleDisableSave(false)
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const onClick = async () => {
    const res = await dispatch(updateUserInfo(userData))
    handleDisableSave(true)
    if (res.type === 'UPDATE_USER_SUCCESS') {
    }

    if (res.type === 'UPDATE_USER_FAILURE') {
      NotificationManager.error(t('update_profile_failed'), t)
    }
  }

  return (
    <div>
      <div className='form-item-inner'>
        <h1>{t('basic_information')}</h1>
        <div className='mb-4'>
          <label htmlFor='first_name' className='form-label'>
            <strong>{t('first_name')}</strong>
          </label>
          <input
            className='form-control mt-3'
            type='text'
            id='first_name'
            name='first_name'
            value={userData.first_name}
            onChange={onChange}
            placeholder='Jessica'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='last_name' className='form-label'>
            <strong>{t('last_name')}</strong>
          </label>
          <input
            className='form-control mt-3'
            type='text'
            id='last_name'
            name='last_name'
            value={userData.last_name}
            onChange={onChange}
            placeholder='Brighton'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='email_address' className='form-label'>
            <strong>{t('email_address')}</strong>
          </label>
          <input
            className='form-control mt-3'
            type='email'
            id='email_address'
            name='email_address'
            value={userData.email_address}
            onChange={onChange}
            placeholder='jessica.brighton@gmail.com'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='phone_number' className='form-label'>
            <strong>{t('phone_number', { ns: 'common' })}</strong>
          </label>
          <input
            className='form-control mt-3'
            type='tel'
            id='phone_number'
            name='phone_number'
            value={userData.phone_number}
            onChange={onChange}
            placeholder='+1 (424) 123-4567'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='location' className='form-label'>
            <strong>{t('location')}</strong>
          </label>
          <Dropdown
            options={countries}
            className='mt-3'
            value={userData.country || defaultCountry}
            name='location'
            onChange={({ value }) => {
              handleDisableSave(false)
              setUserData({ ...userData, country: value })
            }}
          />
        </div>

        {/* <div className='mb-4'>
          <label htmlFor='address' className='form-label'>
            <strong>{t('address')}</strong>
          </label>
          <input
            className='form-control mt-3'
            type='email'
            id='address'
            name='address'
            value={userData.address}
            onChange={onChange}
          />
        </div> */}

        <div className='mb-4'>
          <label htmlFor='timezone' className='form-label'>
            <strong>{t('timezone')}</strong>
          </label>
          {/* <Dropdown
            options={timezones}
            className='mt-3'
            value={userData.time_zone || defaultTimezone}
            name='time_zone'
            onChange={({ value }) => {
              handleDisableSave(false)
              setUserData({ ...userData, time_zone: value })
            }}
          /> */}
          <Select
            className='mt-3'
            value={{
              label: userData.time_zone || defaultTimezone,
              value: userData.time_zone || defaultTimezone
            }}
            options={timezones.map(each => {
              return { label: each, value: each }
            })}
            onChange={({ value }) => {
              handleDisableSave(false)
              setUserData({ ...userData, time_zone: value })
            }}
          />
        </div>

        <div className='mb-4 d-grid gap-2'>
          <button
            data-bs-dismiss='modal'
            className='btn btn-primary'
            onClick={onClick}
            disabled={disableSave}
          >
            {t('save_changes')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm
