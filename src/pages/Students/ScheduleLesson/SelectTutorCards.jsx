import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import moment from 'moment';
import Layout from '../../../components/Layout';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';
import { useQuery, gql } from '@apollo/client';
import MentorsModal from '../MentorsList/MentorsModal';
import Loader from '../../../components/common/Loader';
Modal.setAppElement('#root');

const GET_AVAILABLE_MENTORS = gql`
  query GetAvailableMentors($time: String!, $duration: Int!) {
    availableMentors(time: $time, duration: $duration) {
      filterSlot {
        day
        from
        to
        fromSeconds
        toSeconds
      }
      mentors {
        id
        major
        language
        university
        graduatingYear
        degree
        introduction
        about
        experience
        relevantExperience
        isActive
        hourlyRate
        facts
        uniqueFacts
        userId
        fullName
        user {
          id
          firstName
          lastName
        }
        avatar {
          id
          url
        }
      }
    }
  }
`;

const useAvailableMentors = (isoTime, duration) => {
  const { data: { availableMentors } = {}, loading } = useQuery(
    GET_AVAILABLE_MENTORS,
    {
      variables: {
        time: isoTime,
        duration,
      },
    },
  );
  return {
    availableMentors: availableMentors?.mentors || [],
    loading: loading,
  };
};

const SelectTutorCards = ({ setTabIndex, setSelectTutor, schedule, step }) => {
  const [t] = useTranslation(['lessons', 'common']);
  const [isOpen, setIsOpen] = useState(false);
  const [modalSelectTutor, setModalSelectTutor] = useState({});
  const { availableMentors, loading } = useAvailableMentors(
    moment(schedule, 'ddd MMM DD YYYY HH:mm:ss ZZ').toISOString(),
    step,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [availableMentors]);

  const SelectTutors = ({ tutor }) => {
    const name = tutor.fullName;
    const onClick = () => {
      setSelectTutor(tutor);
      setTabIndex(3);
    };

    const onClickLearnMore = () => {
      setModalSelectTutor(tutor.id);
      setIsOpen(true);
    };

    const tutorProfile = tutor.avatar?.url
      ? tutor.avatar.url
      : tutor.gender === 'female'
      ? femaleAvatar
      : maleAvatar;
    return (
      <div className="">
        <div className="favImg">
          <img src={tutorProfile} className="img-fluid schedule" alt="" />
          {/* <img src={Favorite} alt='FavoriteSvg' className='FavoriteSvg' /> */}
        </div>
        <div className="text-center">
          <div className="Learn-name-university pt-3">
            <h5 className="text-purple select_tutors_aligns">
              <strong style={{ fontSize: '1.3rem' }}>{name}</strong>
            </h5>
            <h5 className="my-2 text-light-grey select_tutors_aligns">
              <strong className="unversity-font">{tutor.university}</strong>
            </h5>
            <h5 className="text-light-grey select_tutors_aligns">
              {tutor.major || '-'}
            </h5>
          </div>
          <div className="Learn-buttons-style">
            <button
              className="enter-btn btn-dash-return buttonss"
              onClick={onClickLearnMore}
            >
              {t('learn_more', { ns: 'common' })}
            </button>
            <button
              className="enter-btn btn-primary buttonss"
              onClick={onClick}
            >
              {t('select_mentor')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Layout>
      <div className="scroll-layout">
        <div className="flex-container">
          <div className="lesson-wrapper schedule_changess tutor_schedule_width ">
            <div className="pb-0">
              <h1 className="title mt-0">{t('select_mentor')}</h1>
              <p className="welcome-subtitle">{t('select_mentor_subtitle')}</p>
              <div className="row">
                <div className="col-auto">
                  <div className="combos ms-2">
                    <button
                      className="border btn-dash-return combobutton enter-btn btn-dash-return ms-0 back-btn-schedule"
                      onClick={() => setTabIndex(1)}
                    >
                      {t('back', { ns: 'common' })}
                    </button>
                    {/* <div className='combo'>
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
                    </div> */}
                  </div>
                  <div className="col-auto pt-2">
                    {/* <Select options={options} /> */}
                  </div>
                </div>
              </div>
              {availableMentors?.length ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center place-items-center lg:place-items-start 2xl:grid-cols-3 w-full gap-y-4">
                  {availableMentors.map((x, i) => (
                    <SelectTutors tutor={x} key={i} />
                  ))}
                </div>
              ) : loading ? (
                <Loader />
              ) : (
                <div className="no_mentors">{t('no_mentors_available')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <MentorsModal
          setShowTutorModal={setIsOpen}
          tutorId={modalSelectTutor}
          tutorsList={availableMentors}
        />
      )}
    </Layout>
  );
};

export default SelectTutorCards;
