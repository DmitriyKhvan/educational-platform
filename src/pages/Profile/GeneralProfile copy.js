import 'react-dropdown/style.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import timezone from 'timezones-list';

import EditIcon from '../../../src/assets/images/EditIcon.svg';
import { getUserById } from '../../actions/admin';
import {
  getUserInfo,
  updateUserInfo,
  uploadAvatar,
  uploadPreset,
} from '../../actions/user';
import UploadIcon from '../../assets/images/upload.svg';
import {
  renderFormField,
  renderPhonenumber,
  renderSelect,
} from '../../components/Global';
import ProfileModal from '../../components/ProfileModal';
import {
  countries,
  genders,
  pronouns,
} from '../../constants/global';
import ModalEditAvailability from '../Admin/ModalEditAvailability';

const GeneralProfile = ({ user, update, isAdmin = false, setDisabled }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')

  const [isUserImage, setUserImage] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditAvatar, setEditAvatar] = useState(false)
  const [isShowAvailability, setIsShowAvailability] = useState(false)
  const [isTutor, setIsTutor] = useState(null)
  const timezones = timezone.map(x => x.label)
  const defaultTimezone = timezones[15]
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
    setDisabled(false)
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
      console.log(option)
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
          <img src={user.avatar} alt='' className='Avatar' />
          <div className='pencil-wrapper' onClick={() => showModal()}>
            <img src={EditIcon} alt='' className='EditIcon' />
          </div>
          {/* <div
            className='edit-avatar custom-edit-avatar'
            onClick={() => showModal()}
          >
            <div className='Icon-Container'>
              <span className='EditIcon'>
                <img src={EditIcon} alt='' />
              </span>
              <span className='EditCircle'>
                <img src={EditCircle} alt='' />
              </span>
            </div>
          </div> */}
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
            <p className='section-title custom-section-title'>
              {t('contact_details')}
            </p>
            <div className='flex align-items-center gap-24'>
              {renderFormField(
                'first_name',
                t('first_name'),
                handleChange,
                formData,
                formDataError
              )}
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
              {renderPhonenumber(
                handleChange,
                formData,
                formDataError.phone_number,
                t('phone_number')
              )}
            </div>
            <div className='form-row pt-5'>
              <div className='form-item'>
                <div className='form-item-inner'>
                  <label htmlFor='timezone'>Timezone</label>
                  {/* <Dropdown
                    options={timezones}
                    value={formData.time_zone || defaultTimezone}
                    name='time_zone'
                    onChange={({ value }) => {
                      setFormData({ ...formData, time_zone: value })
                    }}
                  /> */}
                  <Select
                    className='custom-timezone-select'
                    value={{
                      label: formData.time_zone || defaultTimezone,
                      value: formData.time_zone || defaultTimezone
                    }}
                    options={timezones.map(each => {
                      return { label: each, value: each }
                    })}
                    onChange={({ value }) => {
                      setDisabled(false)
                      setFormData({ ...formData, time_zone: value })
                    }}
                  />
                </div>
              </div>
            </div>
            {/* {renderSelect(
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
            )} */}
          </div>
          {/* {showUploadModal ? (
            <UploadImageModal hideModal={hideModal} uploadImage={uploadImage} />
          ) : (
            ''
          )} */}
        </>
      )}
      {isShowAvailability && (
        <ModalEditAvailability
          user={user}
          visible={isShowAvailability}
          onDismiss={() => setIsShowAvailability(false)}
        />
      )}
      <ProfileModal
        isOpen={showUploadModal}
        setIsOpen={setShowUploadModal}
        setProfileImage={setUserImage}
      />
    </div>
  )
}

export default GeneralProfile
