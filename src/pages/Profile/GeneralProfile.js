import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUserInfo,
  uploadAvatar,
  updateUserInfo,
  uploadPreset
} from '../../actions/user'
import UploadImageModal from '../../components/UploadImageModal'
import UploadIcon from '../../assets/images/upload.svg'
import { countries, genders, pronouns, timezones } from '../../constants/global'
import {
  renderFormField,
  renderPhonenumber,
  renderSelect
} from '../../components/Global'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../components/Avatar'
import ModalEditAvailability from '../Admin/ModalEditAvailability'
import { getUserById } from '../../actions/admin'

const GeneralProfile = ({ user, update, isAdmin = false }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')

  const [isUserImage, setUserImage] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditAvatar, setEditAvatar] = useState(false)
  const [isShowAvailability, setIsShowAvailability] = useState(false)
  const [isTutor, setIsTutor] = useState(null)

  const showModal = () => {
    setShowUploadModal(true)
  }

  const hideModal = () => {
    setShowUploadModal(false)
  }

  const uploadImage = async (file, isPreset = false) => {
    setShowUploadModal(false)
    setUserImage(true)
    if (isPreset) {
      let resp = await dispatch(uploadPreset(file, user.id))
      if (resp.type === 'UPLOAD_PRESET_SUCCESS') {
        if (isAdmin) dispatch(getUserById(user.id))
        else dispatch(getUserInfo())
      }
    } else {
      let resp = await dispatch(uploadAvatar(file, user.id))
      if (resp.type === 'UPLOAD_AVATAR_SUCCESS') {
        if (isAdmin) dispatch(getUserById(user.id))
        else dispatch(getUserInfo())
      }
    }
  }

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    korean_equivalent: user.korean_equivalent,
    email: user.email,
    phone_number: user.phone_number,
    gender: user.gender,
    time_zone: user.time_zone,
    country: user.country
  })

  const [formDataError, setFormDataError] = useState({
    first_name: '',
    last_name: '',
    email: '',
    korean_equivalent: '',
    phone_number: '',
    gender: '',
    time_zone: '',
    country: ''
  })

  useEffect(() => {
    dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    setSelectedPronounsOption(pronouns.find(item => item.value === user.gender))
    if (user && user.roles) {
      if (user.roles[0].role_name === 'tutor') {
        setIsTutor(true)
      } else if (user.roles[0].role_name === 'student') {
        setIsTutor(false)
      } else {
        setIsTutor(null)
      }
    }
  }, [user])

  const [selectedGenderOption, setSelectedGenderOption] = useState(
    genders.find(item => item.value === formData['gender'])
  )
  const [selectedPronounsOption, setSelectedPronounsOption] = useState(
    pronouns.find(item => item.value === formData['gender']?.value)
  )
  const [selectedTimezoneOption, setSelectedTimezoneOption] = useState(
    timezones.find(item => item.value === formData['time_zone'])
  )
  const [selectedCountryOption, setSelectedCountryOption] = useState(
    countries
      .map(country => ({ label: t(country.label), value: country.value }))
      .find(item => item.value === formData['country'])
  )

  const handleChange = (option, stateName) => {
    const name = stateName.name
    if (name === 'gender') {
      setSelectedGenderOption(option)
      setSelectedPronounsOption(
        pronouns.find(item => item.value === option.value)
      )
      setFormDataError(formDataError => ({ ...formDataError, [name]: '' }))
      setFormData({ ...formData, [name]: option.value })
    } else if (name === 'time_zone') {
      setSelectedTimezoneOption(option)
      setFormDataError(formDataError => ({ ...formDataError, [name]: '' }))
      setFormData({ ...formData, [name]: option.value })
    } else if (name === 'country') {
      setSelectedCountryOption(option)
      setFormDataError(formDataError => ({ ...formDataError, [name]: '' }))
      setFormData({ ...formData, [name]: option.value })
    } else {
      setFormDataError(formDataError => ({ ...formDataError, [stateName]: '' }))
      setFormData({ ...formData, [stateName]: option })
    }
  }

  useEffect(() => {
    if (update) {
      updateProfile()
    }
  }, [update])

  const updateProfile = async () => {
    dispatch(
      updateUserInfo({ ...formData, id: isAdmin ? user?.id : undefined })
    )
  }

  const renderProfileImage = () => (
    <div className={`profile-image ${isAdmin ? 'admin' : ''}`}>
      {user?.avatar ? (
        <div
          className='avatar-section'
          onMouseEnter={() => setEditAvatar(true)}
          onMouseLeave={() => setEditAvatar(false)}
        >
          <Avatar avatar={user.avatar} />
          <div className='edit-avatar' onClick={() => showModal()}>
            <span>{t('edit_avatar')}</span>
          </div>
        </div>
      ) : (
        <div className=''>
          <div className='default-avatar'>
            <div className='upload-image' onClick={() => showModal()}>
              <img src={UploadIcon} alt='' />
            </div>
          </div>
        </div>
      )}
      <p>
        {formData.first_name} {formData.last_name}
      </p>
    </div>
  )

  return (
    <div className='profile-inner-wrapper'>
      {!isShowAvailability && (
        <>
          {renderProfileImage()}
          {isAdmin && isTutor && (
            <div
              className='btn-edit-availability'
              onClick={() => setIsShowAvailability(true)}
            >
              Edit Availability
            </div>
          )}
          <div className='form-section'>
            <p className='section-title'>{t('contact_details')}</p>
            <div className='flex align-items-center gap-24'>
              {renderFormField(
                'first_name',
                t('first_name'),
                handleChange,
                formData,
                formDataError
              )}
              {renderFormField(
                'last_name',
                t('last_name'),
                handleChange,
                formData,
                formDataError
              )}
            </div>
            {renderFormField(
              'korean_equivalent',
              t('korean_equivalent'),
              handleChange,
              formData,
              formDataError
            )}
            <div className='flex align-items-center gap-24'>
              {renderSelect(
                'gender',
                t('gender'),
                t('placeholder_select_your_gender'),
                genders.map(gender => ({
                  label: t(gender.label),
                  value: gender.value
                })),
                selectedGenderOption,
                handleChange,
                { required: t('error_select_an_option') },
                formDataError.gender
              )}
              {renderSelect(
                'pronouns',
                t('pronouns'),
                t('placeholder_select_pronouns'),
                pronouns,
                selectedPronounsOption,
                handleChange,
                { required: t('error_select_an_option') },
                formDataError.pronouns,
                true
              )}
            </div>
            <div className='flex align-items-center gap-24'>
              {renderFormField(
                'email',
                t('email'),
                handleChange,
                formData,
                formDataError
              )}
              {renderPhonenumber(
                handleChange,
                formData,
                formDataError.phone_number,
                t('phone_number')
              )}
            </div>
            {renderSelect(
              'time_zone',
              t('time_zone'),
              t('placeholder_select_timezone'),
              timezones,
              selectedTimezoneOption,
              handleChange,
              { required: t('error_select_an_option') },
              formDataError.time_zone
            )}
            {renderSelect(
              'country',
              t('country'),
              t('placeholder_select_country'),
              countries.map(country => ({
                label: t(country.label),
                value: country.value
              })),
              selectedCountryOption,
              handleChange,
              { required: t('error_select_an_option') },
              formDataError.country
            )}
          </div>
          {showUploadModal ? (
            <UploadImageModal hideModal={hideModal} uploadImage={uploadImage} />
          ) : (
            ''
          )}
        </>
      )}
      {isShowAvailability && (
        <ModalEditAvailability
          user={user}
          visible={isShowAvailability}
          onDismiss={() => setIsShowAvailability(false)}
        />
      )}
    </div>
  )
}

export default GeneralProfile
