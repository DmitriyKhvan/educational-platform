import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';

import Students from '../Students/Students';
import Layout from '../../components/Layout';
import { fetchStudentList } from '../../actions/students';

import { useTranslation } from 'react-i18next';
import '../../assets/styles/profile.scss';

const StudentList = () => {
  const [t, i18n] = useTranslation('translation');
  const dispatch = useDispatch();

  const students = useSelector((state) => state.students.list);
  const loading = useSelector((state) => state.students.loading);
  const user = useSelector((state) => state.users.user);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    if (user.tutor_profile) {
      dispatch(
        fetchStudentList({
          tutor_id: user.tutor_profile.id,
          sort: sort ? sort.value : undefined,
        }),
      );
    }
  }, [dispatch, user, sort]);

  return (
    <Layout>
      <div className="student-list">
        <Students
          students={students}
          title={t('student_list')}
          sort={sort}
          setSort={(option) => setSort(option)}
        />
        {loading && (
          <Loader
            className="align-center"
            type="Audio"
            color="#00BFFF"
            height={50}
            width={50}
          />
        )}
      </div>
    </Layout>
  );
};

export default StudentList;
