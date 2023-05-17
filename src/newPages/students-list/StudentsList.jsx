import React from 'react';
import Layout from '../../components/Layout';

import FavIcon from '../../assets/images/Favorite.png';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import './Students.scss';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { STUDENTS_QUERY } from '../../modules/auth/graphql';
import studentsModal from './StudentsModal';
import Loader from '../../components/Loader/Loader';
import StudentsModal from './StudentsModal';
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

export default function StudentsList() {
  const [showStudentModal, setShowStudentModal] = React.useState(false);
  const history = useHistory();
  const { data } = useQuery(STUDENTS_QUERY, {
    errorPolicy: 'ignore',
  });
  const [t] = useTranslation(['common', 'studentMentor']);

  const students = data?.students;

  const handleStatusTutor = (id) => {};

  const handleMoreTutor = (id) => {
    if (id) {
      history.push(`/tutor/students-list/${id}`);
    }

    setShowStudentModal(true);
  };

  const handleFilter = () => {};

  return (
    <Layout>
      <div className="tutors_section">
        <div className="tutors_title">
          <h1>{t('student_list', { ns: 'studentMentor' })}</h1>
          <p>{t('student_list_desc', { ns: 'studentMentor' })}</p>
        </div>

        <div className="tutors_row">
          {students?.length === 0 && <p>Empty</p>}

          {!students && <Loader height={'50vh'} />}

          {students &&
            students.map((item) => (
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
                    <h2>{item.userName}</h2>
                    <p>{item.university}</p>
                    <span>{item.language}</span>
                  </div>
                  <div className="tutors_control-buttons">
                    <button onClick={() => handleMoreTutor(item.id)}>
                      {t('learn_more', { ns: 'common' })}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showStudentModal && (
        <StudentsModal
          studentList={students}
          handleStatusTutor={handleStatusTutor}
          setShowStudentModal={setShowStudentModal}
        />
      )}
    </Layout>
  );
}
