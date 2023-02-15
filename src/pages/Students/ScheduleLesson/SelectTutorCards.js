import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import moment from 'moment'
import Layout from '../../../components/Layout'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'
import Favorite from '../../../assets/images/Favorite.svg'
import Vector from '../../../assets/images/Vectors.svg'
import { useQuery, gql } from '@apollo/client'
import MentorsModal from '../../../newPages/mentors-list/MentorsModal'
Modal.setAppElement('#root')

const GET_TIMESHEETS = gql`
  query GetTimesheets($day: String) {
    timesheets(
      where: { day: { equals: $day } }
      orderBy: []
      take: null
      skip: 0
    ) {
      id
      tutorId
      day
      from
      to
      createdAt
      updatedAt
    }
  }
`

const GET_TUTORS_BY_ID = gql`
  query GetTutors($ids: [ID!]) {
    tutors(where: { id: { in: $ids } }, orderBy: [], take: null, skip: 0) {
      id
      userName(something: 1)
      major
      language
      university
      acceptanceRate
      checked
      videoUrl
      totalRequests
      graduatingYear
      degree
      certificates
      introduction
      relevantExperience
      uniqueFacts
      about
      experience
      facts
      avatar {
        id
        filesize
        width
        height
        extension
        url
      }
      picture {
        id
        filesize
        width
        height
        extension
        url
      }
      diplomaVerification {
        filename
        filesize
        url
      }
      user {
        id
        firstName
        lastName
        koreanEquivalent
        phoneNumber
        address
        gender
        timeZone
        country
        avatar
        emailVerificationToken
        resetPasswordExpires
        resetPasswordToken
        referalId
        referalConfirmed
        fullName(something: 1)
        role(something: 1)
        email
        passwordResetIssuedAt
        passwordResetRedeemedAt
      }
      createdAt
      updatedAt
    }
  }
`

const SelectTutorCards = ({ setTabIndex, setSelectTutor, schedule }) => {
  const [t] = useTranslation('translation')
  const [isOpen, setIsOpen] = useState(false)
  const [modalSelectTutor, setModalSelectTutor] = useState({})
  const [availableTutors, setAvailableTutors] = useState([])
  const scheduleMoment = moment(
    moment(schedule, 'ddd MMM DD YYYY HH:mm:ss').format('HH:mm'),
    'HH:mm'
  )

  const { data: timesheetsData } = useQuery(GET_TIMESHEETS, {
    variables: {
      day: moment(schedule, 'ddd MMM DD YYYY HH:mm:ss').format('dddd')
    }
  })

  const availableTutorIds = timesheetsData?.timesheets?.reduce((acc, each) => {
    const timesheetFrom = moment(each.from, 'HH:mm')
    const timesheetTo = moment(each.to, 'HH:mm')
    // Third argument is for units (for which we do not care right now)
    // Fourth parameter '[)' means that the end time is not included
    if (scheduleMoment.isBetween(timesheetFrom, timesheetTo, undefined, '[]')) {
      return [...acc, each.tutorId]
    }
    return acc
  }, [])

  const [tutors, setTutors] = useState([])

  const { data: tutorsData } = useQuery(GET_TUTORS_BY_ID, {
    variables: { ids: availableTutorIds },
    onCompleted: tutorsData => {
      const data = tutorsData?.tutors.map(tutor => {
        return {
          id: tutor.id,
          avatar: tutor?.avatar?.url ?? '',
          first_name: tutor.user.firstName,
          last_name: tutor.user.lastName,
        }
      })
      setTutors(data)
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (tutors && tutors.length) {
      const tempTutors = tutors.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
      )
      setAvailableTutors([...tempTutors])
    }
  }, [tutors])

  const handleSearchTutor = e => {
    const { value } = e.target
    const tempTutors = tutors.filter(
      eachTutor =>
        eachTutor.first_name.toLowerCase().includes(value.toLowerCase()) ||
        eachTutor.last_name?.toLowerCase().includes(value.toLowerCase())
    )
    setAvailableTutors([...tempTutors])
  }
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
            className='container page-card tutor-desc grey-border bg-white pt-2 mt-4 p-4'
            style={{ width: '40vw' }}
          >
            <div className='p-4'>
              <div className='row'>
                <h1>{name}</h1>
                <h3>{t('introduction')}</h3>
                <p className='learn-more-text'>
                  {modalSelectTutor.introduction}
                </p>
              </div>
              <div className='row'>
                <h3>{t('experience')}</h3>
                <p className='learn-more-text'>
                  {modalSelectTutor.relevant_experience}
                </p>
              </div>
              <div className='row'>
                <h3>{t('facts')}</h3>
                <p className='learn-more-text'>
                  {modalSelectTutor.unique_facts}
                </p>
              </div>
              <div className='row ps-2 pt-4'>
                <div className='col-4'>
                  <div>
                    <p className='learn-more-text mb-1'>{t('school')}</p>
                    <p>
                      <strong>{modalSelectTutor.university}</strong>
                    </p>
                  </div>
                </div>
                <div className='col-4'>
                  <div>
                    <p className='learn-more-text mb-1'>{t('degree_major')}</p>
                    <p>
                      <strong>{modalSelectTutor.degree}</strong>
                    </p>
                  </div>
                </div>
                <div className='col-4'>
                  <div>
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
    const last_name = tutor.last_name ? tutor.last_name.charAt(0) + '.' : ''
    const name = tutor.first_name + ' ' + last_name
    const onClick = () => {
      setSelectTutor(tutor)
      setTabIndex(3)
    }

    const onClickLearnMore = () => {
      setModalSelectTutor(tutor.id)
      setIsOpen(true)
    }

    const tutorProfile = tutor.avatar
      ? tutor.avatar
      : tutor.gender === 'female'
      ? femaleAvatar
      : maleAvatar
    return (
      <div className='col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6 pt-3 schedulebottom'>
        <div className='favImg'>
          <img src={tutorProfile} className='img-fluid schedule' alt='' />
          <img src={Favorite} alt='FavoriteSvg' className='FavoriteSvg' />
        </div>
        <div className='text-center'>
          <div className='Learn-name-university pt-3'>
            <h5 className='text-purple select_tutors_aligns'>
              <strong style={{ fontSize: '1.3rem' }}>{name}</strong>
            </h5>
            <h5 className='my-2 text-light-grey select_tutors_aligns'>
              <strong className='unversity-font'>{tutor.university}</strong>
            </h5>
            <h5 className='text-light-grey select_tutors_aligns'>
              {tutor.major || '-'}
            </h5>
          </div>
          <div className='Learn-buttons-style'>
            <button
              className='enter-btn btn-dash-return buttonss'
              onClick={onClickLearnMore}
            >
              {t('learn_more')}
            </button>
            <button
              className='enter-btn btn-primary buttonss'
              onClick={onClick}
            >
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
          <div className='lesson-wrapper schedule_changess tutor_schedule_width '>
            <div className='pb-0'>
              <h1 className='title mt-0'>{t('select_a_tutor')}</h1>
              <p className='welcome-subtitle'>{t('select_a_tutor_subtitle')}</p>
              <div className='row'>
                <div className='col-auto'>
                  <div className='combos ms-2'>
                    <button
                      className=' btn-dash-return combobutton'
                      onClick={() => setTabIndex(1)}
                    >
                      {t('back')}
                    </button>
                    <div className='combo'>
                      <div className='FavoritesTutors'>
                        <img
                          src={Vector}
                          alt='VectorSvg'
                          className='fa-angle-down'
                        />
                        <div id='Favorite-label'>{t('gender')}</div>
                      </div>
                    </div>

                    <div className='combo'>
                      <div className='FavoritesTutors'>
                        <img
                          src={Vector}
                          alt='VectorSvg'
                          className='fa-angle-downs'
                        />
                        <div id='Favorite-label'>{t('major')}</div>
                      </div>
                    </div>
                    <div className='Favorites'>
                      <div className='CheckBox-Favorite'>
                        <div className='CheckBox-FavoriteColor'></div>
                      </div>
                      <div id='Favorite-label'>{t('Favorite_tutors')}</div>
                    </div>
                    <div className='FavoriteSTutors'>
                      <div id='Favorite-label'>{t('show_tutors')}</div>
                    </div>
                  </div>
                  <div className='col-auto pt-2'>
                    {/* <Select options={options} /> */}
                  </div>
                </div>
              </div>
              <div className='searchbox'>
                <input
                  type='text'
                  placeholder={t('placeholder_search_tutor')}
                  onChange={handleSearchTutor}
                />
              </div>
              <div className='row ps-2 pt-4 tutor-overflow-scroll tutor_schedule_widths '>
                {availableTutors.map((x, i) => (
                  <SelectTutors tutor={x} key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <MentorsModal setShowTutorModal={setIsOpen} tutorId={modalSelectTutor} tutorsList={tutorsData.tutors}/>}
    </Layout>
  )
}

export default SelectTutorCards
