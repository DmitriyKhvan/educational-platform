import CustomTable from '../../components/CustomTable';

import CalendarIcon from '../../assets/images/calendar.svg';
import CheckIcon from '../../assets/images/check.svg';
import ManIcon from '../../assets/images/man.svg';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import {
  approveAppointment,
  cancelAppointment,
  getAppointments,
} from '../../actions/appointment';
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import { getTutorInfo } from '../../actions/tutor';
import { getUserInfo } from '../../actions/user';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';

const ApproveRequest = () => {
  const appointments = useSelector((state) => state.appointment.list);
  const { user } = useAuth();
  const loading = useSelector((state) => state.tutor.loading);
  // const tutor = useSelector(state => state.tutor.info)
  const dispatch = useDispatch();
  const [t] = useTranslation(['lessons', 'common']);
  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  // useEffect(() => {
  //   dispatch(getUserInfo())
  // }, [dispatch])

  // useEffect(() => {
  //   if (user && user.tutor) {
  //     dispatch(getTutorInfo(user.tutor?.id))
  //   }
  // }, [user])

  useEffect(() => {
    if (user) {
      dispatch(
        getAppointments({ tutor_id: user?.tutor?.id, status: 'scheduled' }),
      );
    }
  }, [user]);

  const columns = [
    {
      title: t('student'),
      dataKey: 'studentName',
      width: 25,
    },
    {
      title: t('lesson'),
      dataKey: 'lessonNumber',
      width: 25,
    },
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 25,
    },
    {
      title: '',
      dataKey: 'actions',
      width: 25,
      render: (item, record) => (
        <div className="actions">
          <a onClick={() => onClickApprove(record)} className="outlined">
            {t('approve')}
          </a>
          <a onClick={() => onClickCancel(record)}>{t('cancel')}</a>
        </div>
      ),
    },
  ];

  const onClickApprove = async ({ id }) => {
    await dispatch(approveAppointment(id));
    dispatch(
      getAppointments({ tutor_id: user?.tutor?.id, status: 'scheduled' }),
    );
  };

  const onClickCancel = async ({ id }) => {
    await dispatch(cancelAppointment(id));
    dispatch(
      getAppointments({ tutor_id: user?.tutor?.id, status: 'scheduled' }),
    );
  };

  const displayLessonRequestTable = () => {
    const data =
      (appointments &&
        appointments
          .filter((event) => event.students.length > 0)
          .filter((event) => !event.students[0].GroupStudent.approved)
          .map((event) => {
            return {
              id: event.id,
              img: event.students[0].user.avatar,
              studentName: `${event.students[0].user.first_name} ${event.students[0].user.last_name}`,
              lessonNumber: event.lesson.type,
              lessonDate: event.start_at,
              duration: event.duration,
            };
          })) ||
      [];
    // return <CustomTable timezone={userTimezone} data={data} columns={columns} />
    return data;
  };

  const tableHead = [
    t('student_id', { ns: 'lessons' }),
    t('student_name', { ns: 'lessons' }),
    t('lesson_number', { ns: 'lessons' }),
    t('lesson_date', { ns: 'lessons' }),
  ];

  const renderTable = () =>
    displayLessonRequestTable().length !== 0 ? displayLessonRequestTable() : [];

  return (
    <Layout>
      <div className="main-dashboard p-5">
        <h4 className="main-title">
          {t('appointment_requests', { ns: 'lessons' })}
        </h4>
        <div className="divider" />
        <table className="table">
          <thead>
            <tr>
              {tableHead.map((x) => (
                <th scope="col" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderTable()?.map((event) => (
              <tr key={event.id} className="tr-center">
                <td className="td-item m-0">
                  <p className="td-lesson">{'#' + event.id}</p>
                </td>
                <td className="td-item m-0">
                  <p className="td-lesson">{event.studentName}</p>
                </td>
                <td className="td-item m-0">
                  <p className="td-topic-level">{event.lessonNumber}</p>
                </td>
                <td className="td-item m-0">
                  <div className="td-datetime td-datetime-border p-3">
                    {moment(event.lessonDate)
                      .tz(userTimezone)
                      .format('ddd, MMM Do') + ' | '}
                    {moment(event.lessonDate)
                      .tz(userTimezone)
                      .format('hh:mm A')}
                    {' → '}
                    {moment(event.lessonDate)
                      .tz(userTimezone)
                      .add(event?.duration, 'minutes')
                      .format('hh:mm A')}
                  </div>
                </td>
                <td className="td-item m-0">
                  <Link
                    className="td-button"
                    to={`appointments-calendar/lesson/${event.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onClickCancel(event);
                    }}
                  >
                    {t('cancel', { ns: 'common' })}
                  </Link>
                </td>
                <td className="td-item m-0">
                  <Link
                    className="td-button"
                    to={`appointments-calendar/lesson/${event.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onClickApprove(event);
                    }}
                  >
                    {t('approve', { ns: 'common' })}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <Loader
            className="align-center"
            type="BallTriangle"
            color="#00BFFF"
            height={100}
            width={100}
          />
        )}
      </div>
    </Layout>
  );
};

export default ApproveRequest;
