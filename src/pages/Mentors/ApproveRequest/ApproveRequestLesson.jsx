import React, { useState } from 'react';
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
import Button from 'src/components/Form/Button';

export const ApproveRequestLesson = ({ lesson, refetchAppointments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [t] = useTranslation('common');

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [approveAppointment] = useMutation(APPROVE_APPOINTMENT);
  const [disabled, setDisabled] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setTabIndex(0);
  };

  const onClickApprove = async ({ id }) => {
    setDisabled(true);
    approveAppointment({
      variables: {
        id: parseInt(id),
        mentorId: parseInt(user?.mentor?.id),
      },
      onCompleted: async () => {
        await refetchAppointments();
        notify('Lesson successfully approved');
        setDisabled(false);
      },
      onError: () => {
        notify('Failed to approve lesson');
        setDisabled(false);
      },
    });
  };

  const onClickCancel = async () => {
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
          <Button
            disabled={disabled}
            theme="outline"
            onClick={() => {
              onClickCancel(lesson);
            }}
          >
            {t('cancel')}
          </Button>
        </td>
        <td className="td-item m-0">
          <Button
            disabled={disabled}
            theme="outline"
            onClick={() => {
              onClickApprove(lesson);
            }}
          >
            {t('approve')}
          </Button>
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
