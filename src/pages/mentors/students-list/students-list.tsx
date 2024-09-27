import femaleAvatar from '@/shared/assets/images/avatars/img_avatar_female.png';
import maleAvatar from '@/shared/assets/images/avatars/img_avatar_male.png';
import '@/pages/mentors/students-list/students.scss';
import Loader from '@/components/loader/loader';
import StudentsModal from '@/pages/mentors/students-list/students-modal';
import { STUDENTS_QUERY } from '@/shared/apollo/graphql';
import type { Query } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function StudentsList() {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const navigate = useNavigate();
  const { data } = useQuery<Query>(STUDENTS_QUERY, {
    errorPolicy: 'ignore',
  });
  const students = data?.students?.filter((i) => i?.user?.isActive) ?? undefined;

  const [t] = useTranslation(['common', 'studentMentor']);

  // const handleStatusTutor = () => {};

  const handleMoreTutor = (id: string) => {
    if (id) {
      navigate(`/mentor/students-list/${id}`);
    }

    setShowStudentModal(true);
  };

  return (
    <>
      <div className="tutors_section">
        <div className="tutors_title">
          <h1>{t('student_list', { ns: 'studentMentor' })}</h1>
          <p>{t('student_list_desc', { ns: 'studentMentor' })}</p>
        </div>

        <div className="tutors_row">
          {students?.length === 0 && <p>Empty</p>}

          {!students && <Loader height={'50vh'} />}

          {students?.map((item) => (
            <div key={item?.id} className="tutors_card">
              <div
                className="tutors_card-img"
                style={{
                  background: `url("${
                    item?.avatar
                      ? item.avatar?.url
                      : item?.gender === 'male'
                        ? maleAvatar
                        : femaleAvatar
                  }") center / cover`,
                }}
              >
                {/* {item.isFavourite && <img src={FavIcon} alt="" />} */}
              </div>
              <div className="tutors_card-body">
                <div className="tutors_info">
                  {/* <h2>{item?.userName}</h2>
										<p>{item?.user.university}</p>
										<span>{item.language}</span> */}
                </div>
                <div className="tutors_control-buttons">
                  <button type='button' onClick={() => handleMoreTutor(item?.id??'')}>
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
          // handleStatusTutor={handleStatusTutor}
          setShowStudentModal={setShowStudentModal}
        />
      )}
    </>
  );
}
