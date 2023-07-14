import Layout from '../../components/Layout';
import { useEffect } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { useLazyQuery } from '@apollo/client';
import {
  APPOINTMENTS_QUERY,
  APPROVE_APPOINTMENT,
  CANCEL_APPOINTMENT,
} from '../../modules/auth/graphql';

const ApproveRequest = () => {
  const { user } = useAuth();
  const [t] = useTranslation(['lessons', 'common']);
  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [getAppointments, {data: appointments}] = useLazyQuery(APPOINTMENTS_QUERY);
  const [approveAppointment] = useLazyQuery(APPROVE_APPOINTMENT);
  const [cancelAppointment] = useLazyQuery(CANCEL_APPOINTMENT);

  useEffect(() => {
    getAppointments({
      mentorId: user?.tutor?.id,
      status: 'scheduled,paid,completed,in_progress',
    });
  }, [user]);

  const onClickApprove = async ({ id }) => {
    approveAppointment({
      variables: {
        id: parseInt(id),
        mentorId: user?.mentor?.id,
      },
    });
    getAppointments({
      mentorId: user?.tutor?.id,
      status: 'scheduled',
    });
  };

  const onClickCancel = async ({ id }) => {
    cancelAppointment({
      variables: {
        id: parseInt(id)
      }
    });
    getAppointments({
      mentorId: user?.tutor?.id,
      status: 'scheduled',
    });
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
              studentName: `${event.students[0].user.firstName} ${event.students[0].user.lastName}`,
              lessonNumber: event.lesson.id,
              lessonDate: event.startAt,
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
      </div>
    </Layout>
  );
};

export default ApproveRequest;
