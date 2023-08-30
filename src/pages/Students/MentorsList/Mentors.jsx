import React from 'react';
import Layout from '../../../components/Layout';
import { Link } from 'react-router-dom';

import FavIcon from '../../../assets/images/Favorite.png';

import './Mentors.scss';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../../modules/auth/graphql';
import MentorsModal from './MentorsModal';
import Loader from '../../../components/Loader/Loader';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';
import { useTranslation } from 'react-i18next';

const Mentors = () => {
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const [mentor, setMentor] = React.useState({});

  const [mentors, setMentors] = React.useState([]);
  const [t] = useTranslation(['studentMentor', 'common']);
  const { data, loading } = useQuery(MENTORS_QUERY, {
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    setMentors(data?.mentors);
  }, [data]);

  const handleStatusTutor = () => {};

  const handleMoreMentor = (mentor) => {
    setMentor(mentor);
    setShowMentorModal(true);
  };

  const handleFilter = (e) => {
    const newMentors = mentors.filter((i) =>
      i?.user?.fullName?.toLowerCase().includes(e.toLowerCase()),
    );

    setMentors(newMentors);
  };

  function resizerUsername(name) {
    return name && name.length > 9 ? name.slice(0, 9 - 1) + '...' : name;
  }

  return (
    <Layout>
      <div className="tutors_section">
        <div className="tutors_title">
          <h1>{t('mentor_list', { ns: 'studentMentor' })}</h1>
          <p>{t('mentor_list_desc', { ns: 'studentMentor' })}</p>
        </div>

        <div className="mentors_filters_row">
          <div>
            <input
              type={'text'}
              placeholder={'Search...'}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="tutors_row gap-y-5">
          {mentors?.length === 0 && <p>{t('cannot_find_mentors')}</p>}

          {loading && <Loader height={'50vh'} />}

          {mentors &&
            mentors?.map((item) => (
              <div key={item.id} className="tutors_card">
                <div className="w-full h-[400px] overflow-hidden rounded-lg">
                  <div
                    className="tutors_card-img"
                    style={{
                      background: `url("${
                        item?.avatar
                          ? item.avatar?.url
                          : item?.user?.gender === 'male'
                          ? maleAvatar
                          : femaleAvatar
                      }") center / cover`,
                    }}
                  >
                    {item.isFavourite && <img src={FavIcon} alt="" />}
                  </div>
                </div>

                <div className="tutors_card-body h-[120px] overflow-hidden">
                  <div className="tutors_info">
                    <h2>{resizerUsername(item?.user?.firstName)}</h2>
                    <h4>{item.university}</h4>
                    <span>
                      {item.degree} {item.major ? '/ ' + item.major : null}
                    </span>
                  </div>
                  <div className="tutors_control-buttons">
                    <button onClick={() => handleMoreMentor(item)}>
                      {t('learn_more', { ns: 'common' })}
                    </button>
                    <Link
                      to={{
                        pathname: `/student/schedule-lesson/select`,
                        state: {
                          tutor: {
                            id: item.id,
                            firstName: item.user?.firstName,
                            lastName: item.user?.lastName,
                            avatar: item.avatar?.url,
                          },
                        },
                      }}
                      style={{
                        all: 'unset',
                        width: '100%',
                        height: '100%',
                        pointerEvents:
                          item.availabilities.length > 0 ? 'auto' : 'none',
                      }}
                    >
                      <button
                        style={{
                          filter:
                            item.availabilities.length > 0
                              ? 'none'
                              : 'brightness(70%)',
                        }}
                      >
                        {t('schedule', { ns: 'common' })}
                      </button>
                    </Link>
                    {/* <button onClick={() => handleStatusTutor(item.id)}>
                      {item?.isFavourite ? 'Remove' : 'Favorite'}
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showMentorModal && (
        <MentorsModal
          mentor={mentor}
          handleStatusTutor={handleStatusTutor}
          setShowMentorModal={setShowMentorModal}
        />
      )}
    </Layout>
  );
};

export default Mentors;
