import { useEffect, useState } from 'react';
import '../../assets/styles/student.scss';
import { useTranslation } from 'react-i18next';
import { ModalUserInfo } from '../Admin/ModalUserInfo';
import { UserHeader } from '../../components/UserHeader';
import CustomTable from '../../components/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../actions/appointment';
import { getAbbrName, getAvatarName } from '../../constants/global';
import { format } from 'date-fns';
import Loader from 'react-spinners/ClipLoader';
import { useHistory } from 'react-router-dom';

const ModalLesson = ({
  student,
  onDismiss,
  visible,
  title,
  description,
  status,
}) => {
  const [t, i18n] = useTranslation('translation');
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector((state) => state.appointment.loading);
  const appointments = useSelector((state) => state.appointment.list);
  const [filtered, setFiltered] = useState([]);

  const columns =
    status === 'past'
      ? [
          {
            title: t('lesson_date'),
            dataKey: 'start_at',
            width: 20,
            render: (text, record) => (
              <span>{format(new Date(text), 'M/dd/yyyy hh:mmaa')}</span>
            ),
          },
          {
            title: t('tutor_name'),
            dataKey: 'tutor',
            width: 20,
            render: (text, record) => {
              return (
                <span>
                  {getAbbrName(
                    record.tutor.user.first_name,
                    record.tutor.user.last_name,
                  )}
                </span>
              );
            },
          },
          {
            title: t('level'),
            dataKey: 'student',
            width: 20,
            render: (text, record) => (
              <span>
                Level #{record.students[0].level ? record.students[0].level : 1}
              </span>
            ),
          },
          {
            title: t('level_topic'),
            dataKey: 'lesson',
            width: 20,
            render: (text, record) => <span>{record.lesson.type}</span>,
          },
          {
            title: t('where_left'),
            dataKey: 'where_left',
            width: 20,
            render: (item, record) =>
              record.completed ? t('finished') : t('unfinished'),
          },
        ]
      : [
          {
            title: t('lesson_date'),
            dataKey: 'start_at',
            width: 20,
            render: (text, record) => (
              <span>{format(new Date(text), 'M/dd/yyyy hh:mmaa')}</span>
            ),
          },
          {
            title: t('tutor_name'),
            dataKey: 'tutor',
            width: 20,
            render: (text, record) => {
              return (
                <span>
                  {getAbbrName(
                    record.tutor.user.first_name,
                    record.tutor.user.last_name,
                  )}
                </span>
              );
            },
          },
          {
            title: t('level'),
            dataKey: 'student',
            width: 20,
            render: (text, record) => (
              <span>
                {t('level_n', {
                  n: record.students[0].level ? record.students[0].level : 1,
                })}
              </span>
            ),
          },
          {
            title: t('level_topic'),
            dataKey: 'lesson',
            width: 20,
            render: (text, record) => <span>{record.lesson.type}</span>,
          },
        ];

  useEffect(() => {
    if (appointments) {
      const today = new Date();
      let filtered = appointments.filter((apt) => {
        const date = new Date(apt.start_at);
        if (status === 'upcoming') return date >= today;
        if (status === 'past') return date < today;
      });
      setFiltered(filtered);
    }
  }, [appointments]);

  useEffect(() => {
    if (student) {
      dispatch(getAppointments({ student_id: student.student.id }));
    }
  }, [student]);

  const goToStudentProfile = () => {
    history.push(`/tutor/students/${student.student.id}`);
  };

  return (
    <>
      <ModalUserInfo
        title={title}
        visible={visible}
        user={student}
        onDismiss={onDismiss}
      >
        <div className="scroll-layout">
          <div className="edit-student-lesson-wrapper">
            <UserHeader user={student} onAction={goToStudentProfile} />
            <p className="sub-title">
              {student.first_name}'s{' '}
              {status === 'past' ? t('past_lessons') : t('upcoming_lessons')}{' '}
              {`{${filtered.length}}`}
            </p>
            {loading ? (
              <div className="flex justify-content-center align-items-center">
                <Loader
                  className="align-center"
                  type="Audio"
                  color="#00BFFF"
                  height={50}
                  width={50}
                />
              </div>
            ) : (
              <CustomTable
                className="full-height"
                data={filtered}
                columns={columns}
                enableSeeAll={false}
              />
            )}
          </div>
        </div>
      </ModalUserInfo>
    </>
  );
};

export default ModalLesson;
