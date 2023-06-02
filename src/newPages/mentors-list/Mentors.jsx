import React from 'react';
import Layout from '../../components/Layout';
import { Link , useHistory } from 'react-router-dom';

import FavIcon from '../../assets/images/Favorite.png';

import './Mentors.scss';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../modules/auth/graphql';
import MentorsModal from './MentorsModal';
import Loader from '../../components/Loader/Loader';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import { useTranslation } from 'react-i18next';

const Mentors = () => {
  const [showTutorModal, setShowTutorModal] = React.useState(false);

  const history = useHistory();
  const [tutor, setTutor] = React.useState([]);
  const [t] = useTranslation(['studentMentor', 'common']);
  const { data } = useQuery(MENTORS_QUERY, {
    errorPolicy: 'ignore',
  });

  const mentors = data?.tutors;

  React.useEffect(() => {
    setTutor(mentors);
  }, [mentors]);

  const handleStatusTutor = () => {};

  const handleMoreTutor = (id) => {
    if (id) {
      history.push(`/student/mentors-list/${id}`);
    }

    setShowTutorModal(true);
  };

  const handleFilter = (e) => {
    const tutors = [...mentors];

    const newT = tutors.filter((i) =>
      i.userName.toLowerCase().includes(e.toLowerCase()),
    );

    setTutor(newT);
  };

  function resizerUsername(name) {
    return name.length > 9 ? name.slice(0, 9 - 1) + '...' : name;
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

        <div className="tutors_row">
          {tutor?.length === 0 && <p>{t('cannot_find_mentors')}</p>}

          {!mentors && <Loader height={'50vh'} />}

          {mentors &&
            tutor?.map((item) => (
              <div key={item.id} className="tutors_card">
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
                <div className="tutors_card-body">
                  <div className="tutors_info">
                    <h2>{resizerUsername(item?.user?.firstName)}</h2>
                    <h4>{item.university}</h4>
                    <span>
                      {item.degree} {item.major ? '/ ' + item.major : null}
                    </span>
                  </div>
                  <div className="tutors_control-buttons">
                    <button onClick={() => handleMoreTutor(item.id)}>
                      {t('learn_more', { ns: 'common' })}
                    </button>
                    <Link
                      to={{
                        pathname: `/student/schedule-lesson/select`,
                        state: {
                          tutor: {
                            id: item.id,
                            first_name: item.user.firstName,
                            last_name: item.user.lastName,
                            avatar: item.avatar?.url,
                          },
                        },
                      }}
                      style={{
                        all: 'unset',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <button>{t('schedule', { ns: 'common' })}</button>
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

      {showTutorModal && (
        <MentorsModal
          tutorsList={mentors}
          handleStatusTutor={handleStatusTutor}
          setShowTutorModal={setShowTutorModal}
        />
      )}
    </Layout>
  );
};

export default Mentors;
