import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import Layout from '../../components/Layout';
import '../../assets/styles/student.scss';

import {
  format,
  startOfMonth,
  endOfMonth,
  addMinutes,
  addMonths,
  subMonths,
} from 'date-fns';
import CustomTable from '../../components/CustomTable';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import { getAppointments } from '../../actions/appointment';
import AppointmentApi from '../../api/AppointmentApi';
import NotificationManager from '../../components/NotificationManager';
import ModalConfirmLesson from './ScheduleLesson/ModalConfirmLesson';

const GroupLessons = () => {
  const [t] = useTranslation('translation');

  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  const fetchAppointments = () => {
    let queryObj = {
      type: 'group',
      from: currentDate.toISOString(),
      to: endOfMonth(currentDate).toISOString(),
    };
    dispatch(getAppointments(queryObj));
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const appointments = useSelector((state) => state.appointment.list);

  const onBook = async (group) => {
    try {
      await AppointmentApi.joinLesson(group.id);

      setIsConfirmModal(group.start_at);
      fetchAppointments();
    } catch (e) {
      NotificationManager.error(
        e?.response?.data?.error?.message || t('server_issue'),
        t,
      );
    }
  };

  const columns = [
    {
      title: t('class_type'),
      dataKey: 'lesson',
      width: 15,
      render: (text, record) => (
        <p className="lesson-type">{record.lesson.type}</p>
      ),
    },
    {
      title: t('lesson_date'),
      dataKey: 'start_at',
      width: 15,
      render: (text, record) => (
        <p>{format(new Date(record.start_at), 'EEE, MMM do')}</p>
      ),
    },
    {
      title: t('lesson_time'),
      dataKey: 'start_at',
      width: 15,
      render: (text, record) => (
        <p>
          {format(new Date(record.start_at), 'h:mm')} -{' '}
          {format(
            addMinutes(new Date(record.start_at), record.duration),
            'h:mm aaa',
          )}
        </p>
      ),
    },
    {
      title: t('seats'),
      dataKey: 'students',
      width: 15,
      render: (text, record) => (
        <p>
          {record.students.length} / {record.seat_count}
        </p>
      ),
    },
    {
      title: t('leaded_by_tutor'),
      dataKey: 'tutor',
      width: 20,
      render: (text, record) => (
        <div className="with-avatar">
          <Avatar avatar={record?.tutor?.user?.avatar} />
          <p>
            {record?.tutor?.user?.first_name} {record?.tutor?.user?.last_name}
          </p>
        </div>
      ),
    },
    {
      title: '',
      dataKey: 'actions',
      width: 20,
      render: (text, record) => (
        <div className="actions">
          <a className="outlined btn-see-details">{t('see_details')}</a>
          {/* <a className="btn-enroll" onClick={() => onBook(record)}>{t('enroll')}</a> */}
          {!record.completed ? (
            record.students.find((s) => s?.id === user?.student_profile?.id) ? (
              <a className="btn-joined">{t('joined')}</a>
            ) : (
              <a className="btn-enroll" onClick={() => onBook(record)}>
                {t('enroll')}
              </a>
            )
          ) : (
            <a className="btn-completed">{t('completed')}</a>
          )}
        </div>
      ),
    },
  ];

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <Layout>
      <div className="group-lessons-layout">
        <h4 className="main-title">{t('group_lesson')}</h4>
        <div className="divider" />

        <div className="calendar-header">
          <div className="icon" onClick={prevMonth}>
            <img src={LeftArrow} alt="" />
          </div>
          <div className="column col-center">
            <span>{format(currentDate, 'MMM yyyy')}</span>
          </div>
          <div className="icon" onClick={nextMonth}>
            <img src={RightArrow} alt="" />
          </div>
        </div>

        <div className="filter">
          <div>
            {/* <p>{t('placeholder_sortby')}</p>
            <Select
              value={tutorOptions}
              onChange={handleChange}
              options={tutorOptions}
              styles={customStyles}
              placeholder={t('tutor')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="tutor"
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            />
            <Select
              value={selectedClassTypeOption}
              onChange={handleChange}
              options={optionsClassType}
              styles={customStyles}
              placeholder={t('class_type')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="tutor"
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            />
            <Select
              value={selectedLevelOption}
              onChange={handleChange}
              options={optionsLevel}
              styles={customStyles}
              placeholder={t('level')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="tutor"
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            /> */}
          </div>
          <p>
            {t('showing_n_classes', {
              n: appointments ? appointments.length : 0,
            })}
          </p>
        </div>
        <div className="scroll-layout">
          {appointments && (
            <CustomTable columns={columns} data={appointments} />
          )}
        </div>
        <ModalConfirmLesson
          visible={!!isConfirmModal}
          start_at={isConfirmModal ? new Date(isConfirmModal) : new Date()}
          onDismiss={() => setIsConfirmModal(false)}
        />
      </div>
    </Layout>
  );
};

export default GroupLessons;
