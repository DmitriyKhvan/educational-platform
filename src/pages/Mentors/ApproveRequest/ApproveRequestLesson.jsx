import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  APPROVE_APPOINTMENT,
  // CANCEL_APPOINTMENT,
} from 'src/modules/auth/graphql';
import { useAuth } from 'src/modules/auth';
import notify from 'src/utils/notify';
import RescheduleAndCancelModal from 'src/components/student-dashboard/RescheduleAndCancelModal';
import { ModalType } from 'src/constants/global';
// import { differenceInHours } from 'date-fns';
// import Swal from 'sweetalert2';

export const ApproveRequestLesson = ({
  lesson,
  refetchAppointments,
  setApproveLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [t] = useTranslation('common');

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [approveAppointment, { loading }] = useMutation(APPROVE_APPOINTMENT);

  useEffect(() => {
    setApproveLoading(loading);
  }, [loading]);

  // const isLate = differenceInHours(new Date(lesson.startAt), new Date()) <= 24;

  const closeModal = () => {
    setIsOpen(false);
    setTabIndex(0);
  };

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

  const onClickCancel = async () => {
    // if (isLate) {
    //   Swal.fire({
    //     title: t('cannot_cancel'),
    //     text: t('cancel_error'),
    //     icon: 'error',
    //     confirmButtonText: t('ok'),
    //   });
    // } else {
    //   setIsOpen(true);
    // }

    setIsOpen(true);
  };

  return (
    <>
      <tr key={lesson.id} className="tr-center">
        <td className="td-item m-0">
          <p className="td-lesson">{'#' + lesson?.student.id}</p>
        </td>
        <td className="td-item m-0">
          <p className="td-lesson">{`${lesson?.student?.firstName} ${lesson?.student?.lastName}`}</p>
        </td>
        <td className="td-item m-0">
          <p className="td-lesson">{lesson?.student?.user.email}</p>
        </td>
        <td className="td-item m-0">
          <p className="td-topic-level">{lesson.id}</p>
        </td>
        <td className="td-item m-0">
          <div className="td-datetime td-datetime-border p-3">
            {moment(lesson.startAt)
              .tz(userTimezone)
              .format('ddd, MMM Do | hh:mm A')}
            {' → '}
            {moment(lesson.startAt)
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

      <RescheduleAndCancelModal
        data={lesson}
        isOpen={isOpen}
        closeModal={closeModal}
        setTabIndex={setTabIndex}
        setIsOpen={setIsOpen}
        fetchAppointments={refetchAppointments}
        tabIndex={tabIndex}
        type={ModalType.CANCEL}
        // cancelled={cancelled}
        // setCanceledLessons={setCanceledLessons}
        duration={lesson.duration}
      />
    </>
  );
};
