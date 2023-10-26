import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  APPROVE_APPOINTMENT,
  CANCEL_APPOINTMENT,
} from 'src/modules/auth/graphql';
import { useAuth } from 'src/modules/auth';
import notify from 'src/utils/notify';

export const ApproveRequestLesson = ({ lesson, refetchAppointments }) => {
  const [t] = useTranslation('common');

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [approveAppointment] = useMutation(APPROVE_APPOINTMENT);
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT);

  const onClickApprove = async ({ id }) => {
    approveAppointment({
      variables: {
        id: parseInt(id),
        mentorId: parseInt(user?.mentor?.id),
      },
      onCompleted: () => {
        refetchAppointments();
        notify('Lesson successfully approved');
      },
    });
  };

  const onClickCancel = async ({ id }) => {
    cancelAppointment({
      variables: {
        id: parseInt(id),
      },
      onCompleted: () => {
        refetchAppointments();
        notify('Lesson successfully canceled');
      },
    });
  };

  return (
    <tr key={lesson.id} className="tr-center">
      <td className="td-item m-0">
        <p className="td-lesson">{'#' + lesson.id}</p>
      </td>
      <td className="td-item m-0">
        <p className="td-lesson">{lesson.studentName}</p>
      </td>
      <td className="td-item m-0">
        <p className="td-topic-level">{lesson.lessonNumber}</p>
      </td>
      <td className="td-item m-0">
        <div className="td-datetime td-datetime-border p-3">
          {moment(lesson.lessonDate).tz(userTimezone).format('ddd, MMM Do') +
            ' | '}
          {moment(lesson.lessonDate).tz(userTimezone).format('hh:mm A')}
          {' → '}
          {moment(lesson.lessonDate)
            .tz(userTimezone)
            .add(lesson?.duration, 'minutes')
            .format('hh:mm A')}
        </div>
      </td>
      <td className="td-item m-0">
        <Link
          className="td-button"
          to={`lesson-calendar/lesson/${lesson.id}`}
          onClick={(e) => {
            e.preventDefault();
            onClickCancel(lesson);
          }}
        >
          {t('cancel')}
        </Link>
      </td>
      <td className="td-item m-0">
        <Link
          className="td-button"
          to={`lesson-calendar/lesson/${lesson.id}`}
          onClick={(e) => {
            e.preventDefault();
            onClickApprove(lesson);
          }}
        >
          {t('approve')}
        </Link>
      </td>
    </tr>
  );
};
