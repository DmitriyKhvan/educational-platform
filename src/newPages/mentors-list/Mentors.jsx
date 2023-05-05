import React from 'react';
import Layout from '../../components/Layout';

import FavIcon from '../../assets/images/Favorite.png';

import './Mentors.scss';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../modules/auth/graphql';
import MentorsModal from './MentorsModal';
import Loader from '../../components/Loader/Loader';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import { useTranslation } from 'react-i18next';

const filtersList = [
  {
    id: 1,
    caption: 'Sex',
    options: [
      {
        id: 1,
        title: 'Man',
      },
      {
        id: 2,
        title: 'Women',
      },
    ],
    checkbox: false,
  },
  {
    id: 2,
    caption: 'school',
    options: [
      {
        id: 1,
        title: 'Harvard',
      },
      {
        id: 2,
        title: 'Cambridge',
      },
    ],
    checkbox: false,
  },
  {
    id: 3,
    caption: 'major',
    options: [
      {
        id: 1,
        title: 'Major',
      },
      {
        id: 2,
        title: 'Major',
      },
    ],
    checkbox: false,
  },
];

const Mentors = () => {
  const [showTutorModal, setShowTutorModal] = React.useState(false);
  const history = useHistory();
  const { data } = useQuery(MENTORS_QUERY, {
    errorPolicy: 'ignore',
  });
  const [t] = useTranslation(['studentMentor', 'common']);

  const mentors = data?.tutors;


  const handleStatusTutor = (id) => {};

  const handleMoreTutor = (id) => {
    if (id) {
      history.push(`/student/mentors-list/${id}`);
    }

    setShowTutorModal(true);
  };

  return (
    <Layout>
      <div className="tutors_section">
        <div className="tutors_title">
          <h1>{t('mentor_list', { ns: 'studentMentor' })}</h1>
          <p>{t('mentor_list_desc', { ns: 'studentMentor' })}</p>
        </div>

        <div className="tutors_row">
          {mentors?.length === 0 && <p>Empty</p>}

          {!mentors && <Loader height={'50vh'} />}

          {mentors &&
            mentors.map((item) => (
              <div key={item.id} className="tutors_card">
                <div
                  className="tutors_card-img"
                  style={{
                    background: `url("${
                      item?.user?.avatar
                        ? item.user.avatar
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
                    <h2>{item.userName}</h2>
                    <p>{item.university}</p>
                    <span>{item.language}</span>
                  </div>
                  <div className="tutors_control-buttons">
                    <button onClick={() => handleMoreTutor(item.id)}>
                      {t('learn_more', { ns: 'common' })}
                    </button>
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
