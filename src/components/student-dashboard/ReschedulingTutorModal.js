import React from 'react'
import { useTranslation } from 'react-i18next'
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png'

const ReschedulingTutorModal = ({ setTabIndex, tutors, setSelectTutor }) => {
  const [t] = useTranslation()

  const SelectTutors = ({ tutor }) => {
    const name = tutor.first_name + ' ' + tutor.last_name.charAt(0) + '.'
    const onClick = () => {
      setSelectTutor(tutor)
      setTabIndex(4)
    }
    return (
      <div className='col-12 col-xl-3 col-lg-4 col-md-6 col-sm-3 pe-3'>
        <img
          src={tutor.gender === 'female' ? femaleAvatar : maleAvatar}
          className='img-fluid'
          alt=''
        />
        <div className='container pt-3 text-center'>
          <div className='row'>
            <h1 className='text-purple justify-content-center mb-2'>{name}</h1>
          </div>
          <div className='row'>
            <h5 className='text-light-grey justify-content-center'>
              <strong>{tutor.university}</strong>
            </h5>
          </div>
          <div className='row'>
            <h5 className='text-light-grey justify-content-center'>
              {tutor.major || ''}
            </h5>
          </div>
          <div className='row container-fluid'>
            <button className='enter-btn btn-primary' onClick={onClick}>
              {t('select_tutor')}
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <React.Fragment>
      <div
        className='scroll-layout container'
        style={{ width: '65vw', overflow: 'scroll' }}
      >
        <div className='container'>
          <h2>{t('select_a_tutor')}</h2>
          <p className='welcome-subtitle'>{t('select_a_tutor_subtitle')}</p>
        </div>
        <div className='row container'>
          <div className='col-auto'>
            <button
              className='enter-btn btn-dash-return ms-0'
              onClick={() => setTabIndex(2)}
            >
              {t('back')}
            </button>
          </div>
          <div className='col-auto pt-2'>
            {/* <Select options={options} /> */}
          </div>
        </div>
        <div className='row ps-2 pt-4 modal-scroll'>
          {tutors.map((x, i) => (
            <SelectTutors tutor={x} key={i} />
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}

export default ReschedulingTutorModal
