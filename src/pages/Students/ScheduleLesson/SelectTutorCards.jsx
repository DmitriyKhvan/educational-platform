import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Layout from '../../../components/Layout';
import { useQuery, gql } from '@apollo/client';
import { getItemToLocalStorage } from 'src/constants/global';
import { MentorsView } from '../MentorsList/MentorsView';
import Loader from 'src/components/Loader/Loader';

const GET_AVAILABLE_MENTORS = gql`
  query GetAvailableMentors(
    $time: String!
    $duration: Int!
    $studentId: String!
  ) {
    availableMentors(time: $time, duration: $duration, studentId: $studentId) {
      filterSlot {
        day
        from
        to
        # fromSeconds
        # toSeconds
      }
      mentors {
        id
        firstName
        lastName
        gender
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
        fullName
        userId
        # user
        # lessons
        videoUrl
        avatarId
        visibilityStatus
        avatar {
          id
          url
        }
        #availabilities {
        #  id
        #}
        zoomUserId
        zoomEmail
      }
    }
  }
`;

const useAvailableMentors = (isoTime, duration, studentId) => {
  const { data: { availableMentors } = {}, loading } = useQuery(
    GET_AVAILABLE_MENTORS,
    {
      variables: {
        time: isoTime,
        duration: duration,
        studentId: studentId,
      },
      fetchPolicy: 'network-only',
    },
  );
  return {
    availableMentors: availableMentors?.mentors || [],
    loading: loading,
  };
};

const SelectTutorCards = ({ setTabIndex, setSelectTutor, schedule, step }) => {
  const [t] = useTranslation(['lessons', 'common']);

  const { availableMentors, loading } = useAvailableMentors(
    moment(schedule, 'ddd MMM DD YYYY HH:mm:ss ZZ').toISOString(),
    step,
    getItemToLocalStorage('studentId'),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [availableMentors]);

  const onClick = (mentor) => {
    setSelectTutor(mentor);
    setTabIndex(3);
  };

  return (
    <Layout>
      <div className="overflow-auto h-full">
        <div className="flex-container">
          <div className="lesson-wrapper schedule_changess tutor_schedule_width ">
            <div className="pb-0">
              <h1 className="title mt-0">{t('select_mentor')}</h1>
              <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px]">
                {t('select_mentor_subtitle')}
              </p>
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

              {loading ? (
                <Loader />
              ) : availableMentors?.length ? (
                <MentorsView
                  mentorList={availableMentors}
                  handleSelectMentor={onClick}
                />
              ) : (
                <div className="no_mentors">{t('no_mentors_available')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectTutorCards;
