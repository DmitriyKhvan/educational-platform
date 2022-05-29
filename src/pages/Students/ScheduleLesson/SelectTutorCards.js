import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import Layout from '../../../components/Layout'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

Modal.setAppElement('#root')

const SelectTutorCards = ({ tutors, setTabIndex, setSelectTutor }) => {
  const [t] = useTranslation('translation')
  const [isOpen, setIsOpen] = useState(false)
  const [modalSelectTutor, setModalSelectTutor] = useState({})
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      background: 'none',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalSelectTutor({})
    setSelectTutor({})
  }

  const LearnMoreModal = () => {
    const onClick = () => {
      setSelectTutor(modalSelectTutor)
      setTabIndex(3)
    }
    const name =
      modalSelectTutor.first_name +
      ' ' +
      modalSelectTutor.last_name.charAt(0) +
      '.'
    return (
      <div style={{ zIndex: 9999 }} className='container'>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Learn More'
        >
          <div
            className='container page-card grey-border bg-white pt-2 mt-4 p-4'
            style={{ width: '40vw' }}
          >
            <div className='p-4'>
              <div className='row'>
                <h1>{name}</h1>
                <p className='learn-more-text'>
                  {modalSelectTutor.introduction}
                </p>
              </div>
              <div className='row ps-2 pt-4'>
                <div className='col-4 ps-1'>
                  <div className='row'>
                    <p className='learn-more-text mb-1'>{t('school')}</p>
                    <p>
                      <strong>{modalSelectTutor.university}</strong>
                    </p>
                  </div>
                </div>
                <div className='col-5'>
                  <div className='row'>
                    <p className='learn-more-text mb-1'>{t('degree_major')}</p>
                    <p>
                      <strong>{modalSelectTutor.degree}</strong>
                    </p>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='row'>
                    <p className='learn-more-text mb-1'>
                      {t('tutor_certificates')}
                    </p>
                    <p>
                      <strong>{modalSelectTutor.certificates}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-6 pe-3'>
                  <button
                    className='enter-btn grey-border w-100 ms-0'
                    onClick={closeModal}
                  >
                    {t('cancel')}
                  </button>
                </div>
                <div className='col-6 pe-3'>
                  <button
                    className='enter-btn btn-primary w-100'
                    onClick={onClick}
                  >
                    {t('select_tutor')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  const SelectTutors = ({ tutor }) => {
    const name = tutor.first_name + ' ' + tutor.last_name.charAt(0) + '.'
    const onClick = () => {
      setSelectTutor(tutor)
      setTabIndex(3)
    }

    const onClickLearnMore = () => {
      setModalSelectTutor(tutor)
      setIsOpen(true)
    }

    const tutorProfile = tutor.avatar
      ? tutor.avatar
      : tutor.gender === 'female'
      ? femaleAvatar
      : maleAvatar
    return (
      <div className='col-4 pe-5 pt-3'>
        <img
          src={tutorProfile}
          className='img-fluid ps-4'
          alt=''
          style={{ width: '19vw' }}
        />
        <div className='container pt-3 text-center ps-0'>
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
            <button
              className='enter-btn grey-border'
              onClick={onClickLearnMore}
            >
              {t('learn_more')}
            </button>
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

              <div className='row ps-2 pt-4 tutor-overflow-scroll'>
                {tutors.map((x, i) => (
                  <SelectTutors tutor={x} key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <LearnMoreModal />}
    </Layout>
  )
}

export default SelectTutorCards
