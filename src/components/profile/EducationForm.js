import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorInfo, updateTutorInfo } from '../../actions/tutor'
import { getUserInfo } from '../../actions/user'
import NotificationManager from '../NotificationManager'

const EducationForm = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)

  const [educationData, setEducationData] = useState({
    major: '',
    university: '',
    graduating_year: null,
    degree: '',
    certificates: ''
  })
  useEffect(() => {
    dispatch(getUserInfo())
  }, [])

  useEffect(() => {
    if (user.tutor_profile?.id) {
      dispatch(getTutorInfo(user.tutor_profile?.id))
    }
  }, [user, dispatch])

  useEffect(() => {
    if (tutor) {
      setEducationData({
        major: tutor.major,
        university: tutor.university,
        graduating_year:
          tutor.graduating_year === 0 ? null : tutor.graduating_year,
        degree: tutor.degree,
        certificates: tutor.certificates
      })
    }
  }, [tutor])

  const onChange = e => {
    setEducationData({
      ...educationData,
      [e.target.name]: e.target.value
    })
  }

  const onClick = async () => {
    const res = await dispatch(updateTutorInfo(educationData))

    if (res.type === 'UPDATE_TUTOR_INFO_FAILURE') {
      NotificationManager.error(t('update_tutor_failed'), t)
    }
  }

  return (
    <div className='form-item-inner'>
      <h1>{t('education')}</h1>
      <div className='mb-4'>
        <label htmlFor='school' className='form-label'>
          <strong>{t('school')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='university'
          name='university'
          value={educationData.university}
          onChange={onChange}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='graduating_year' className='form-label'>
          <strong>{t('graduating_year')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='graduating_year'
          name='graduating_year'
          pattern='[0-9]*'
          value={educationData.graduating_year}
          onChange={onChange}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='degree' className='form-label'>
          <strong>{t('degree')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='degree'
          name='degree'
          value={educationData.degree}
          onChange={onChange}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='major' className='form-label'>
          <strong>{t('major')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='major'
          name='major'
          value={educationData.major}
          onChange={onChange}
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='certificates' className='form-label'>
          <strong>{t('certificates')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='certificates'
          name='certificates'
          value={educationData.certificates}
          onChange={onChange}
        />
      </div>
      {/* 
      <div className='mb-4'>
        <label htmlFor='other_certificates' className='form-label'>
          <strong>{t('other_certificates')}</strong>
        </label>
        <input
          className='form-control mt-3'
          type='text'
          id='other_certificates'
          name='other_certificates'
          // value={formData'other_certificates')
          // onChange={e => onChange(e.target.value, 'other_certificates')}
        />
      </div> */}
      <div className='mb-4 d-grid gap-2'>
        <button className='btn btn-primary' onClick={onClick}>
          {t('save_changes')}
        </button>
      </div>
    </div>
  )
}

export default EducationForm
