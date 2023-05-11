import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import '../../assets/styles/student.scss';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import { ModalUserInfo } from './ModalUserInfo';
import { UserHeader } from '../../components/UserHeader';
import CustomTable from '../../components/CustomTable';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  addMonths,
  subMonths,
  parseISO,
  subDays,
} from 'date-fns';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import { useElements } from '@stripe/react-stripe-js';
import { ModalActionLesson } from './ModalActionLesson';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../actions/admin';
import { getAppointments } from '../../actions/appointment';
import { filterLessonsByStatus } from '../../constants/global';
import Loader from 'react-spinners/ClipLoader';

const ModalEditTutorLesson = ({
  tutor,
  onDismiss,
  visible,
  date,
  onGoToProfile,
}) => {
  const [t] = useTranslation(['modals', 'lessons']);
  const [currentDate, setCurrentDate] = useState(date);
  const [isActionModal, setIsActionModal] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [action, setAction] = useState(null);
  const [actionModalTitle, setActionModalTitle] = useState('');
  const [actionModalSubtitle, setActionModalSubtitle] = useState('');
  const appointments = useSelector((state) => state.appointment.list);
  const appointment_loading = useSelector((state) => state.appointment.loading);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [filterLessons, setFilterLessons] = useState([]);

  const dispatch = useDispatch();
  const columns_upcoming = [
    {
      title: t('lesson_date', { ns: 'lessons' }),
      dataKey: 'lessonDate',
      width: 20,
    },
    {
      title: t('student'),
      dataKey: 'student',
      width: 20,
    },
    {
      title: t('lesson'),
      dataKey: 'lessonType',
      width: 20,
    },
    {
      title: 'Action',
      dataKey: 'actions',
      width: 40,
      render: (item, record) => (
        <div className="actions">
          <a
            onClick={() => {
              setAction('assign');
              setLesson(record);
            }}
          >
            {t('assign_substitute')}
          </a>
          <a
            onClick={() => {
              setAction('reschedule');
              setLesson(record);
            }}
          >
            {t('reschedule')}
          </a>
          <a
            onClick={() => {
              setAction('delete');
              setLesson(record);
            }}
            className="outlined"
          >
            {t('delete')}
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (tutor) {
      dispatch(getAppointments({ tutor_id: tutor.id }));
    }
  }, [tutor]);

  useEffect(() => {
    if (appointments) {
      setUpcomingLessons(filterLessonsByStatus('upcoming', appointments));
    }
  }, [appointments]);

  useEffect(() => {
    if (upcomingLessons) {
      setFilterLessons(
        upcomingLessons.filter((lesson) =>
          isSameDay(currentDate, new Date(lesson.lessonDate)),
        ),
      );
    }
  }, [currentDate, upcomingLessons]);

  useEffect(() => {
    if (lesson) {
      switch (action) {
        case 'assign':
          setActionModalTitle(t('assign_substitute_lesson'));
          setActionModalSubtitle(t('choose_substitution_tutor'));
          break;
        case 'reschedule':
          setActionModalTitle(t('reschedule_lesson'));
          setActionModalSubtitle(t('choose_new_date'));
          break;
        case 'delete':
          setActionModalTitle(t('delete_lesson'));
          setActionModalSubtitle(t('delete_following_lesson'));
          break;
      }
      setIsActionModal(true);
    }
  }, [lesson, action]);

  const nextMonth = () => {
    let newDate = addDays(currentDate, 1);
    setCurrentDate(newDate);
  };

  const prevMonth = () => {
    let newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
  };

  return (
    <>
      <ModalUserInfo
        title={t('edit_tutor_lesson')}
        visible={visible}
        onDismiss={onDismiss}
      >
        <div className="scroll-layout">
          {appointment_loading ? (
            <Loader
              className="align-center"
              type="Audio"
              color="#00BFFF"
              height={50}
              width={50}
            />
          ) : (
            <div className="edit-student-lesson-wrapper">
              <UserHeader
                user={tutor.user}
                onAction={onGoToProfile ? onGoToProfile : onDismiss}
              />
              <div className="pick-date">
                <div className="icon" onClick={prevMonth}>
                  <img src={LeftArrow} alt="" />
                </div>
                <div className="column col-center">
                  <span>{format(currentDate, 'eeee, do MMMM yyyy')}</span>
                </div>
                <div className="icon" onClick={nextMonth}>
                  <img src={RightArrow} alt="" />
                </div>
              </div>
              <p className="sub-title">
                {t('scheduled_lessons', { lessons: 3 })}
              </p>
              <CustomTable
                className="full-height"
                data={filterLessons}
                columns={columns_upcoming}
                enableSeeAll={false}
              />
            </div>
          )}
        </div>
      </ModalUserInfo>
      {isActionModal && (
        <ModalActionLesson
          title={actionModalTitle}
          subTitle={actionModalSubtitle}
          visible={true}
          lesson={lesson}
          onDismiss={() => setIsActionModal(false)}
          onAnotherAction={(action) => setAction(action)}
          action={action}
        />
      )}
    </>
  );
};

export default ModalEditTutorLesson;
