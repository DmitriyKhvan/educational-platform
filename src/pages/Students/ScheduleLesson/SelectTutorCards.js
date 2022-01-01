import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../../../components/Layout'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

const SelectTutorCards = ({ tutors, setTabIndex, setSelectTutor }) => {
  const [t] = useTranslation('translation')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const SelectTutors = ({ tutor }) => {
    const name = tutor.first_name + ' ' + tutor.last_name.charAt(0) + '.'
    const onClick = () => {
      setSelectTutor(tutor)
      setTabIndex(3)
    }
    return (
      <div className='col-4 pe-5 pt-3'>
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

          {/* <div className='row'>
              <button className='enter-btn btn-dash-return'>Learn More</button>
            </div> */}
          <div className='row container-fluid'>
            <button className='enter-btn btn-primary' onClick={onClick}>
              Select Tutor
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='container lesson-wrapper'>
            <div className='pb-0'>
              <h1 className='title'>{t('select_a_tutor')}</h1>
              <p className='welcome-subtitle'>{t('select_a_tutor_subtitle')}</p>
              <div className='row'>
                <div className='col-auto'>
                  <button
                    className='enter-btn btn-dash-return'
                    onClick={() => setTabIndex(1)}
                  >
                    {t('back')}
                  </button>
                </div>
                <div className='col-auto pt-2'>
                  {/* <Select options={options} /> */}
                </div>
              </div>

              <div className='row ps-2 pt-4'>
                {tutors.map(x => (
                  <SelectTutors tutor={x} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SelectTutorCards
