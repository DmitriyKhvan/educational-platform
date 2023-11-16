import Layout from '../../components/Layout';
import { useEffect } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { useMutation, useQuery } from '@apollo/client';
import notify from '../../utils/notify';
import {
  APPOINTMENTS_QUERY,
  APPROVE_APPOINTMENT,
  CANCEL_APPOINTMENT,
} from '../../modules/auth/graphql';

import '../../assets/styles/calendar.scss';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const ApproveRequest = () => {
  const { user } = useAuth();
  const [t] = useTranslation(['lessons', 'common']);
  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    data: appointments,
    loading,
    refetch,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: 'scheduled',
    },
    fetchPolicy: 'no-cache',
  });
  const [approveAppointment] = useMutation(APPROVE_APPOINTMENT, {
    onCompleted: () => {
      refetch({
        mentorId: user?.mentor?.id,
        status: 'scheduled',
      });
    },
  });
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT, {
    onCompleted: () => {
      refetch({
        mentorId: user?.mentor?.id,
        status: 'scheduled',
      });
      toast.success('Your lesson has been cancelled successfully');
    },
  });

  useEffect(() => {
    refetch();
  }, [user]);

  const onClickApprove = async ({ id }) => {
    approveAppointment({
      variables: {
        id: parseInt(id),
        mentorId: parseInt(user?.mentor?.id),
      },
    });

    notify('Lesson successfully approved', 'success');
    setTimeout(() => {
      refetch();
    }, 200);
  };

  const onClickCancel = async ({ id }) => {
    cancelAppointment({
      variables: {
        id: parseInt(id),
      },
    });
    notify('Lesson successfully canceled', 'success');
    setTimeout(() => {
      refetch();
    }, 200);
  };

  const displayLessonRequestTable = () => {
    if (!appointments) return [];
    const data =
      appointments?.lessons
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
        .map((event) => {
          return {
            id: event.id,
            img: event?.student?.user?.avatar?.url,
            studentName: `${event?.student?.user?.firstName} ${event?.student?.user?.lastName}`,
            lessonNumber: event.id,
            lessonDate: event.startAt,
            duration: event.duration,
          };
        }) || [];
    // return <CustomTable timezone={userTimezone} data={data} columns={columns} />
    return data;
  };

  const tableHead = [
    t('student_id', { ns: 'lessons' }),
    t('student_name', { ns: 'lessons' }),
    t('lesson_number', { ns: 'lessons' }),
    t('lesson_date', { ns: 'lessons' }),
  ];

  let lessons = displayLessonRequestTable();

  return (
    <Layout>
      {loading && <Loader height="calc(100vh - 80px)" />}
      <div className="main-dashboard p-3">
        <h4 className="title mb-2">
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
            {lessons.length === 0 && (
              <tr>
                <td colSpan={tableHead.length} align="center">
                  {t('no_lessons')}
                </td>
              </tr>
            )}
            {lessons.map((event) => (
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
                    to={`lesson-calendar/lesson/${event.id}`}
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
                    to={`lesson-calendar/lesson/${event.id}`}
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
